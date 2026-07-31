import { PHASES } from 'Domain/phases';
import { createLocalStore } from 'Game/store';
import { createSocketStore } from './socketStore';
import playMock from 'Client/state/mocks/play';
import endgameMock from 'Client/state/mocks/endgame';

// The seam between the UI and wherever the game state actually lives.
//
// Both transports expose the same three methods — getState / subscribe / dispatch — so every game
// component works unchanged whether the game is in this tab or on a server. What differs is the
// session: online, the room, the seats and the phase all come from the server; locally the client
// owns the phase itself, which is what keeps hot-seat play (and the whole browser suite) working.

const MOCKS = {
	play: playMock,
	endgame: endgameMock,
};

// Read at call time, not at import. When this was module-level the game core could not be loaded
// in node at all, which is exactly what the server needs to do.
function readTestParam() {
	if (typeof window === 'undefined') {
		return null;
	}

	return new URLSearchParams(window.location.search).get('test');
}

export function readRoomCode() {
	if (typeof window === 'undefined') {
		return null;
	}

	const room = /^#\/r\/([A-Za-z0-9]{4})$/.exec(window.location.hash);

	return room ? room[1].toUpperCase() : null;
}

function initialLocalPhase(test) {
	if (test === 'play') {
		return PHASES.PLAY;
	}

	if (test === 'endgame') {
		return PHASES.END;
	}

	return PHASES.START;
}

function createLocalSession(test) {
	let value = {
		mode: 'local',
		status: 'local',
		phase: initialLocalPhase(test),
		code: null,
		seatId: null,
		name: null,
		seats: [],
		hostSeatId: null,
		error: null,
		// Local state is always present; there is nothing to wait for.
		synced: true,
	};

	const listeners = new Set();

	return {
		get: () => value,
		subscribe(listener) {
			listeners.add(listener);

			return () => listeners.delete(listener);
		},
		advance(phase) {
			value = { ...value, phase };
			listeners.forEach(listener => listener());
		},
	};
}

export function createTransport({ mode = 'local' } = {}) {
	const test = readTestParam();

	if (mode === 'online') {
		const store = createSocketStore({ roomCode: readRoomCode() });

		return {
			mode,
			test,
			store,
			session: { get: store.getSession, subscribe: store.subscribeSession },
			actions: {
				createRoom: store.createRoom,
				joinRoom: store.joinRoom,
				start: store.start,
				ready: store.ready,
				// The server owns the phase online, so nothing to advance.
				advance: () => {},
			},
			close: store.close,
		};
	}

	const mock = test ? MOCKS[test] : null;
	const session = createLocalSession(test);
	const store = createLocalStore({
		initialState: mock ? { ...mock, test: true } : undefined,
		debug: import.meta.env.DEV,
	});

	return {
		mode,
		test,
		store,
		session: { get: session.get, subscribe: session.subscribe },
		actions: {
			createRoom: () => {},
			joinRoom: () => {},
			start: () => {},
			ready: () => {},
			advance: session.advance,
		},
		close: () => {},
	};
}

export default createTransport;
