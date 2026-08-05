import { PHASES } from 'Domain/phases';
import { DEFAULT_SKIN, isSkin, pickSkin } from 'Domain/skins';
import { createLocalStore } from 'Game/store';
import { createSocketStore } from './socketStore';
import { readPlayerName } from './playerName';
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
export function readTestParam() {
	if (typeof window === 'undefined') {
		return null;
	}

	return new URLSearchParams(window.location.search).get('test');
}

// `?skin=blueprint` pins the look, the way `?flat` pins the renderer and `?test=` pins the phase.
// It exists for two reasons: it is the only way to see a direction on demand without restarting
// games until the draw goes your way, and it is what keeps the browser suite deterministic — every
// spec walks the real start → alignment flow, so without a pin each run would assert against a
// randomly chosen skin. Local only: online, the room's skin is the server's to decide, or the table
// would not agree with itself.
export function readSkinOverride() {
	if (typeof window === 'undefined') {
		return null;
	}

	const requested = new URLSearchParams(window.location.search).get('skin');

	return isSkin(requested) ? requested : null;
}

// `?hotseat` plays the whole game in this one tab, the way the game started out. Online is what the
// index offers now, so this is the way back — and it is a URL handle rather than only a button for two
// reasons: a reload keeps you where you were, and the browser suite is nearly all hot-seat and has to
// be able to ask for it without clicking through the lobby first.
export function readHotSeat() {
	if (typeof window === 'undefined') {
		return false;
	}

	return new URLSearchParams(window.location.search).has('hotseat');
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

function createLocalSession(test, { rng = Math.random } = {}) {
	const pinned = readSkinOverride();

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
		// Present so the session has one shape in both modes. A hot-seat game is not a room: it has
		// no name, no visibility, nothing to find and no seat to come back to.
		roomName: null,
		roomPrivate: false,
		rooms: [],
		roomsTotal: 0,
		queue: null,
		rated: null,
		errorSeconds: null,
		resumable: [],
		// The name this browser plays under online. Read here too so the shape does not branch, even
		// though the hot-seat form asks for a name per player rather than for whose screen this is.
		playerName: readPlayerName(),
		// The main menu is always the file room. A game becomes a table later, and that is where
		// it gets a look of its own.
		skin: pinned || DEFAULT_SKIN,
		synced: true,
	};

	// Pinned by the URL, or dropped into a mid-game state by `?test=`, means no draw: a spec that
	// skips the alignment phase must still get a predictable skin.
	let drawn = !!pinned || !!test;

	const listeners = new Set();

	return {
		get: () => value,
		subscribe(listener) {
			listeners.add(listener);

			return () => listeners.delete(listener);
		},
		// Hot-seat picks its skin on the way in to the friend-and-foe cards — the moment the game
		// stops being a form and becomes a game — and then keeps it for the rest of the table's
		// evening. Dossier is in the draw, so staying is a real outcome rather than a miss.
		advance(phase) {
			if (phase === PHASES.ALIGNMENT && !drawn) {
				drawn = true;
				value = { ...value, phase, skin: pickSkin(rng) };
			} else {
				value = { ...value, phase };
			}

			listeners.forEach(listener => listener());
		},
		// Whoever is holding the mouse may overrule the draw while the table is still looking at its
		// cards. Refused outside that window rather than merely un-offered: the UI hides the control
		// during play, and this is what makes that a rule instead of an omission.
		setSkin(skin) {
			if (value.phase !== PHASES.ALIGNMENT || !isSkin(skin)) {
				return;
			}

			// Marked drawn so the choice is not overwritten if the phase is entered again.
			drawn = true;
			value = { ...value, skin };
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
			// Called from an effect in withState, so exactly one socket exists per mounted transport.
			open: store.open,
			session: { get: store.getSession, subscribe: store.subscribeSession },
			actions: {
				createRoom: store.createRoom,
				joinRoom: store.joinRoom,
				listRooms: store.listRooms,
				stopListing: store.stopListing,
				queueUp: store.queueUp,
				cancelQueue: store.cancelQueue,
				start: store.start,
				ready: store.ready,
				leave: store.leave,
				setSkin: store.setSkin,
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
		// Nothing to open: a hot-seat game is this tab and no more.
		open: () => {},
		session: { get: session.get, subscribe: session.subscribe },
		actions: {
			createRoom: () => {},
			joinRoom: () => {},
			listRooms: () => {},
			stopListing: () => {},
			// There is nobody to be matched with: a hot-seat game is the people round this screen.
			queueUp: () => {},
			cancelQueue: () => {},
			start: () => {},
			ready: () => {},
			// Nothing to leave: a hot-seat game is the tab it is in.
			leave: () => {},
			setSkin: session.setSkin,
			advance: session.advance,
		},
		close: () => {},
	};
}

export default createTransport;
