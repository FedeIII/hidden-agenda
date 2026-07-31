import { createServer as createHttpServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { PHASES } from 'Domain/phases';
import { createRoomStore, isNameShaped, MAX_ROOMS } from './rooms';
import { isCodeShaped } from './codes';
import { applyAction } from './apply';
import { createRateLimiter } from './validate';
import { createRoomPersistence } from './persistence';
import {
	CLIENT,
	SERVER,
	parseMessage,
	seatMessage,
	roomMessage,
	snapshotMessage,
	rejectedMessage,
	errorMessage,
	MAX_MESSAGE_BYTES,
} from './protocol';

export const DEFAULT_PORT = 3007;

// Cloudflare drops an idle WebSocket at ~100s, so the connection has to say something first.
const PING_INTERVAL_MS = 25_000;
// DIRECT_PIECE arrives at hover rate while aiming, so snapshots are coalesced rather than sent
// per action.
const SNAPSHOT_COALESCE_MS = 40;
const SWEEP_INTERVAL_MS = 60_000;
const EVICT_AFTER_ALL_GONE_MS = 30 * 60_000;
const EVICT_HARD_CAP_MS = 3 * 60 * 60_000;
const JOINS_PER_IP_PER_MINUTE = 10;

export function createGameServer({ log = console.log, now = () => Date.now(), rng = Math.random, stateDir } = {}) {
	const rooms = createRoomStore({ now, rng });
	const persistence = createRoomPersistence({ log, ...(stateDir ? { dir: stateDir } : {}) });
	const allowAction = createRateLimiter({ now });

	// Live sockets live here, not on the room: a room has to stay JSON to be persistable.
	const sockets = new Map();
	const pendingSnapshots = new Map();
	const joinsByIp = new Map();

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

	function broadcastRoom(room) {
		const message = roomMessage(room);

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
			previous.close(4000, 'seat reclaimed');
		}

		sockets.set(seat.id, socket);
		socket.seatId = seat.id;
		socket.roomCode = room.code;
		rooms.setConnected(room, seat, true);
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

	function handleCreate(socket, message, ip) {
		if (!isNameShaped(message.name)) {
			return send(socket.seatId, errorMessage('bad_name'));
		}

		if (!allowJoinFrom(ip)) {
			return socket.send(JSON.stringify(errorMessage('slow_down')));
		}

		const room = rooms.create();

		if (!room) {
			return socket.send(JSON.stringify(errorMessage('server_full')));
		}

		const { seat, error } = rooms.addSeat(room, message.name.trim());

		if (error) {
			return socket.send(JSON.stringify(errorMessage(error)));
		}

		bind(socket, room, seat);
		send(seat.id, seatMessage(room, seat));
		broadcastRoom(room);
		persistence.save(room);
	}

	function handleJoin(socket, message, ip) {
		if (!isCodeShaped(message.code) || !isNameShaped(message.name)) {
			return socket.send(JSON.stringify(errorMessage('bad_join')));
		}

		if (!allowJoinFrom(ip)) {
			return socket.send(JSON.stringify(errorMessage('slow_down')));
		}

		const room = rooms.get(message.code.toUpperCase());

		if (!room) {
			return socket.send(JSON.stringify(errorMessage('no_such_room')));
		}

		const { seat, error } = rooms.addSeat(room, message.name.trim());

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

		bind(socket, room, seat);
		send(seat.id, seatMessage(room, seat));
		broadcastRoom(room);
		sendSnapshots(room);
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
				broadcastRoom(room);
			}

			scheduleSnapshots(room);
		});
	}

	function handleMessage(socket, raw, ip) {
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
			case CLIENT.START:
				return handleStart(socket);
			case CLIENT.READY:
				return handleReady(socket);
			case CLIENT.ACTION:
				return handleAction(socket, message);
			case CLIENT.PING:
				return socket.send(JSON.stringify({ type: SERVER.PONG }));
			default:
				return socket.send(JSON.stringify(errorMessage('unknown_message')));
		}
	}

	function handleClose(socket) {
		const room = rooms.get(socket.roomCode);
		const seat = room ? rooms.seatById(room, socket.seatId) : null;

		if (sockets.get(socket.seatId) === socket) {
			sockets.delete(socket.seatId);
		}

		if (room && seat) {
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
				room.seats.forEach(seat => sockets.delete(seat.id));
				rooms.remove(room.code);
				persistence.remove(room.code);
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

		socket.on('message', raw => {
			try {
				handleMessage(socket, raw, ip);
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

	heartbeat.unref?.();
	sweeper.unref?.();

	return {
		httpServer,
		rooms,
		sweep,

		listen(port = DEFAULT_PORT, host = '127.0.0.1') {
			return new Promise(resolve => httpServer.listen(port, host, () => resolve(httpServer.address())));
		},

		close() {
			clearInterval(heartbeat);
			clearInterval(sweeper);
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
