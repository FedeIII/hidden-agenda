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
		// Until the room frame arrives this is a client with no room, so it shows the menu's own
		// look. The server's choice replaces it, and every seat receives the same one.
		skin: DEFAULT_SKIN,
		// Whether an authoritative snapshot has arrived. The server sends seat, room and snapshot
		// as separate frames, so there is a window where the phase says "play" but the state is
		// still the empty initial one — and rendering the board against no players throws.
		synced: false,
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
			return send({ type: 'create', name: intent.name });
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

		seq += 1;

		if (PREDICT_LOCALLY.has(action.type)) {
			game.set(reduce(game.get(), action));
			outstanding.push({ seq, action });
		}

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
