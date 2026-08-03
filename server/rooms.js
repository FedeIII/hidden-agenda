import { PHASES } from 'Domain/phases';
import { dealAlignments } from 'Domain/deal';
import { isSkin, pickSkin } from 'Domain/skins';
import { MIN_PLAYERS, MAX_PLAYERS } from 'Domain/py';
import { createInitialState, gameReducer } from 'Game/reducer';
import { startGame, setAlignment } from 'Game/actions';
import { createCode, createToken } from './codes';

// Rooms hold no sockets. A room is plain JSON so it can be written to disk and read back after a
// deploy restart; live connections are tracked separately in index.js by seat id.

export const MAX_ROOMS = 200;

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

	function create() {
		if (rooms.size >= MAX_ROOMS) {
			return null;
		}

		const code = createCode(candidate => rooms.has(candidate));
		const room = {
			code,
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

	function markReady(room, seat) {
		if (room.phase !== PHASES.ALIGNMENT) {
			return { error: 'not_in_alignment' };
		}

		seat.ready = true;
		room.updatedAt = now();

		if (room.seats.every(other => other.ready)) {
			room.phase = PHASES.PLAY;
			room.version += 1;
		}

		return { room };
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

	function load(room) {
		rooms.set(room.code, room);
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
		setConnected,
		remove,
		all,
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
