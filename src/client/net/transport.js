import { createLocalStore } from 'Game/store';
import playMock from 'Client/state/mocks/play';
import endgameMock from 'Client/state/mocks/endgame';

// The seam between the UI and wherever the game state actually lives.
//
// Today there is one transport: the game runs in this tab and actions go straight into the
// reducer. Phase 2 of MULTIPLAYER-PLAN.md adds a socket transport that sends actions to the
// server and applies the redacted snapshots it sends back. Both satisfy the same three-method
// contract — getState / subscribe / dispatch — so nothing above this line has to know which is
// in play. That is what keeps the local hot-seat game (and the whole browser suite) working
// once multiplayer lands.

const MOCKS = {
	play: playMock,
	endgame: endgameMock,
};

// Read at call time rather than at import time. When this was module-level the game core could
// not be loaded in node at all, which is exactly what the server needs to do.
function readTestParam() {
	if (typeof window === 'undefined') {
		return null;
	}

	return new URLSearchParams(window.location.search).get('test');
}

function readRoomCode() {
	if (typeof window === 'undefined') {
		return null;
	}

	// Phase 2 hands out links shaped #/r/ABCD.
	const room = /^#\/r\/([A-Za-z0-9]{4})$/.exec(window.location.hash);

	return room ? room[1].toUpperCase() : null;
}

export function createTransport() {
	const test = readTestParam();
	const mock = test ? MOCKS[test] : null;
	const roomCode = readRoomCode();

	// createSocketTransport({ roomCode }) goes here in phase 2. Until then a room code in the
	// URL still gets the local game rather than a broken one.
	const store = createLocalStore({
		initialState: mock ? { ...mock, test: true } : undefined,
		debug: import.meta.env.DEV,
	});

	return { store, test, roomCode };
}

export default createTransport;
