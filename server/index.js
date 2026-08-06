import { createServer as createHttpServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { PHASES } from 'Domain/phases';
import { isRoomNameShaped, MAX_ROOM_NAME_LENGTH } from 'Domain/roomNames';
import { isPlayerIdShaped } from 'Domain/rating';
import py from 'Domain/py';
import { createRoomStore, isMidGame, isNameShaped, MAX_ROOMS } from './rooms';
import { isCodeShaped } from './codes';
import { applyAction } from './apply';
import { createRateLimiter } from './validate';
import { createRoomPersistence } from './persistence';
import { createRatings } from './ratings';
import { createMatchQueue } from './queue';
import { createToken } from './codes';
import { createTurnstileGuard } from './turnstile';
import {
	CLIENT,
	SERVER,
	LEFT,
	parseMessage,
	seatMessage,
	roomMessage,
	roomsMessage,
	queuedMessage,
	snapshotMessage,
	leftMessage,
	ratedMessage,
	rejectedMessage,
	errorMessage,
	configMessage,
	MAX_MESSAGE_BYTES,
} from './protocol';

export const DEFAULT_PORT = 3007;

// Told to a socket whose seat a newer connection has just claimed. The client reads it and stops
// reconnecting; see the close handler in src/client/net/socketStore.js.
export const SEAT_RECLAIMED = 4000;

// Cloudflare drops an idle WebSocket at ~100s, so the connection has to say something first.
const PING_INTERVAL_MS = 25_000;
// DIRECT_PIECE arrives at hover rate while aiming, so snapshots are coalesced rather than sent
// per action.
const SNAPSHOT_COALESCE_MS = 40;
const SWEEP_INTERVAL_MS = 60_000;
// How often a socket watching the public list is told about it. A list that goes stale while you read
// it is worse than useless — the room you pick has filled up — so it is pushed rather than polled,
// but only to the sockets that asked and only when the answer has actually changed.
const LIST_INTERVAL_MS = 3000;
// Floor on how often one socket may ask for the list. A dropped request costs at most one interval,
// because the query it asked with is remembered either way.
const LIST_MIN_INTERVAL_MS = 250;
// How often the queue looks for a table. A second is far finer than the fifteen the queue holds out
// for, so the cost of the tick is nothing and a match is never noticeably late.
const MATCH_INTERVAL_MS = 1000;
const EVICT_AFTER_ALL_GONE_MS = 30 * 60_000;
const EVICT_HARD_CAP_MS = 3 * 60 * 60_000;
// 4-character codes are cheap to guess at without this. Raised for the test server rather than
// lowered in production: the online specs all join from one address, so the real limit is a
// ceiling on how many of them there can be.
const JOINS_PER_IP_PER_MINUTE = Number(process.env.HA_JOINS_PER_MINUTE) || 10;

// The browser's own rating id, or nothing. Anything malformed is treated as absent rather than
// refused: the only consequence of arriving without one is playing unrated, and that is not worth
// turning somebody away from a game over.
function playerIdOf(message) {
	return isPlayerIdShaped(message.playerId) ? message.playerId : null;
}

export function createGameServer({
	log = console.log,
	now = () => Date.now(),
	rng = Math.random,
	stateDir,
	ratingsDir,
	// Both overridable for tests: the real thing reads process.env.TURNSTILE_SECRET and calls the
	// real Cloudflare endpoint, and neither is available (or wanted) inside the test suite.
	turnstileSecret,
	turnstileFetch,
} = {}) {
	const persistence = createRoomPersistence({ log, ...(stateDir ? { dir: stateDir } : {}) });
	// Its own directory, never the rooms one — see the note at the top of ratings.js. Built before the
	// room store because the store reads ratings to put an average on every row of the finder.
	const ratings = createRatings({ log, now, ...(ratingsDir ? { dir: ratingsDir } : {}) });
	const rooms = createRoomStore({ now, rng, ratingFor: id => (id ? ratings.mmrFor(id) : null) });
	const allowAction = createRateLimiter({ now });
	const turnstile = createTurnstileGuard({
		log,
		...(turnstileSecret !== undefined ? { secret: turnstileSecret } : {}),
		...(turnstileFetch ? { fetchImpl: turnstileFetch } : {}),
	});

	// Live sockets live here, not on the room: a room has to stay JSON to be persistable.
	const sockets = new Map();
	const pendingSnapshots = new Map();
	const joinsByIp = new Map();
	// Sockets watching the public list, and the query each of them asked with. A socket becomes a
	// watcher by asking for the list and stops being one the moment it has a seat — the finder is
	// something you use on the way in, and a player at a table has no use for it.
	const watchers = new Map();
	const queue = createMatchQueue({ now });

	for (const room of persistence.loadAll()) {
		rooms.load(room);
	}

	if (rooms.size) {
		log(`reloaded ${rooms.size} room(s) from disk`);
	}

	function send(seatId, message) {
		const socket = sockets.get(seatId);

		if (socket && socket.readyState === socket.OPEN) {
			socket.send(JSON.stringify(message));
		}
	}

	// The one place a room frame is built, which is what makes "every seat is told the same thing in the
	// same frame" true — including the ratings.
	function broadcastRoom(room) {
		const message = roomMessage(room, id => (id ? ratings.mmrFor(id) : null));

		room.seats.forEach(seat => send(seat.id, message));
	}

	// Per seat, because each one sees a differently redacted state. This is the only place a
	// snapshot is built, so redaction cannot be bypassed by accident.
	function sendSnapshots(room) {
		if (room.phase === PHASES.START) {
			return;
		}

		room.seats.forEach(seat => send(seat.id, snapshotMessage(room, seat)));
	}

	function scheduleSnapshots(room) {
		if (pendingSnapshots.has(room.code)) {
			return;
		}

		pendingSnapshots.set(
			room.code,
			setTimeout(() => {
				pendingSnapshots.delete(room.code);
				sendSnapshots(room);
				persistence.save(room);
			}, SNAPSHOT_COALESCE_MS),
		);
	}

	function bind(socket, room, seat) {
		const previous = sockets.get(seat.id);

		if (previous && previous !== socket) {
			// 4000 rather than a plain close: the client reads the code and stands down instead of
			// reconnecting. Without that, the two sockets take the seat off each other forever.
			previous.close(SEAT_RECLAIMED, 'seat reclaimed');
		}

		watchers.delete(socket);
		// Seated, so neither the finder nor the queue is any use to this socket any more. The queue in
		// particular: an entry left behind would match this player into a second room.
		queue.remove(socket.queueKey);
		socket.queueKey = undefined;
		sockets.set(seat.id, socket);
		socket.seatId = seat.id;
		socket.roomCode = room.code;
		rooms.setConnected(room, seat, true);
	}

	// ─── Rating ─────────────────────────────────────────────────────────────────────────────────────
	//
	// Three moments, and they are the only three: a game that finished, somebody who walked out of one,
	// and a game nobody came back to. Everything else — a room that never started, a seat that
	// reconnected, a game still in progress — is not a result and is not rated.

	// Names are unique inside a room, so this is exact. Seats with no rating id are left out entirely
	// rather than given a placeholder: the rest of the table is then rated amongst themselves, which is
	// the right answer for a browser playing with storage disabled.
	function ratedPlayersOf(room) {
		return py.getPlacings(room.state.players, room.state.pieces).reduce((all, { name, place }) => {
			const seat = room.seats.find(other => other.name === name);

			return seat?.playerId ? [...all, { id: seat.playerId, name, place }] : all;
		}, []);
	}

	/**
	 * A game that reached its end.
	 *
	 * Cannot run twice for one room: the phase only becomes END inside `applyAction`, and
	 * `validateAction` refuses every action afterwards. `room.ratings` is stored anyway, because the
	 * score sheet reads it and it has to survive both a restart and a rejoin.
	 */
	function rateFinished(room) {
		if (room.ratings) {
			return;
		}

		const players = ratedPlayersOf(room);

		room.ratings = players.length > 1 ? ratings.recordGame({ code: room.code, players }) : [];

		const message = ratedMessage(room);

		room.seats.forEach(seat => send(seat.id, message));
	}

	/**
	 * Somebody out of a game in progress.
	 *
	 * `others` are the ids that were still at the table when they went, and `stranded` is the seat left
	 * with nothing to play, if going did that. Told to everybody involved before they are unseated,
	 * because `send` addresses by seat id — and worth telling: a penalty nobody is shown deters nobody.
	 */
	function rateWalkOut(room, leaver, others, stranded = null) {
		const ids = others.filter(seat => seat.playerId).map(seat => ({ id: seat.playerId, name: seat.name }));

		if (!leaver.playerId || !ids.length) {
			return;
		}

		const movement = ratings.recordQuit({
			code: room.code,
			id: leaver.playerId,
			name: leaver.name,
			others: ids,
			stranded: stranded?.playerId || null,
		});

		const message = ratedMessage({ code: room.code, ratings: movement });

		[leaver, ...(stranded ? [stranded] : [])].forEach(seat => send(seat.id, message));
	}

	/**
	 * A game nobody came back to, at the moment the sweeper gives up on it.
	 *
	 * Every seat that had gone takes the walk-out treatment against everybody else who was at the table,
	 * including the others who had also gone — so a table that all closed their laptops all lose rating,
	 * which is the honest reading of it. Nobody collects a stranded bonus here: nobody was left playing.
	 *
	 * Closing the tab and pressing LEAVE are the same thing from the table's point of view. The reason
	 * this is not simply `handleLeave` is that there is nobody left to tell.
	 */
	function rateAbandoned(room) {
		if (!isMidGame(room.phase)) {
			return;
		}

		const absent = room.seats.filter(seat => !seat.connected && seat.playerId);

		absent.forEach(seat =>
			rateWalkOut(
				room,
				seat,
				room.seats.filter(other => other.id !== seat.id),
			),
		);
	}

	// How long this browser must wait before joining anything, in seconds, or nothing at all.
	function cooldownOn(playerId) {
		const remaining = playerId ? ratings.cooldownFor(playerId) : 0;

		return remaining > 0 ? { seconds: Math.ceil(remaining / 1000) } : null;
	}

	function allowJoinFrom(ip) {
		const at = now();
		const recent = (joinsByIp.get(ip) || []).filter(time => at - time < 60_000);

		if (recent.length >= JOINS_PER_IP_PER_MINUTE) {
			joinsByIp.set(ip, recent);

			return false;
		}

		joinsByIp.set(ip, [...recent, at]);

		return true;
	}

	// The public list, and the socket's standing interest in it. Answered unconditionally, even when
	// the content is identical to the last frame this socket got: a client that asks and hears nothing
	// back sits on a spinner. The periodic refresh is the one that stays quiet when nothing changed.
	function handleList(socket, message) {
		const query = typeof message.query === 'string' ? message.query.slice(0, MAX_ROOM_NAME_LENGTH) : '';
		const at = now();
		const watcher = watchers.get(socket);

		if (watcher && at - watcher.at < LIST_MIN_INTERVAL_MS) {
			// Too soon. Remember what was asked and drop the send — clearing `sent` so the next
			// refresh is guaranteed to go out, even if this query happens to produce the same rows
			// as the last one did.
			watchers.set(socket, { query, at: watcher.at, sent: null });

			return;
		}

		const encoded = JSON.stringify(roomsMessage(rooms.list({ query })));

		watchers.set(socket, { query, at, sent: encoded });
		socket.send(encoded);
	}

	function refreshLists() {
		for (const [socket, watcher] of watchers) {
			if (socket.readyState !== socket.OPEN) {
				watchers.delete(socket);

				continue;
			}

			const encoded = JSON.stringify(roomsMessage(rooms.list({ query: watcher.query })));

			if (encoded === watcher.sent) {
				continue;
			}

			watcher.sent = encoded;
			socket.send(encoded);
		}
	}

	// ─── Automatch ──────────────────────────────────────────────────────────────────────────────────

	// Guarded, unlike the socket-direct sends elsewhere in this file, because a queued socket is the one
	// most likely to have gone: it has been sitting there for up to a minute doing nothing.
	function tell(socket, message) {
		if (socket && socket.readyState === socket.OPEN) {
			socket.send(JSON.stringify(message));
		}
	}

	function tellQueued(socket) {
		tell(socket, queuedMessage(queue.describe(socket.queueKey) || {}));
	}

	async function handleQueue(socket, message, ip) {
		if (!isNameShaped(message.name)) {
			return tell(socket, errorMessage('bad_name'));
		}

		// Somebody at a table has no use for the queue, and letting a seated socket queue would mean
		// matching a player into a second room they cannot be in.
		if (socket.seatId) {
			return tell(socket, errorMessage('already_seated'));
		}

		const playerId = playerIdOf(message);
		const waitingOut = cooldownOn(playerId);

		if (waitingOut) {
			return tell(socket, errorMessage('quit_timeout', waitingOut));
		}

		// A match opens a room, so queueing spends a join from this address exactly as opening one by
		// hand does. Otherwise the queue would be the way around the limit.
		if (!allowJoinFrom(ip)) {
			return tell(socket, errorMessage('slow_down'));
		}

		// Checked last, after every cheap and deterministic refusal: a captcha token is single-use, so
		// a shape error or a cooldown must not spend the one the player just solved.
		if (turnstile.enabled && !(await turnstile.verify(message.turnstileToken, ip))) {
			return tell(socket, errorMessage('bad_turnstile'));
		}

		const key = socket.queueKey || createToken();
		const { displaced } = queue.add({
			key,
			playerId,
			name: message.name.trim(),
			mmr: ratings.mmrFor(playerId),
			client: socket,
		});

		socket.queueKey = key;

		displaced.forEach(stale => {
			stale.client.queueKey = undefined;
			tell(stale.client, queuedMessage());
		});

		tellQueued(socket);
	}

	function handleUnqueue(socket) {
		queue.remove(socket.queueKey);
		socket.queueKey = undefined;
		tell(socket, queuedMessage());
	}

	/**
	 * A matched table.
	 *
	 * An ordinary room in every respect but two: it is private, so it never appears in the finder that
	 * nobody used to get here, and its code was never typed. The host is whoever had been waiting
	 * longest, and they press START exactly as they would in a room they had opened themselves.
	 */
	function seatMatch(group) {
		const room = rooms.create({ isPrivate: true });

		if (!room) {
			return group.forEach(entry => tell(entry.client, errorMessage('server_full')));
		}

		const seated = group.filter(entry => {
			const { seat, error } = rooms.addSeat(room, entry.name, entry.playerId);

			if (error) {
				// Unreachable in practice — the queue already refuses to put two of the same name at one
				// table, and a room this new cannot be full or started. Reported rather than swallowed so
				// that if it ever does happen, somebody is told instead of silently not being seated — and
				// told they have stopped searching too, or they sit watching a spinner for a match that has
				// already happened without them.
				tell(entry.client, errorMessage(error));
				tell(entry.client, queuedMessage());

				return false;
			}

			bind(entry.client, room, seat);
			send(seat.id, seatMessage(room, seat));

			return true;
		});

		if (!seated.length) {
			return forget(room);
		}

		broadcastRoom(room);
		persistence.save(room);
		log(`automatch seated ${seated.length} in ${room.code}`);
	}

	function matchmake() {
		// More than one table can come ready in the same tick once the queue is busy.
		for (let group = queue.formMatch(); group; group = queue.formMatch()) {
			queue.claim(group);
			seatMatch(group);
		}

		// Everybody still waiting is told where their search is up to. Pushed rather than left to the
		// client to work out, because the numbers move on their own as the window widens.
		queue.entries().forEach(entry => tellQueued(entry.client));
	}

	async function handleCreate(socket, message, ip) {
		if (!isNameShaped(message.name)) {
			// socket.send, not send(socket.seatId, …): a socket asking to create a room has no seat
			// yet, so addressing the reply by seat id sent it to nobody and a bad name failed in
			// silence.
			return socket.send(JSON.stringify(errorMessage('bad_name')));
		}

		// Absent is allowed and gets a drawn name — see rooms.create. Present and malformed is not:
		// that is a client sending something the lobby cannot produce.
		if (message.room !== undefined && !isRoomNameShaped(message.room)) {
			return socket.send(JSON.stringify(errorMessage('bad_room_name')));
		}

		// Checked before the rate limiter, so a refusal does not also spend one of this address's joins.
		const waiting = cooldownOn(playerIdOf(message));

		if (waiting) {
			return socket.send(JSON.stringify(errorMessage('quit_timeout', waiting)));
		}

		if (!allowJoinFrom(ip)) {
			return socket.send(JSON.stringify(errorMessage('slow_down')));
		}

		// Checked last, after every cheap and deterministic refusal: a captcha token is single-use, so
		// a shape error or a cooldown must not spend the one the player just solved.
		if (turnstile.enabled && !(await turnstile.verify(message.turnstileToken, ip))) {
			return socket.send(JSON.stringify(errorMessage('bad_turnstile')));
		}

		const room = rooms.create({ name: message.room, isPrivate: message.private });

		if (!room) {
			return socket.send(JSON.stringify(errorMessage('server_full')));
		}

		const { seat, error } = rooms.addSeat(room, message.name.trim(), playerIdOf(message));

		if (error) {
			return socket.send(JSON.stringify(errorMessage(error)));
		}

		bind(socket, room, seat);
		send(seat.id, seatMessage(room, seat));
		broadcastRoom(room);
		persistence.save(room);
	}

	async function handleJoin(socket, message, ip) {
		if (!isCodeShaped(message.code) || !isNameShaped(message.name)) {
			return socket.send(JSON.stringify(errorMessage('bad_join')));
		}

		// Only a *new* seat waits out a cooldown. `rejoin` deliberately does not check it: that is
		// reclaiming a seat this browser already holds, and refusing it would turn a refresh — or a
		// walk-out's own room, for the seconds before the client leaves it — into a lockout.
		const waiting = cooldownOn(playerIdOf(message));

		if (waiting) {
			return socket.send(JSON.stringify(errorMessage('quit_timeout', waiting)));
		}

		if (!allowJoinFrom(ip)) {
			return socket.send(JSON.stringify(errorMessage('slow_down')));
		}

		// Checked last, and — like `rejoin` skipping the cooldown above — deliberately absent from
		// `handleRejoin`: reclaiming a seat this browser already holds is not a new arrival, and a
		// captcha is single-use, so a shape error or a cooldown must not spend the one already solved.
		if (turnstile.enabled && !(await turnstile.verify(message.turnstileToken, ip))) {
			return socket.send(JSON.stringify(errorMessage('bad_turnstile')));
		}

		const room = rooms.get(message.code.toUpperCase());

		if (!room) {
			return socket.send(JSON.stringify(errorMessage('no_such_room')));
		}

		const { seat, error } = rooms.addSeat(room, message.name.trim(), playerIdOf(message));

		if (error) {
			return socket.send(JSON.stringify(errorMessage(error)));
		}

		bind(socket, room, seat);
		send(seat.id, seatMessage(room, seat));
		broadcastRoom(room);
		persistence.save(room);
	}

	// What makes a refresh survivable: the seat is reclaimed by token, not by connection.
	function handleRejoin(socket, message) {
		if (!isCodeShaped(message.code || '')) {
			return socket.send(JSON.stringify(errorMessage('bad_join')));
		}

		const room = rooms.get(message.code.toUpperCase());
		const seat = room && typeof message.token === 'string' ? rooms.seatByToken(room, message.token) : null;

		if (!seat) {
			return socket.send(JSON.stringify(errorMessage('seat_lost')));
		}

		// A reconnecting client is a fresh store counting from zero again, so the old high-water
		// mark would wrongly discard its first actions.
		seat.ackSeq = 0;
		// A seat from a room persisted before this browser had an id can be given one now. A seat that
		// already has one keeps it: the rating belongs to whoever has been playing, and a rejoin must not
		// be a way to move somebody else's game onto your own rating.
		seat.playerId = seat.playerId || playerIdOf(message);

		bind(socket, room, seat);
		send(seat.id, seatMessage(room, seat));
		broadcastRoom(room);
		sendSnapshots(room);

		// A refresh on the score sheet should still show what the game was worth. This is the whole
		// reason the result is stored on the room rather than only sent once.
		if (room.ratings) {
			send(seat.id, ratedMessage(room));
		}
	}

	function withSeat(socket, handler) {
		const room = rooms.get(socket.roomCode);
		const seat = room ? rooms.seatById(room, socket.seatId) : null;

		if (!room || !seat) {
			return socket.send(JSON.stringify(errorMessage('not_seated')));
		}

		return handler(room, seat);
	}

	function handleStart(socket) {
		return withSeat(socket, (room, seat) => {
			if (room.hostSeatId !== seat.id) {
				return send(seat.id, errorMessage('not_host'));
			}

			const { error } = rooms.start(room);

			if (error) {
				return send(seat.id, errorMessage(error));
			}

			broadcastRoom(room);
			sendSnapshots(room);
			persistence.save(room);
		});
	}

	// Re-dressing the room. Broadcasts the room frame and nothing else: the skin travels with the
	// seat list, not in the snapshot, so nobody's board is rebuilt and nobody's outstanding actions
	// are invalidated by a change of furniture.
	function handleSkin(socket, message) {
		return withSeat(socket, (room, seat) => {
			const { error } = rooms.setSkin(room, seat, message.skin);

			if (error) {
				return send(seat.id, errorMessage(error));
			}

			broadcastRoom(room);
			persistence.save(room);
		});
	}

	// Drops a room and everything still pointing at it. The scheduled snapshot matters: it captures the
	// room object and calls persistence.save on it, so a save landing after the file was removed would
	// write the room back and hand it to the next restart.
	function forget(room) {
		clearTimeout(pendingSnapshots.get(room.code));
		pendingSnapshots.delete(room.code);
		rooms.remove(room.code);
		persistence.remove(room.code);
	}

	// The socket stays open — the player is going back to the lobby, not off the internet — so what has
	// to go is everything tying it to a seat it no longer holds.
	function unseat(seatId) {
		const socket = sockets.get(seatId);

		sockets.delete(seatId);

		if (socket) {
			socket.seatId = undefined;
			socket.roomCode = undefined;
		}
	}

	function handleLeave(socket) {
		return withSeat(socket, (room, seat) => {
			// Both captured before `leave` mutates the seat list: who was at the table is exactly who the
			// leaver is rated against, and whether there was a game at all is what decides if it costs
			// anything.
			const wasMidGame = isMidGame(room.phase);
			const wereSeated = room.seats.filter(other => other.id !== seat.id);

			const { gone, dissolved } = rooms.leave(room, seat);

			if (wasMidGame) {
				// `gone` is the leaver plus anybody stranded by them, and stranding is capped at one seat
				// by construction — so this is that seat, or nobody.
				rateWalkOut(room, seat, wereSeated, gone[1] || null);
			}

			// Told before the socket is unseated, because `send` addresses by seat id.
			gone.forEach(departed => {
				send(departed.id, leftMessage(departed.id === seat.id ? LEFT.ASKED : LEFT.ALONE));
				unseat(departed.id);
			});

			if (dissolved) {
				forget(room);
				log(`room ${room.code} dissolved: nobody left in it`);

				return;
			}

			// The seat list is shorter, and so is the game's player list if one had been dealt — which is
			// a change to the state, so it goes out as a snapshot too.
			broadcastRoom(room);
			sendSnapshots(room);
			persistence.save(room);
		});
	}

	function handleReady(socket) {
		return withSeat(socket, (room, seat) => {
			const { error } = rooms.markReady(room, seat);

			if (error) {
				return send(seat.id, errorMessage(error));
			}

			broadcastRoom(room);
			sendSnapshots(room);
			persistence.save(room);
		});
	}

	function handleAction(socket, message) {
		return withSeat(socket, (room, seat) => {
			if (!allowAction(seat.id, message.action)) {
				return send(seat.id, rejectedMessage({ seq: message.seq, reason: 'rate_limited', version: room.version }));
			}

			const result = applyAction(room, seat, message.action, { now });

			if (!result.ok) {
				return send(seat.id, rejectedMessage({ seq: message.seq, reason: result.reason, version: result.version }));
			}

			if (Number.isInteger(message.seq)) {
				seat.ackSeq = message.seq;
			}

			if (room.phase === PHASES.END) {
				// Before the broadcast, so the frame that tells the table the game is over is followed by
				// what it did to their ratings rather than racing it.
				rateFinished(room);
				broadcastRoom(room);
			}

			scheduleSnapshots(room);
		});
	}

	async function handleMessage(socket, raw, ip) {
		const { message, error } = parseMessage(typeof raw === 'string' ? raw : raw.toString());

		if (error) {
			return socket.send(JSON.stringify(errorMessage(error)));
		}

		switch (message.type) {
			case CLIENT.CREATE:
				return handleCreate(socket, message, ip);
			case CLIENT.JOIN:
				return handleJoin(socket, message, ip);
			case CLIENT.REJOIN:
				return handleRejoin(socket, message);
			case CLIENT.LEAVE:
				return handleLeave(socket);
			case CLIENT.LIST:
				return handleList(socket, message);
			case CLIENT.START:
				return handleStart(socket);
			case CLIENT.READY:
				return handleReady(socket);
			case CLIENT.SKIN:
				return handleSkin(socket, message);
			case CLIENT.ACTION:
				return handleAction(socket, message);
			case CLIENT.QUEUE:
				return handleQueue(socket, message, ip);
			case CLIENT.UNQUEUE:
				return handleUnqueue(socket);
			case CLIENT.PING:
				return socket.send(JSON.stringify({ type: SERVER.PONG }));
			default:
				return socket.send(JSON.stringify(errorMessage('unknown_message')));
		}
	}

	function handleClose(socket) {
		const room = rooms.get(socket.roomCode);
		const seat = room ? rooms.seatById(room, socket.seatId) : null;

		watchers.delete(socket);
		// A socket that goes while waiting has stopped waiting. Without this, a match would form around a
		// client that is not there and the rest of the table would be seated with a ghost.
		queue.remove(socket.queueKey);

		// Whether this socket is still the registered one for its seat is exactly the question of
		// whether it was displaced by a newer connection. A displaced socket closing says nothing about
		// the seat — somebody else is holding it — so reporting the seat as disconnected there marked a
		// player who had just reloaded as offline, started the turn-grace clock under them, and
		// broadcast the room twice for a reconnection that had already succeeded.
		const wasCurrent = sockets.get(socket.seatId) === socket;

		if (wasCurrent) {
			sockets.delete(socket.seatId);
		}

		if (room && seat && wasCurrent) {
			rooms.setConnected(room, seat, false);
			broadcastRoom(room);
			persistence.save(room);
		}
	}

	function sweep() {
		const at = now();

		for (const room of rooms.all()) {
			const anyoneConnected = room.seats.some(seat => seat.connected);
			const idleFor = at - room.updatedAt;
			const ageFor = at - room.createdAt;

			if ((!anyoneConnected && idleFor > EVICT_AFTER_ALL_GONE_MS) || ageFor > EVICT_HARD_CAP_MS) {
				// Before the room is dropped, and only for the seats that had already gone: a game still
				// being played when it hits the three-hour cap must not cost the people playing it.
				rateAbandoned(room);
				room.seats.forEach(seat => sockets.delete(seat.id));
				forget(room);
				log(`evicted room ${room.code}`);
			}
		}
	}

	const httpServer = createHttpServer((request, response) => {
		if (request.method === 'GET' && request.url === '/healthz') {
			response.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });

			return response.end(
				JSON.stringify({
					ok: true,
					rooms: rooms.size,
					maxRooms: MAX_ROOMS,
					connections: sockets.size,
					persistence: persistence.enabled,
					// Whether the box can actually record a result, and how much history it replayed. Both
					// have been wrong on a deploy before — a state directory that is not writable is silent
					// by design — so they are worth being able to curl.
					ratings: ratings.stats(),
					uptime: Math.round(process.uptime()),
				}),
			);
		}

		response.writeHead(404, { 'content-type': 'text/plain' });
		response.end('not found\n');
	});

	const wss = new WebSocketServer({ noServer: true, maxPayload: MAX_MESSAGE_BYTES });

	httpServer.on('upgrade', (request, socket, head) => {
		const { pathname } = new URL(request.url, 'http://localhost');

		if (pathname !== '/ws') {
			socket.destroy();

			return;
		}

		wss.handleUpgrade(request, socket, head, ws => wss.emit('connection', ws, request));
	});

	wss.on('connection', (socket, request) => {
		// Only the leftmost hop, and only because nginx is configured to *set* this header to
		// $remote_addr rather than append to it. If it appended, a client could prepend a value
		// of its own and get a fresh rate-limit bucket on every attempt. Taking [0] as well means
		// a misconfigured proxy degrades to over-limiting rather than to no limit at all.
		const forwarded = request.headers['x-forwarded-for'];
		const ip = (forwarded ? String(forwarded).split(',')[0].trim() : request.socket.remoteAddress) || 'unknown';

		socket.isAlive = true;
		socket.on('pong', () => {
			socket.isAlive = true;
		});

		// Whether the bot check is even active, so the client knows whether to render a widget at
		// all — sent before this socket has asked for anything, and the same for every connection.
		socket.send(JSON.stringify(configMessage({ turnstileRequired: turnstile.enabled })));

		socket.on('message', async raw => {
			try {
				// handleMessage is async now that create/join/queue may call out to siteverify, so a
				// throw inside it — sync or from a rejected await — has to be caught here either way.
				await handleMessage(socket, raw, ip);
			} catch (error) {
				log(`error handling message: ${error.stack || error.message}`);
				socket.send(JSON.stringify(errorMessage('internal_error')));
			}
		});

		socket.on('close', () => handleClose(socket));
		socket.on('error', () => handleClose(socket));
	});

	const heartbeat = setInterval(() => {
		wss.clients.forEach(socket => {
			if (!socket.isAlive) {
				return socket.terminate();
			}

			socket.isAlive = false;
			socket.ping();
		});
	}, PING_INTERVAL_MS);

	const sweeper = setInterval(sweep, SWEEP_INTERVAL_MS);
	// One timer for every watcher rather than an invalidation hook in each of create / addSeat / start
	// / remove. A hook that gets forgotten leaves a stale list and nothing says so; a timer that
	// recomputes and compares cannot be forgotten, and costs nothing while nobody is looking.
	const lister = setInterval(refreshLists, LIST_INTERVAL_MS);
	const matcher = setInterval(matchmake, MATCH_INTERVAL_MS);

	heartbeat.unref?.();
	sweeper.unref?.();
	lister.unref?.();
	matcher.unref?.();

	return {
		httpServer,
		rooms,
		queue,
		sweep,
		refreshLists,
		matchmake,

		listen(port = DEFAULT_PORT, host = '127.0.0.1') {
			return new Promise(resolve => httpServer.listen(port, host, () => resolve(httpServer.address())));
		},

		close() {
			clearInterval(heartbeat);
			clearInterval(sweeper);
			clearInterval(lister);
			clearInterval(matcher);
			watchers.clear();
			pendingSnapshots.forEach(timer => clearTimeout(timer));
			pendingSnapshots.clear();
			wss.clients.forEach(socket => socket.terminate());

			return new Promise(resolve => {
				wss.close(() => httpServer.close(resolve));
			});
		},
	};
}

export default createGameServer;
