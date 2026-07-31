import { PHASES } from 'Domain/phases';
import { dealAlignments } from 'Domain/deal';
import { MIN_PLAYERS, MAX_PLAYERS } from 'Domain/py';
import { createInitialState, gameReducer } from 'Game/reducer';
import { startGame, setAlignment } from 'Game/actions';
import { createCode, createToken } from './codes';

// Rooms hold no sockets. A room is plain JSON so it can be written to disk and read back after a
// deploy restart; live connections are tracked separately in index.js by seat id.

export const MAX_ROOMS = 200;

export { MIN_PLAYERS, MAX_PLAYERS };

export function createRoomStore({ now = () => Date.now(), rng = Math.random } = {}) {
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
