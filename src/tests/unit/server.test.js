import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import WebSocket from 'ws';
import { test, expect } from '@playwright/test';
import { createGameServer } from 'Server/index';

// End to end over a real socket, in process. Two clients in one room is the shape that actually
// matters: it is the only way to check that one player cannot act for another or see their cards.

const TIMEOUT_MS = 4000;

function createClient(url) {
	const socket = new WebSocket(url);
	const messages = [];
	let wake = () => {};

	socket.on('message', raw => {
		messages.push(JSON.parse(raw.toString()));
		wake();
	});

	return {
		socket,
		opened: new Promise((resolve, reject) => {
			socket.once('open', resolve);
			socket.once('error', reject);
		}),

		send(message) {
			socket.send(JSON.stringify(message));
		},

		// Consumes the matched message so successive waits move forward instead of re-matching.
		async waitFor(match, timeout = TIMEOUT_MS) {
			const predicate = typeof match === 'string' ? message => message.type === match : match;
			const deadline = Date.now() + timeout;

			while (Date.now() < deadline) {
				const index = messages.findIndex(predicate);

				if (index >= 0) {
					return messages.splice(index, 1)[0];
				}

				await new Promise(resolve => {
					wake = resolve;
					setTimeout(resolve, 20);
				});
			}

			throw new Error(`timed out waiting; received [${messages.map(message => message.type).join(', ')}]`);
		},

		expectNothing(match, within = 300) {
			const predicate = typeof match === 'string' ? message => message.type === match : match;

			return new Promise(resolve => setTimeout(() => resolve(!messages.some(predicate)), within));
		},

		// Reaching the play phase leaves a snapshot per `ready` in the inbox. Without clearing
		// them a later waitFor happily matches a stale one and the assertion means nothing.
		drain() {
			messages.length = 0;
		},

		close() {
			socket.close();
		},
	};
}

async function startServer() {
	const server = createGameServer({ log: () => {}, stateDir: mkdtempSync(join(tmpdir(), 'ha-rooms-')) });
	const address = await server.listen(0, '127.0.0.1');

	return { server, url: `ws://127.0.0.1:${address.port}/ws`, port: address.port };
}

// Drives a room all the way to the play phase with two seats.
async function playingRoom(url) {
	const ana = createClient(url);
	await ana.opened;
	ana.send({ type: 'create', name: 'ANA' });
	const anaSeat = await ana.waitFor('seat');

	const bea = createClient(url);
	await bea.opened;
	bea.send({ type: 'join', code: anaSeat.code, name: 'BEA' });
	const beaSeat = await bea.waitFor('seat');

	ana.send({ type: 'start' });
	await ana.waitFor(message => message.type === 'room' && message.phase === 'alignment');

	const anaAlignmentSnapshot = await ana.waitFor('snapshot');
	const beaAlignmentSnapshot = await bea.waitFor('snapshot');

	ana.send({ type: 'ready' });
	bea.send({ type: 'ready' });
	await ana.waitFor(message => message.type === 'room' && message.phase === 'play');
	await bea.waitFor(message => message.type === 'room' && message.phase === 'play');

	return {
		ana,
		bea,
		anaSeat,
		beaSeat,
		anaAlignmentSnapshot,
		beaAlignmentSnapshot,
		// Anything a test asserts from here on must be caused by that test.
		atPlay() {
			ana.drain();
			bea.drain();
		},
	};
}

test.describe('server lifecycle', () => {
	test('answers a health check', async () => {
		const { server, port } = await startServer();

		try {
			const response = await fetch(`http://127.0.0.1:${port}/healthz`);
			const body = await response.json();

			expect(response.status).toEqual(200);
			expect(body.ok).toBe(true);
			expect(body.rooms).toEqual(0);
		} finally {
			await server.close();
		}
	});

	test('refuses a websocket upgrade anywhere but /ws', async () => {
		const { server, port } = await startServer();

		try {
			const stray = new WebSocket(`ws://127.0.0.1:${port}/nope`);
			const failed = await new Promise(resolve => {
				stray.once('error', () => resolve(true));
				stray.once('open', () => resolve(false));
			});

			expect(failed).toBe(true);
		} finally {
			await server.close();
		}
	});

	test('creates a room, seats a second player and reaches the play phase', async () => {
		const { server, url } = await startServer();

		try {
			const { ana, anaSeat } = await playingRoom(url);

			expect(anaSeat.code).toMatch(/^[A-Z0-9]{4}$/);
			expect(anaSeat.token).toBeTruthy();

			const health = await fetch(`http://127.0.0.1:${new URL(url).port}/healthz`).then(r => r.json());
			expect(health.rooms).toEqual(1);

			ana.close();
		} finally {
			await server.close();
		}
	});

	test('rejects a join for a room that does not exist', async () => {
		const { server, url } = await startServer();

		try {
			const client = createClient(url);
			await client.opened;
			client.send({ type: 'join', code: 'ZZZZ', name: 'ANA' });

			expect((await client.waitFor('error')).reason).toEqual('no_such_room');
		} finally {
			await server.close();
		}
	});

	test('rejects a second seat taking a name already at the table', async () => {
		const { server, url } = await startServer();

		try {
			const ana = createClient(url);
			await ana.opened;
			ana.send({ type: 'create', name: 'ANA' });
			const seat = await ana.waitFor('seat');

			const impostor = createClient(url);
			await impostor.opened;
			impostor.send({ type: 'join', code: seat.code, name: 'ANA' });

			expect((await impostor.waitFor('error')).reason).toEqual('name_taken');
		} finally {
			await server.close();
		}
	});

	test('only the host may start the game', async () => {
		const { server, url } = await startServer();

		try {
			const ana = createClient(url);
			await ana.opened;
			ana.send({ type: 'create', name: 'ANA' });
			const seat = await ana.waitFor('seat');

			const bea = createClient(url);
			await bea.opened;
			bea.send({ type: 'join', code: seat.code, name: 'BEA' });
			await bea.waitFor('seat');

			bea.send({ type: 'start' });

			expect((await bea.waitFor('error')).reason).toEqual('not_host');
		} finally {
			await server.close();
		}
	});

	test('refuses to start below two players', async () => {
		const { server, url } = await startServer();

		try {
			const ana = createClient(url);
			await ana.opened;
			ana.send({ type: 'create', name: 'ANA' });
			await ana.waitFor('seat');

			ana.send({ type: 'start' });

			expect((await ana.waitFor('error')).reason).toEqual('not_enough_players');
		} finally {
			await server.close();
		}
	});
});

test.describe('hidden information over the wire', () => {
	test('each seat receives its own alignment and nulls for everyone else', async () => {
		const { server, url } = await startServer();

		try {
			const { anaAlignmentSnapshot, beaAlignmentSnapshot } = await playingRoom(url);

			const anaSeesAna = anaAlignmentSnapshot.state.players.find(p => p.name === 'ANA');
			const anaSeesBea = anaAlignmentSnapshot.state.players.find(p => p.name === 'BEA');
			const beaSeesBea = beaAlignmentSnapshot.state.players.find(p => p.name === 'BEA');
			const beaSeesAna = beaAlignmentSnapshot.state.players.find(p => p.name === 'ANA');

			expect(anaSeesAna.alignment.friend).not.toBeNull();
			expect(anaSeesAna.alignment.foe).not.toBeNull();
			expect(anaSeesBea.alignment).toEqual({ friend: null, foe: null });

			expect(beaSeesBea.alignment.friend).not.toBeNull();
			expect(beaSeesAna.alignment).toEqual({ friend: null, foe: null });
		} finally {
			await server.close();
		}
	});

	test('a seat’s own cards never appear in the other seat’s frames', async () => {
		const { server, url } = await startServer();

		try {
			const { anaAlignmentSnapshot, beaAlignmentSnapshot } = await playingRoom(url);

			const anaOwn = anaAlignmentSnapshot.state.players.find(p => p.name === 'ANA').alignment;
			const beaViewOfAna = beaAlignmentSnapshot.state.players.find(p => p.name === 'ANA').alignment;

			expect(anaOwn.friend).toEqual(expect.any(String));
			expect(beaViewOfAna.friend).toBeNull();
			expect(beaViewOfAna.foe).toBeNull();
		} finally {
			await server.close();
		}
	});
});

test.describe('turn authority over the wire', () => {
	test('the seat on turn may act and everyone gets the snapshot', async () => {
		const { server, url } = await startServer();

		try {
			const { ana, bea, atPlay } = await playingRoom(url);
			atPlay();

			ana.send({ type: 'action', seq: 1, action: { type: 'TOGGLE_PIECE', payload: { pieceId: '0-A1' } } });

			const anaSnapshot = await ana.waitFor('snapshot');
			const beaSnapshot = await bea.waitFor('snapshot');

			expect(anaSnapshot.state.pieces.find(p => p.id === '0-A1').selected).toBe(true);
			expect(beaSnapshot.state.pieces.find(p => p.id === '0-A1').selected).toBe(true);
		} finally {
			await server.close();
		}
	});

	test('the seat not on turn is rejected and changes nothing', async () => {
		const { server, url } = await startServer();

		try {
			const { ana, bea, atPlay } = await playingRoom(url);
			atPlay();

			bea.send({ type: 'action', seq: 9, action: { type: 'TOGGLE_PIECE', payload: { pieceId: '0-A1' } } });

			const rejection = await bea.waitFor('rejected');

			expect(rejection).toMatchObject({ seq: 9, reason: 'not_your_turn' });
			// And nothing was broadcast to anyone.
			expect(await ana.expectNothing('snapshot')).toBe(true);
		} finally {
			await server.close();
		}
	});

	test('an illegal move is rejected even from the seat on turn', async () => {
		const { server, url } = await startServer();

		try {
			const { ana, atPlay } = await playingRoom(url);
			atPlay();

			ana.send({
				type: 'action',
				seq: 2,
				action: { type: 'MOVE_PIECE', payload: { pieceId: '0-A1', coords: [3, 3] } },
			});

			expect((await ana.waitFor('rejected')).reason).toEqual('illegal_move');
		} finally {
			await server.close();
		}
	});

	test('a client cannot deal itself cards or restart the game', async () => {
		const { server, url } = await startServer();

		try {
			const { ana, atPlay } = await playingRoom(url);
			atPlay();

			ana.send({
				type: 'action',
				seq: 3,
				action: { type: 'SET_ALIGNMENT', payload: { name: 'ANA', friend: '0', foe: '1' } },
			});

			expect((await ana.waitFor('rejected')).reason).toEqual('action_not_allowed');
		} finally {
			await server.close();
		}
	});

	test('a malformed frame draws an error rather than taking the server down', async () => {
		const { server, url } = await startServer();

		try {
			const client = createClient(url);
			await client.opened;
			client.socket.send('not json at all');

			expect((await client.waitFor('error')).reason).toEqual('malformed_message');

			// Still alive.
			client.send({ type: 'ping' });
			expect((await client.waitFor('pong')).type).toEqual('pong');
		} finally {
			await server.close();
		}
	});
});

test.describe('surviving a restart', () => {
	// Every deploy reloads the process. Without persistence that would end every game in
	// progress, which is why a room is plain JSON in the first place.
	test('a room and its seats come back after the process restarts', async () => {
		const stateDir = mkdtempSync(join(tmpdir(), 'ha-restart-'));

		const first = createGameServer({ log: () => {}, stateDir });
		const address = await first.listen(0, '127.0.0.1');
		const url = `ws://127.0.0.1:${address.port}/ws`;

		const { anaSeat } = await playingRoom(url);
		// Let the coalesced snapshot save land.
		await new Promise(resolve => setTimeout(resolve, 120));
		await first.close();

		const second = createGameServer({ log: () => {}, stateDir });

		try {
			expect(second.rooms.size).toEqual(1);

			const reloaded = second.rooms.get(anaSeat.code);

			expect(reloaded.phase).toEqual('play');
			expect(reloaded.state.players.map(player => player.name)).toEqual(['ANA', 'BEA']);
			// Whatever the file said, nothing is connected to a process that just booted.
			expect(reloaded.seats.every(seat => seat.connected === false)).toBe(true);
		} finally {
			await second.close();
		}
	});

	test('a player can rejoin with the token they already had before the restart', async () => {
		const stateDir = mkdtempSync(join(tmpdir(), 'ha-restart-'));

		const first = createGameServer({ log: () => {}, stateDir });
		const firstAddress = await first.listen(0, '127.0.0.1');
		const { anaSeat } = await playingRoom(`ws://127.0.0.1:${firstAddress.port}/ws`);
		await new Promise(resolve => setTimeout(resolve, 120));
		await first.close();

		const second = createGameServer({ log: () => {}, stateDir });
		const secondAddress = await second.listen(0, '127.0.0.1');

		try {
			const returning = createClient(`ws://127.0.0.1:${secondAddress.port}/ws`);
			await returning.opened;
			returning.send({ type: 'rejoin', code: anaSeat.code, token: anaSeat.token });

			const seat = await returning.waitFor('seat');
			const snapshot = await returning.waitFor('snapshot');

			expect(seat.name).toEqual('ANA');
			// And redaction still holds on the far side of a restart.
			expect(snapshot.state.players.find(p => p.name === 'ANA').alignment.friend).not.toBeNull();
			expect(snapshot.state.players.find(p => p.name === 'BEA').alignment).toEqual({ friend: null, foe: null });
		} finally {
			await second.close();
		}
	});
});

test.describe('reconnection', () => {
	test('a seat is reclaimed by token, which is what makes a refresh survivable', async () => {
		const { server, url } = await startServer();

		try {
			const { ana, anaSeat } = await playingRoom(url);

			ana.close();

			const returning = createClient(url);
			await returning.opened;
			returning.send({ type: 'rejoin', code: anaSeat.code, token: anaSeat.token });

			const seat = await returning.waitFor('seat');
			const snapshot = await returning.waitFor('snapshot');

			expect(seat.name).toEqual('ANA');
			expect(seat.seatId).toEqual(anaSeat.seatId);
			// Still ANA's own cards, still nobody else's.
			expect(snapshot.state.players.find(p => p.name === 'ANA').alignment.friend).not.toBeNull();
			expect(snapshot.state.players.find(p => p.name === 'BEA').alignment).toEqual({ friend: null, foe: null });
		} finally {
			await server.close();
		}
	});

	test('an unknown token gets nothing', async () => {
		const { server, url } = await startServer();

		try {
			const { anaSeat } = await playingRoom(url);

			const impostor = createClient(url);
			await impostor.opened;
			impostor.send({ type: 'rejoin', code: anaSeat.code, token: 'not-a-real-token' });

			expect((await impostor.waitFor('error')).reason).toEqual('seat_lost');
		} finally {
			await server.close();
		}
	});
});
