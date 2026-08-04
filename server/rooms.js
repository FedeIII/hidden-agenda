import { PHASES, ROOM_STATES, roomStateFor } from 'Domain/phases';
import { dealAlignments } from 'Domain/deal';
import { isSkin, pickSkin } from 'Domain/skins';
import { isRoomNameShaped, matchesRoomQuery, normaliseRoomName, pickRoomName } from 'Domain/roomNames';
import { MIN_PLAYERS, MAX_PLAYERS } from 'Domain/py';
import { createInitialState, gameReducer } from 'Game/reducer';
import { startGame, setAlignment, nextTurn, removePlayer } from 'Game/actions';
import { createCode, createToken } from './codes';

// Rooms hold no sockets. A room is plain JSON so it can be written to disk and read back after a
// deploy restart; live connections are tracked separately in index.js by seat id.

export const MAX_ROOMS = 200;

// How many rooms one `rooms` frame carries. Well under MAX_ROOMS on purpose: a list longer than this
// is not something anybody reads, it is something they search.
export const LIST_LIMIT = 60;

// Pins the look of every new room. Set in playwright.config.mjs so the browser suite is not
// asserting against a different skin on every run — the same shape as HA_JOINS_PER_MINUTE, and for
// the same reason: do not weaken the default, override it in the environment that needs it.
const PINNED_SKIN = isSkin(process.env.HA_SKIN) ? process.env.HA_SKIN : null;

export { MIN_PLAYERS, MAX_PLAYERS };

export function createRoomStore({ now = () => Date.now(), rng = Math.random, skin = null } = {}) {
	const rooms = new Map();

	function get(code) {
		return rooms.get(code) || null;
	}

	// A name and a visibility, both the opener's to choose. `name` is drawn here when the client sends
	// none at all — the field is mandatory in the lobby and prefilled with a draw, so an absent name
	// means a client that is not the lobby, and giving it one keeps "every room has a name" true for
	// the list rather than leaving a blank row in it. A name that is *present and malformed* is
	// refused by index.js instead: that is hostile input, not a missing default.
	function create({ name = null, isPrivate = false } = {}) {
		if (rooms.size >= MAX_ROOMS) {
			return null;
		}

		const code = createCode(candidate => rooms.has(candidate));
		const room = {
			code,
			name: isRoomNameShaped(name) ? normaliseRoomName(name) : pickRoomName(rng),
			// Public unless asked otherwise. A private room is missing from the list and nothing else:
			// its code still joins it, which is what makes a shared link work.
			private: Boolean(isPrivate),
			phase: PHASES.START,
			state: createInitialState(),
			seats: [],
			version: 0,
			hostSeatId: null,
			// Drawn once, when the room is made, by whoever opened it — and then it is the room's,
			// not theirs. Everyone who joins receives it in the same frame as the seat list, so the
			// waiting room already looks like the game will. Held on the room rather than in game
			// state for two reasons: it is not a secret, so redaction has no business touching it,
			// and a seat needs it before it has been dealt anything at all.
			skin: skin || PINNED_SKIN || pickSkin(rng),
			createdAt: now(),
			updatedAt: now(),
		};

		rooms.set(code, room);

		return room;
	}

	function addSeat(room, name) {
		if (room.phase !== PHASES.START) {
			return { error: 'room_already_started' };
		}

		if (room.seats.length >= MAX_PLAYERS) {
			return { error: 'room_full' };
		}

		if (room.seats.some(seat => seat.name === name)) {
			return { error: 'name_taken' };
		}

		const seat = {
			id: createToken(),
			name,
			token: createToken(),
			ready: false,
			connected: true,
			lastSeenAt: now(),
			// Last action sequence number applied for this seat. The client replays anything
			// still outstanding on top of each snapshot, so it has to know where the server got to.
			ackSeq: 0,
		};

		room.seats.push(seat);
		room.hostSeatId = room.hostSeatId || seat.id;
		room.updatedAt = now();

		return { seat };
	}

	function seatByToken(room, token) {
		return room.seats.find(seat => seat.token === token) || null;
	}

	function seatById(room, id) {
		return room.seats.find(seat => seat.id === id) || null;
	}

	// The game's player list is built from the seats, then each player's two cards are dealt and
	// applied as ordinary actions — so every mutation of game state goes through the reducer, and
	// the alignments only ever exist inside the authoritative state.
	function start(room) {
		if (room.phase !== PHASES.START) {
			return { error: 'room_already_started' };
		}

		if (room.seats.length < MIN_PLAYERS) {
			return { error: 'not_enough_players' };
		}

		const names = room.seats.map(seat => seat.name);
		let state = gameReducer(room.state, startGame(names));

		for (const { name, friend, foe } of dealAlignments(names, rng)) {
			state = gameReducer(state, setAlignment({ name, friend, foe }));
		}

		room.state = state;
		room.phase = PHASES.ALIGNMENT;
		room.seats.forEach(seat => {
			seat.ready = false;
		});
		room.version += 1;
		room.updatedAt = now();

		return { room };
	}

	// The host may re-dress the room while it is still filling up or while the table is looking at
	// its cards, and not once the game is running: changing the furniture mid-turn is the interface
	// moving under people who are trying to read each other. All three checks live here rather than
	// in index.js — unlike the host check on `start` — because the rule is the point of the feature
	// and this is where it can be tested without a socket.
	const SKIN_CHANGEABLE_IN = [PHASES.START, PHASES.ALIGNMENT];

	function setSkin(room, seat, skin) {
		if (room.hostSeatId !== seat.id) {
			return { error: 'not_host' };
		}

		if (!SKIN_CHANGEABLE_IN.includes(room.phase)) {
			return { error: 'skin_locked' };
		}

		if (!isSkin(skin)) {
			return { error: 'bad_skin' };
		}

		room.skin = skin;
		room.updatedAt = now();

		// Deliberately no version bump. The skin is not game state — it rides the room frame, not the
		// snapshot — so bumping it would make every client throw away and rebuild a board that has
		// not changed, and would invalidate the outstanding actions they are holding.

		return { room };
	}

	// Called from two places, which is the point of it being a function. A seat leaving during the
	// alignment phase can be the last one the room was waiting for, and without this the others sat
	// looking at cards they had already confirmed, in a game that would never start.
	function advanceIfEveryoneIsReady(room) {
		if (room.phase !== PHASES.ALIGNMENT || !room.seats.length || !room.seats.every(seat => seat.ready)) {
			return;
		}

		room.phase = PHASES.PLAY;
		room.version += 1;
	}

	function markReady(room, seat) {
		if (room.phase !== PHASES.ALIGNMENT) {
			return { error: 'not_in_alignment' };
		}

		seat.ready = true;
		room.updatedAt = now();
		advanceIfEveryoneIsReady(room);

		return { room };
	}

	// A game needs two players. So once a table has been dealt, leaving in a way that would strand
	// somebody alone in it takes them with you: there is nothing left for them to play, and the
	// alternative is a room sitting there with one person in it until the sweeper gets to it.
	//
	// Not at the end of a game, and not in the waiting room. At `end` there is nothing to play either
	// way and the scores are worth reading, so pulling the last player off that screen because somebody
	// else clicked LEAVE would be a rudeness rather than a rule. In the waiting room being alone is
	// simply what having just opened a room looks like.
	const PLAYABLE = [PHASES.ALIGNMENT, PHASES.PLAY];

	/**
	 * Takes a seat out of a room, and out of the game if one is running.
	 *
	 * Returns every seat that ended up leaving — the one that asked, plus anybody stranded by it — and
	 * whether the room has nobody left in it at all.
	 */
	function leave(room, seat) {
		const others = room.seats.filter(other => other.id !== seat.id);
		const stranded = PLAYABLE.includes(room.phase) && others.length === 1 ? others : [];
		const gone = [seat, ...stranded];

		room.seats = others.filter(other => !stranded.includes(other));

		// The game only knows about players once it has been dealt; before that a seat is all there is.
		if (room.phase !== PHASES.START) {
			room.state = gone.reduce((state, departing) => {
				// Passing the turn properly rather than just moving the flag: a turn change snapshots the
				// board for the sniper rollback, clears the half-finished move and recomputes the CEO
				// buffs. Leaving mid-move is the same shape as the 60-second forced pass in apply.js.
				const onTurn = state.players.some(player => player.turn && player.name === departing.name);
				const passed = onTurn ? gameReducer(state, nextTurn()) : state;

				return gameReducer(passed, removePlayer(departing.name));
			}, room.state);

			room.version += 1;
		}

		// The host leaving hands the room to whoever is left rather than locking START for everybody.
		if (!room.seats.some(other => other.id === room.hostSeatId)) {
			room.hostSeatId = room.seats.length ? room.seats[0].id : null;
		}

		advanceIfEveryoneIsReady(room);
		room.updatedAt = now();

		return { gone, dissolved: room.seats.length === 0 };
	}

	function setConnected(room, seat, connected) {
		seat.connected = connected;
		seat.lastSeenAt = now();
		room.updatedAt = now();
	}

	function remove(code) {
		rooms.delete(code);
	}

	function all() {
		return [...rooms.values()];
	}

	// Whoever opened the room. Held as a seat id rather than a name so that renaming — which does not
	// exist yet — would not need two writes, and read through the seat list here. Falls back to the
	// first seat, because a room whose host seat has somehow gone still has a table to name.
	function hostName(room) {
		const host = room.seats.find(seat => seat.id === room.hostSeatId) || room.seats[0];

		return host ? host.name : null;
	}

	function listingFor(room) {
		return {
			code: room.code,
			name: room.name || room.code,
			host: hostName(room),
			players: room.seats.length,
			state: roomStateFor(room.phase),
		};
	}

	// Started rooms go last, and that is the only ordering the finder promises. Within each group the
	// newest room comes first: somebody scanning this list is looking for a table that is still
	// filling up, and the one opened a minute ago is far likelier to be it than one opened an hour ago
	// that nobody joined.
	const STATE_ORDER = { [ROOM_STATES.LOBBY]: 0, [ROOM_STATES.STARTED]: 1 };

	/**
	 * The public list. Private rooms are absent from it entirely — not dimmed, not marked — which is
	 * the whole of what private means here.
	 *
	 * Returns the total as well as the page, because a cap that is not reported reads as "that is
	 * every room" when it is not.
	 */
	function list({ query = '', limit = LIST_LIMIT } = {}) {
		const matching = all().filter(room => !room.private && matchesRoomQuery(room.name || room.code, query));

		const ordered = matching.sort((a, b) => {
			const byState = STATE_ORDER[roomStateFor(a.phase)] - STATE_ORDER[roomStateFor(b.phase)];

			return byState || b.createdAt - a.createdAt;
		});

		return {
			rooms: ordered.slice(0, limit).map(listingFor),
			total: ordered.length,
		};
	}

	function load(room) {
		// A room persisted before rooms had a name or a visibility comes back without either. Neither
		// is game state, so the room is perfectly playable — it only needs something to appear as in
		// the list, and its own code is the one label that will not change again on the next restart.
		rooms.set(room.code, { name: room.code, private: false, ...room });
	}

	return {
		get,
		create,
		addSeat,
		seatByToken,
		seatById,
		start,
		setSkin,
		markReady,
		leave,
		setConnected,
		remove,
		all,
		list,
		load,
		get size() {
			return rooms.size;
		},
	};
}

export function isNameShaped(value) {
	return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 16;
}

export default createRoomStore;
