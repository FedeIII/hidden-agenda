import { createGameReducer, createInitialState } from 'Game/reducer';
import { syncState, DIRECT_PIECE, REVEAL_FRIEND, REVEAL_FOE, ACCUSE, SET_ALIGNMENT } from 'Game/actions';

// The online half of the transport seam. Satisfies the same getState/subscribe/dispatch contract
// as the local store, so every game component works unchanged in both modes; what it adds is a
// second observable for session state (room, seats, phase, connection), which only the lobby and
// the connection banner care about.

const RECONNECT_MIN_MS = 500;
const RECONNECT_MAX_MS = 8000;
const PING_MS = 25_000;
// DIRECT_PIECE is dispatched on hover, so it is applied locally at once and sent at this rate.
const AIM_THROTTLE_MS = 50;

// These four read secrets this client does not hold — an alignment it cannot see, or an
// accusation resolved against one — so their outcome is not predictable locally. They are all
// single clicks, so waiting for the authoritative snapshot costs nothing.
const NOT_PREDICTABLE = new Set([SET_ALIGNMENT, REVEAL_FRIEND, REVEAL_FOE, ACCUSE]);

const STORAGE_PREFIX = 'ha:room:';

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

export function createSocketStore({ url = socketUrl(), roomCode = null } = {}) {
	const reduce = createGameReducer();

	const game = createObservable(createInitialState());
	const session = createObservable({
		mode: 'online',
		status: 'connecting',
		code: roomCode,
		seatId: null,
		name: null,
		phase: null,
		seats: [],
		hostSeatId: null,
		error: null,
	});

	// The last state the server told us about. Optimistic work is applied on top of it and
	// discarded back to it if the server disagrees.
	let authoritative = game.get();
	let version = -1;
	let seq = 0;
	let token = roomCode ? readToken(roomCode) : null;
	let intent = null; // what to send once connected: create / join / rejoin

	let socket = null;
	let reconnectDelay = RECONNECT_MIN_MS;
	let reconnectTimer = null;
	let pingTimer = null;
	let aimTimer = null;
	let pendingAim = null;
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
			send({ type: 'action', seq, action: pendingAim });
			pendingAim = null;
		}
	}

	function sendIntent() {
		if (!intent) {
			return;
		}

		if (intent.kind === 'create') {
			send({ type: 'create', name: intent.name });
		} else if (intent.kind === 'join') {
			send({ type: 'join', code: intent.code, name: intent.name });
		} else if (intent.kind === 'rejoin') {
			send({ type: 'rejoin', code: intent.code, token: intent.token });
		}
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
				// So a refresh — and a shared link — lands back in the same room.
				window.history.replaceState(null, '', `#/r/${message.code}`);
				intent = { kind: 'rejoin', code: message.code, token: message.token };
				session.update({ code: message.code, seatId: message.seatId, name: message.name, error: null });
				break;

			case 'room':
				session.update({
					status: 'ready',
					phase: message.phase,
					seats: message.seats,
					hostSeatId: message.hostSeatId,
				});
				break;

			case 'snapshot':
				// Out-of-order or stale frames are ignored rather than trusted.
				if (message.v < version) {
					break;
				}

				version = message.v;
				authoritative = message.state;
				// Through the reducer rather than straight into the observable, so every state
				// change in the app goes through exactly one door. SYNC_STATE exists for this.
				game.set(reduce(game.get(), syncState(message.state)));
				session.update({ phase: message.phase });
				break;

			case 'rejected':
				// Roll optimism back to the last thing the server agreed to.
				game.set(authoritative);
				session.update({ error: message.reason });
				break;

			case 'error':
				session.update({ error: message.reason, status: session.get().status === 'connecting' ? 'ready' : undefined });
				break;

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
		socket = new WebSocket(url);

		socket.addEventListener('open', () => {
			reconnectDelay = RECONNECT_MIN_MS;
			sendIntent();
			pingTimer = setInterval(() => send({ type: 'ping' }), PING_MS);
		});

		socket.addEventListener('message', event => onMessage(event.data));

		socket.addEventListener('close', () => {
			clearInterval(pingTimer);
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

		if (!NOT_PREDICTABLE.has(action.type)) {
			game.set(reduce(game.get(), action));
		}

		seq += 1;
		send({ type: 'action', seq, action });
	}

	function createRoom(name) {
		intent = { kind: 'create', name };
		session.update({ status: 'connecting', error: null });
		sendIntent() || connect();
	}

	function joinRoom(code, name) {
		intent = { kind: 'join', code, name };
		session.update({ status: 'connecting', error: null });
		sendIntent() || connect();
	}

	// A room code in the URL means "put me back in that room" — try the stored token first.
	if (roomCode && token) {
		intent = { kind: 'rejoin', code: roomCode, token };
		connect();
	} else if (roomCode) {
		// We know the room but have no seat in it. The lobby will ask for a name.
		session.update({ status: 'ready', phase: null });
		connect();
	}

	return {
		getState: game.get,
		subscribe: game.subscribe,
		dispatch,

		getSession: session.get,
		subscribeSession: session.subscribe,

		createRoom,
		joinRoom,
		start: () => send({ type: 'start' }),
		ready: () => send({ type: 'ready' }),

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
