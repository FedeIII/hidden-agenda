import { DEFAULT_SKIN, isSkin } from 'Domain/skins';
import { createGameReducer, createInitialState } from 'Game/reducer';
import {
	syncState,
	TOGGLE_PIECE,
	MOVE_PIECE,
	DIRECT_PIECE,
	SNIPE,
	CLAIM_CONTROL,
	CANCEL_CONTROL,
	NEXT_TURN,
} from 'Game/actions';

// The online half of the transport seam. Satisfies the same getState/subscribe/dispatch contract
// as the local store, so every game component works unchanged in both modes; what it adds is a
// second observable for session state (room, seats, phase, connection), which only the lobby and
// the connection banner care about.

// The close code the server uses when a newer connection claims a seat this socket was holding. It
// is in the private 4000–4999 range and matches `bind` in server/index.js.
const SEAT_RECLAIMED = 4000;

const RECONNECT_MIN_MS = 500;
const RECONNECT_MAX_MS = 8000;
const PING_MS = 25_000;
// DIRECT_PIECE is dispatched on hover, so it is applied locally at once and sent at this rate.
const AIM_THROTTLE_MS = 50;

// Only aiming is applied before the server agrees. Everything else waits for the snapshot.
//
// Optimistically applying discrete actions turned out to be actively wrong here, not just
// redundant. A snapshot replaces the state wholesale, so a snapshot for action N arriving after
// action N+1 was applied locally silently reverted N+1 — and since followMouse went back to
// false with it, the next click was read as another move instead of a direction, and the server
// rejected it. Doing it correctly needs the server to ack a sequence number and the client to
// replay everything still outstanding on top of each snapshot.
//
// That machinery is not worth it for this game. A turn is a handful of discrete clicks, so one
// round trip each is imperceptible, and it makes the client's state exactly the server's. Aiming
// is the one continuous gesture — it fires on every hover — so it stays local, guarded by
// keepLocalAim below.
// Applied locally before the server agrees, then replayed on top of each snapshot until the
// server acknowledges them. Everything here has to be predictable from state this client holds —
// which is why the four actions that resolve against alignments it cannot see are absent: an
// alignment reveal, an accusation, and dealing.
const PREDICT_LOCALLY = new Set([
	TOGGLE_PIECE,
	MOVE_PIECE,
	DIRECT_PIECE,
	SNIPE,
	CLAIM_CONTROL,
	CANCEL_CONTROL,
	NEXT_TURN,
]);

const STORAGE_PREFIX = 'ha:room:';
// The seats this browser holds, newest first, alongside the tokens. The tokens are what a rejoin
// needs; this is what the *lobby* needs, because a player who arrives at the front door rather than
// by refreshing has no room code in the URL and nothing else could tell them they are still in a game.
const SEATS_KEY = 'ha:seats';
const MAX_REMEMBERED_SEATS = 8;
// The server evicts a room three hours after it was opened, whatever is happening in it, so a seat
// older than that provably does not exist any more. Pruning by age keeps the offer honest without a
// round trip to find out.
const SEAT_MEMORY_MS = 3 * 60 * 60_000;

function readToken(code) {
	try {
		return window.localStorage.getItem(STORAGE_PREFIX + code);
	} catch {
		return null;
	}
}

function writeToken(code, token) {
	try {
		window.localStorage.setItem(STORAGE_PREFIX + code, token);
	} catch {
		// Private browsing, or storage disabled. A refresh will just lose the seat.
	}
}

// Anything unparseable, or from a build that wrote a different shape, reads as "no seats" rather
// than throwing on the way into the lobby.
function readSeats(at = Date.now()) {
	try {
		const stored = JSON.parse(window.localStorage.getItem(SEATS_KEY) || '[]');

		if (!Array.isArray(stored)) {
			return [];
		}

		return stored.filter(
			entry =>
				entry && typeof entry.code === 'string' && at - (entry.at || 0) < SEAT_MEMORY_MS && readToken(entry.code),
		);
	} catch {
		return [];
	}
}

function writeSeats(seats) {
	try {
		window.localStorage.setItem(SEATS_KEY, JSON.stringify(seats.slice(0, MAX_REMEMBERED_SEATS)));
	} catch {
		// As above: storage is a convenience here, never a dependency.
	}
}

// Merged rather than replaced, because the two halves arrive in different frames: the seat frame
// knows the player's name, the room frame that follows it knows the room's.
function rememberSeat(patch) {
	const at = Date.now();
	const existing = readSeats(at).find(entry => entry.code === patch.code) || {};

	writeSeats([{ ...existing, ...patch, at }, ...readSeats(at).filter(entry => entry.code !== patch.code)]);
}

function forgetSeat(code) {
	try {
		window.localStorage.removeItem(STORAGE_PREFIX + code);
	} catch {
		// Nothing to clean up if there was no storage to write to in the first place.
	}

	writeSeats(readSeats().filter(entry => entry.code !== code));
}

function socketUrl() {
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

	return `${protocol}//${window.location.host}/ws`;
}

function createObservable(initial) {
	let value = initial;
	const listeners = new Set();

	return {
		get: () => value,
		set(next) {
			value = next;
			listeners.forEach(listener => listener());
		},
		update(patch) {
			this.set({ ...value, ...patch });
		},
		subscribe(listener) {
			listeners.add(listener);

			return () => listeners.delete(listener);
		},
	};
}

// What a client with no seat looks like. A function rather than a literal because it is needed twice:
// on the way in, and again when a player leaves a room — and what is on screen after leaving is the
// lobby, which means the lobby's own state rather than the last room's with holes punched in it.
function unseatedSession({ code = null, error = null } = {}) {
	return {
		mode: 'online',
		// Idle unless something the player asked for is in flight. A client with no room in its URL is
		// looking at the lobby, and the socket the lobby opens is for the room list — announcing a
		// connection on the way in would be a message about nothing, on the first screen anybody reads.
		// A room code, on the other hand, means a seat is being reclaimed, which is worth saying.
		status: code ? 'connecting' : 'ready',
		code,
		seatId: null,
		name: null,
		phase: null,
		seats: [],
		hostSeatId: null,
		error,
		// The room's own name and whether it is listed. Both arrive with the seat list.
		roomName: null,
		roomPrivate: false,
		// The public list, as of the last frame the server pushed. `roomsTotal` is how many matched
		// before the server's cap, so the finder can say when it is not showing everything.
		rooms: [],
		roomsTotal: 0,
		// Seats this browser already holds, so the lobby can offer to go back to one instead of
		// making somebody who is mid-game start again.
		resumable: readSeats(),
		// Until the room frame arrives this is a client with no room, so it shows the menu's own
		// look. The server's choice replaces it, and every seat receives the same one.
		skin: DEFAULT_SKIN,
		// Whether an authoritative snapshot has arrived. The server sends seat, room and snapshot
		// as separate frames, so there is a window where the phase says "play" but the state is
		// still the empty initial one — and rendering the board against no players throws.
		synced: false,
	};
}

export function createSocketStore({ url = socketUrl(), roomCode = null } = {}) {
	const reduce = createGameReducer();

	const game = createObservable(createInitialState());
	const session = createObservable(unseatedSession({ code: roomCode }));

	// The last state the server told us about. Optimistic work is applied on top of it and
	// discarded back to it if the server disagrees.
	let authoritative = game.get();
	let version = -1;
	let seq = 0;
	let token = roomCode ? readToken(roomCode) : null;
	let intent = null; // what to send once connected: create / join / rejoin
	// The finder's standing query, or null when nobody is looking at the list. Kept here rather than
	// in the component so a reconnect re-asks by itself — the server drops a watcher with the socket.
	let listQuery = null;

	let socket = null;
	let reconnectDelay = RECONNECT_MIN_MS;
	let reconnectTimer = null;
	let pingTimer = null;
	let aimTimer = null;
	let pendingAim = null;
	// Predicted actions the server has not acknowledged yet, oldest first.
	let outstanding = [];
	let closedByUs = false;

	function send(message) {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify(message));

			return true;
		}

		return false;
	}

	function flushAim() {
		if (aimTimer) {
			clearTimeout(aimTimer);
			aimTimer = null;
		}

		if (pendingAim) {
			seq += 1;
			outstanding.push({ seq, action: pendingAim });
			send({ type: 'action', seq, action: pendingAim });
			pendingAim = null;
		}
	}

	// Returns whether it got out, which is what `sendIntent() || connect()` reads. It used to return
	// nothing at all, so that expression always fell through to connect() — a client that already had
	// a socket opened a second one, the first was orphaned, and the orphan's close handler scheduled a
	// reconnect. The result was a socket every half second and a room broadcast to every seat on each
	// cycle. Nothing failed; it just meant a page that had lost the race spent its time reconnecting
	// instead of rendering, which is how a reload after a move became a five-second wait.
	function sendIntent() {
		if (!intent) {
			return false;
		}

		if (intent.kind === 'create') {
			return send({ type: 'create', name: intent.name, room: intent.room, private: intent.private });
		}

		if (intent.kind === 'join') {
			return send({ type: 'join', code: intent.code, name: intent.name });
		}

		if (intent.kind === 'rejoin') {
			return send({ type: 'rejoin', code: intent.code, token: intent.token });
		}

		return false;
	}

	// A snapshot is the truth as of the actions the server had seen. Anything this client has done
	// since then is still real and has to go back on top, or the snapshot silently undoes it — and
	// a half-undone move leaves the next click meaning something different from what the player
	// intended. This is what makes prediction safe rather than merely fast.
	function withOutstanding(base) {
		let state = outstanding.reduce((next, entry) => reduce(next, entry.action), base);

		if (pendingAim) {
			// Not sent yet, so it has no sequence number, but the pointer is already there.
			state = reduce(state, pendingAim);
		}

		return state;
	}

	function onMessage(raw) {
		let message;

		try {
			message = JSON.parse(raw);
		} catch {
			return;
		}

		switch (message.type) {
			case 'seat':
				token = message.token;
				writeToken(message.code, message.token);
				rememberSeat({ code: message.code, name: message.name });
				// So a refresh — and a shared link — lands back in the same room.
				window.history.replaceState(null, '', `#/r/${message.code}`);
				intent = { kind: 'rejoin', code: message.code, token: message.token };
				// Seated, so the finder is over. The server has already stopped counting this socket
				// as a watcher; this is the client agreeing rather than asking again on reconnect.
				listQuery = null;
				session.update({
					code: message.code,
					seatId: message.seatId,
					name: message.name,
					error: null,
					rooms: [],
					resumable: readSeats(),
				});
				break;

			case 'rooms':
				session.update({ rooms: message.rooms || [], roomsTotal: message.total || 0 });
				break;

			// This seat is no longer in that room, either because the player asked or because everybody
			// else went and a game of this needs two. The socket stays open — they are going back to the
			// lobby, not off the internet — so everything that was about the room has to go instead.
			case 'left': {
				const { code } = session.get();

				forgetSeat(code);
				intent = null;
				token = null;
				version = -1;
				seq = 0;
				outstanding = [];
				pendingAim = null;
				authoritative = createInitialState();
				// Through the reducer rather than straight into the observable, the same way a snapshot
				// goes in: every state change in the app goes through exactly one door.
				game.set(reduce(game.get(), syncState(createInitialState())));
				// The hash is what puts a reload back into a room, and there is no room to go back to.
				window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
				session.set(unseatedSession({ error: message.reason === 'left_alone' ? 'left_alone' : null }));
				break;
			}

			case 'room':
				rememberSeat({ code: message.code, room: message.name });
				session.update({
					status: 'ready',
					phase: message.phase,
					seats: message.seats,
					hostSeatId: message.hostSeatId,
					roomName: message.name || message.code,
					roomPrivate: Boolean(message.private),
					resumable: readSeats(),
					// The room's look, chosen once when it was made. It arrives with the seat list
					// rather than in the snapshot because it is not game state — it survives being
					// redacted, and a seat that has not been dealt anything yet still needs it.
					skin: isSkin(message.skin) ? message.skin : DEFAULT_SKIN,
				});
				break;

			case 'snapshot':
				// Out-of-order or stale frames are ignored rather than trusted.
				if (message.v < version) {
					break;
				}

				version = message.v;
				authoritative = message.state;
				outstanding = outstanding.filter(entry => entry.seq > (message.ack || 0));
				// Through the reducer rather than straight into the observable, so every state
				// change in the app goes through exactly one door. SYNC_STATE exists for this.
				game.set(reduce(game.get(), syncState(withOutstanding(message.state))));
				session.update({ phase: message.phase, synced: true });
				break;

			case 'rejected': {
				// That action never happened, and anything predicted after it was predicated on
				// it, so both go. What is left is replayed on the last state the server agreed to.
				const at = outstanding.findIndex(entry => entry.seq === message.seq);
				outstanding = at === -1 ? outstanding : outstanding.slice(0, at);
				game.set(withOutstanding(authoritative));
				session.update({ error: message.reason });
				break;
			}

			case 'error': {
				// A seat this browser remembered is gone — the room was evicted, or its code has been
				// recycled since. Forget it, and if we know who the player wanted to be, take the
				// second door and join as a new seat instead of leaving them looking at a dead offer.
				if (message.reason === 'seat_lost' && intent?.kind === 'rejoin') {
					const { code, name, retried } = intent;

					forgetSeat(code);
					session.update({ resumable: readSeats() });

					if (name && !retried) {
						intent = { kind: 'join', code, name, retried: true };
						sendIntent();

						break;
					}
				}

				// Only 'connecting' is resolved by an error arriving; every other status is about the
				// socket, not about the request. Writing `status: undefined` here — which is what this
				// did — cleared it, and useCanAct reads `status === 'ready'`, so any error frame
				// mid-game quietly stopped the player being able to act at all.
				session.update({
					error: message.reason,
					...(session.get().status === 'connecting' ? { status: 'ready' } : {}),
				});
				break;
			}

			default:
				break;
		}
	}

	function scheduleReconnect() {
		if (closedByUs || reconnectTimer) {
			return;
		}

		session.update({ status: 'reconnecting' });
		reconnectTimer = setTimeout(() => {
			reconnectTimer = null;
			connect();
		}, reconnectDelay);

		reconnectDelay = Math.min(RECONNECT_MAX_MS, reconnectDelay * 2);
	}

	function connect() {
		// One socket at a time. A socket that is still CONNECTING cannot be sent on, so `send` returns
		// false and the caller would otherwise open another beside it; the intent is sent from the
		// 'open' handler instead, which is where it was always going to be sent from anyway.
		if (socket && (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN)) {
			return;
		}

		socket = new WebSocket(url);

		socket.addEventListener('open', () => {
			reconnectDelay = RECONNECT_MIN_MS;
			sendIntent();

			// A watcher of the public list is tracked per socket on the server, so a reconnect has to
			// ask again or the finder stops updating without ever saying so.
			if (listQuery !== null) {
				send({ type: 'list', query: listQuery });
			}

			pingTimer = setInterval(() => send({ type: 'ping' }), PING_MS);
		});

		socket.addEventListener('message', event => onMessage(event.data));

		socket.addEventListener('close', event => {
			clearInterval(pingTimer);

			// The server says another connection has taken this seat: a second tab, or a page that
			// reloaded while this one was still open. Reconnecting would take it straight back, and the
			// two would then trade the seat forever — with every action landing on whichever socket had
			// just lost it. Standing down is the only stable answer, and the seat is not lost: it is
			// being played from the window that asked most recently.
			if (event.code === SEAT_RECLAIMED) {
				session.update({ status: 'displaced' });

				return;
			}

			scheduleReconnect();
		});

		socket.addEventListener('error', () => {
			// 'close' follows, which is where reconnection is handled.
		});
	}

	function dispatch(action) {
		if (!action || typeof action.type !== 'string') {
			return;
		}

		if (action.type === DIRECT_PIECE) {
			// Applied at once so aiming stays responsive, then coalesced on the wire.
			game.set(reduce(game.get(), action));
			pendingAim = action;

			if (!aimTimer) {
				aimTimer = setTimeout(flushAim, AIM_THROTTLE_MS);
			}

			return;
		}

		// Anything else supersedes a pending aim, so the server sees them in the order the player
		// performed them.
		flushAim();

		seq += 1;

		if (PREDICT_LOCALLY.has(action.type)) {
			game.set(reduce(game.get(), action));
			outstanding.push({ seq, action });
		}

		send({ type: 'action', seq, action });
	}

	function createRoom(name, { room = null, isPrivate = false } = {}) {
		intent = { kind: 'create', name, room: room || undefined, private: isPrivate };
		session.update({ status: 'connecting', error: null });
		sendIntent() || connect();
	}

	/**
	 * Enters a room by code, from the finder or from the code field — the same operation either way.
	 *
	 * A token for that code turns this into a rejoin, which is what makes selecting a room you are
	 * already in put you back in your seat rather than fail with `room_already_started`. The name is
	 * carried along even then, so an expired token can fall back to joining as somebody new.
	 */
	function joinRoom(code, name) {
		const stored = readToken(code);

		intent = stored ? { kind: 'rejoin', code, token: stored, name } : { kind: 'join', code, name };
		session.update({ status: 'connecting', error: null });
		sendIntent() || connect();
	}

	// Asking for the public list is also what opens the socket on the way into the lobby. Status is
	// deliberately left alone: nothing the player asked for is in flight, so a socket that will not
	// open should read as "there is no server here" — which is the hot-seat hint — rather than as a
	// failed attempt to do something.
	function listRooms(query = '') {
		listQuery = query;
		send({ type: 'list', query }) || connect();
	}

	/**
	 * Opens the socket. Called from an effect, never during render, and that is the whole point.
	 *
	 * This used to run at construction — and constructing the store happens inside a `useMemo`, which
	 * React is entitled to call more than once for a single mounted component and does. Two stores
	 * were built, two sockets were opened, and only the one React kept was ever closed. The orphan
	 * then rejoined, the server handed the seat to it and closed the other with `seat reclaimed`, that
	 * one's close handler reconnected and took the seat straight back, and the two traded it every few
	 * hundred milliseconds forever.
	 *
	 * What that looked like from the outside was a refresh that appeared to work: the board came back,
	 * because a snapshot does arrive. But every action after it was dispatched onto whichever socket
	 * had just lost the seat, so `send` returned false and the move went nowhere — the player saw it
	 * happen locally, since discrete actions are predicted, and nobody else at the table ever did.
	 *
	 * A socket is a side effect. It belongs in an effect, where React promises exactly one live copy.
	 */
	function open() {
		// A remount after close() — StrictMode does exactly this in development — is a real open again.
		closedByUs = false;

		// A room code in the URL means "put me back in that room" — try the stored token first. This is
		// the whole of what makes a refresh mid-game seamless: the hash survives the reload, the token
		// survives it in storage, and the seat is reclaimed before anything is rendered.
		if (roomCode && token) {
			intent = { kind: 'rejoin', code: roomCode, token };
			connect();
		} else if (roomCode) {
			// We know the room but have no seat in it. The lobby will ask for a name.
			session.update({ status: 'ready', phase: null });
			connect();
		}
	}

	return {
		getState: game.get,
		subscribe: game.subscribe,
		dispatch,
		open,

		getSession: session.get,
		subscribeSession: session.subscribe,

		createRoom,
		joinRoom,
		listRooms,
		// Leaving the finder. The server forgets a watcher when the socket goes either way; this stops
		// a reconnect from re-subscribing to a list nobody is looking at.
		stopListing: () => {
			listQuery = null;
		},
		start: () => send({ type: 'start' }),
		ready: () => send({ type: 'ready' }),
		// No optimistic anything: the server decides what leaving means — whether a game loses a player
		// or a room ceases to exist — and answers with a `left` frame either way.
		leave: () => send({ type: 'leave' }),
		// Host only, and the server says so — this just asks. No optimistic update: the whole point
		// of the skin being the room's is that every seat changes together, off one frame.
		setSkin: skin => send({ type: 'skin', skin }),

		close() {
			closedByUs = true;
			clearInterval(pingTimer);
			clearTimeout(reconnectTimer);
			clearTimeout(aimTimer);
			socket?.close();
		},

		// Exposed for the specs.
		get version() {
			return version;
		},
	};
}

export default createSocketStore;
