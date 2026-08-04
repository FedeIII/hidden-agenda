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

	// The one action that inverts the turn rule. The mover cannot answer their own move, and the
	// rest of the table can — which is the whole point of the sniper, and was lost over the wire
	// when "only the seat on turn may act" was written as if it had no exceptions.
	test('the snipe is the seat not on turn’s, and is refused to the seat on turn', async () => {
		const { server, url } = await startServer();

		try {
			const { ana, bea, atPlay } = await playingRoom(url);
			atPlay();

			bea.send({ type: 'action', seq: 1, action: { type: 'SNIPE' } });

			// Accepted: everyone gets the snapshot and nobody gets a rejection.
			await bea.waitFor('snapshot');
			await ana.waitFor('snapshot');
			expect(await bea.expectNothing('rejected')).toBe(true);

			ana.send({ type: 'action', seq: 2, action: { type: 'SNIPE' } });

			expect(await ana.waitFor('rejected')).toMatchObject({ seq: 2, reason: 'not_your_snipe' });
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

test.describe('join rate limiting', () => {
	// 4-character codes are low entropy, so guessing at them has to be expensive. This is the
	// control that makes it so, and it is worth an actual test rather than trust.
	test('refuses more than ten room creations a minute from one address', async () => {
		const { server, url } = await startServer();

		try {
			const outcomes = [];

			for (let attempt = 0; attempt < 13; attempt++) {
				const client = createClient(url);
				await client.opened;
				client.send({ type: 'create', name: `P${attempt}` });

				const reply = await client.waitFor(message => message.type === 'seat' || message.type === 'error');
				outcomes.push(reply.type === 'error' ? reply.reason : 'seat');
				client.close();
			}

			expect(outcomes.slice(0, 10)).toEqual(Array(10).fill('seat'));
			expect(outcomes.slice(10)).toEqual(['slow_down', 'slow_down', 'slow_down']);
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

test.describe('the public room list', () => {
	// Opens a room and returns both the seat frame and the room frame, since the name lives on the
	// second one.
	async function openRoom(url, { host, room, isPrivate = false }) {
		const client = createClient(url);
		await client.opened;
		client.send({ type: 'create', name: host, room, private: isPrivate });

		const seat = await client.waitFor('seat');
		const frame = await client.waitFor('room');

		return { client, seat, frame };
	}

	test('a room carries the name it was opened with, and says whether it is listed', async () => {
		const { server, url } = await startServer();

		try {
			const { frame } = await openRoom(url, { host: 'ANA', room: 'cunning-traitor' });

			expect(frame.name).toEqual('cunning-traitor');
			expect(frame.private).toBe(false);
		} finally {
			await server.close();
		}
	});

	// The lobby's field is prefilled with a draw and cannot be submitted empty, so a create with no
	// name at all is not the lobby. Giving it one keeps every row in the list readable — the
	// alternative is a blank line nobody can search for.
	test('a room with no name asked for gets a drawn one rather than none', async () => {
		const { server, url } = await startServer();

		try {
			const { frame } = await openRoom(url, { host: 'ANA', room: undefined });

			expect(frame.name).toMatch(/^[a-z]+-[a-z]+$/);
		} finally {
			await server.close();
		}
	});

	test('a name that is present and malformed is refused', async () => {
		const { server, url } = await startServer();

		try {
			const client = createClient(url);
			await client.opened;
			client.send({ type: 'create', name: 'ANA', room: '<script>alert(1)</script>' });

			expect((await client.waitFor('error')).reason).toEqual('bad_room_name');
			// And no room was opened by the attempt.
			expect(server.rooms.size).toEqual(0);
		} finally {
			await server.close();
		}
	});

	test('lists public rooms with everything the finder shows', async () => {
		const { server, url } = await startServer();

		try {
			const { seat } = await openRoom(url, { host: 'ANA', room: 'secret-agent' });

			const finder = createClient(url);
			await finder.opened;
			finder.send({ type: 'list' });

			const { rooms, total } = await finder.waitFor('rooms');

			expect(total).toEqual(1);
			expect(rooms).toEqual([{ code: seat.code, name: 'secret-agent', host: 'ANA', players: 1, state: 'lobby' }]);
		} finally {
			await server.close();
		}
	});

	// The whole of what private means here: absent from the list, and joinable by code exactly as
	// before. Not dimmed, not marked — a listing a stranger can read is the thing being withheld.
	test('a private room is absent from the list and still joins by code', async () => {
		const { server, url } = await startServer();

		try {
			await openRoom(url, { host: 'ANA', room: 'public-room' });
			const { seat: hidden } = await openRoom(url, { host: 'BEA', room: 'hidden-room', isPrivate: true });

			const finder = createClient(url);
			await finder.opened;
			finder.send({ type: 'list' });

			const { rooms, total } = await finder.waitFor('rooms');

			expect(rooms.map(room => room.name)).toEqual(['public-room']);
			expect(total).toEqual(1);

			// The code still works, which is what makes a shared link to a private room worth having.
			finder.send({ type: 'join', code: hidden.code, name: 'CARA' });
			expect((await finder.waitFor('seat')).code).toEqual(hidden.code);
		} finally {
			await server.close();
		}
	});

	test('searches by name, and a space matches a hyphen', async () => {
		const { server, url } = await startServer();

		try {
			await openRoom(url, { host: 'ANA', room: 'secret-agent' });
			await openRoom(url, { host: 'BEA', room: 'cunning-traitor' });

			const finder = createClient(url);
			await finder.opened;

			finder.send({ type: 'list', query: 'secret agent' });
			expect((await finder.waitFor('rooms')).rooms.map(room => room.name)).toEqual(['secret-agent']);

			// A second query has to wait out the per-socket floor, or it is dropped and answered by the
			// periodic refresh instead — which is correct behaviour, but not what this is testing.
			await new Promise(resolve => setTimeout(resolve, 300));

			finder.send({ type: 'list', query: 'TRAI' });
			expect((await finder.waitFor('rooms')).rooms.map(room => room.name)).toEqual(['cunning-traitor']);
		} finally {
			await server.close();
		}
	});

	// A started room has no seat for a stranger, so it is of no use to somebody scanning for a game —
	// but it is exactly what somebody coming back to their own game is looking for, which is why it
	// stays in the list rather than being dropped from it.
	test('started rooms go to the end of the list', async () => {
		const { server, url } = await startServer();

		try {
			const started = await openRoom(url, { host: 'ANA', room: 'started-room' });

			const bea = createClient(url);
			await bea.opened;
			bea.send({ type: 'join', code: started.seat.code, name: 'BEA' });
			await bea.waitFor('seat');

			started.client.send({ type: 'start' });
			await started.client.waitFor(message => message.type === 'room' && message.phase === 'alignment');

			// Opened last, so newest-first would put it top of its group — and it is a lobby room, so
			// it belongs above the started one either way.
			await openRoom(url, { host: 'CARA', room: 'waiting-room' });

			const finder = createClient(url);
			await finder.opened;
			finder.send({ type: 'list' });

			const { rooms } = await finder.waitFor('rooms');

			expect(rooms.map(room => [room.name, room.state, room.players])).toEqual([
				['waiting-room', 'lobby', 1],
				['started-room', 'started', 2],
			]);
		} finally {
			await server.close();
		}
	});

	test('a watcher is pushed a new list when one arrives, and told nothing when nothing changed', async () => {
		const { server, url } = await startServer();

		try {
			const finder = createClient(url);
			await finder.opened;
			finder.send({ type: 'list' });
			expect((await finder.waitFor('rooms')).rooms).toEqual([]);

			// Nothing has happened, so the refresh has nothing to say. A list frame every few seconds
			// per idle lobby is exactly the kind of chatter the snapshot coalescing exists to avoid.
			server.refreshLists();
			expect(await finder.expectNothing('rooms')).toBe(true);

			await openRoom(url, { host: 'ANA', room: 'secret-agent' });
			server.refreshLists();

			expect((await finder.waitFor('rooms')).rooms.map(room => room.name)).toEqual(['secret-agent']);
		} finally {
			await server.close();
		}
	});

	// The finder is something you use on the way in. A socket that has a seat is in a room, and a
	// player at a table has no use for a list of the others — nor should the server keep computing one.
	test('a socket stops watching the list once it has a seat', async () => {
		const { server, url } = await startServer();

		try {
			const finder = createClient(url);
			await finder.opened;
			finder.send({ type: 'list' });
			await finder.waitFor('rooms');

			finder.send({ type: 'create', name: 'ANA', room: 'secret-agent' });
			await finder.waitFor('seat');
			finder.drain();

			server.refreshLists();

			expect(await finder.expectNothing('rooms')).toBe(true);
		} finally {
			await server.close();
		}
	});

	// The list is sent to sockets that have no seat anywhere, so it is the one frame in the protocol
	// with no recipient to be redacted for. It must not carry game state at all.
	test('a listing carries nothing but what is on the card', async () => {
		const { server, url } = await startServer();

		try {
			await openRoom(url, { host: 'ANA', room: 'secret-agent' });

			const finder = createClient(url);
			await finder.opened;
			finder.send({ type: 'list' });

			const { rooms } = await finder.waitFor('rooms');

			expect(Object.keys(rooms[0]).sort()).toEqual(['code', 'host', 'name', 'players', 'state']);
		} finally {
			await server.close();
		}
	});
});

test.describe('leaving', () => {
	// Whoever is left has to be told, or the seat count on their screen is a lie until something else
	// happens to make the server broadcast.
	test('a seat leaving the waiting room disappears from everybody else’s seat list', async () => {
		const { server, url } = await startServer();

		try {
			const ana = createClient(url);
			await ana.opened;
			ana.send({ type: 'create', name: 'ANA' });
			const anaSeat = await ana.waitFor('seat');

			const bea = createClient(url);
			await bea.opened;
			bea.send({ type: 'join', code: anaSeat.code, name: 'BEA' });
			await bea.waitFor('seat');
			await ana.waitFor(message => message.type === 'room' && message.seats.length === 2);

			bea.send({ type: 'leave' });

			expect((await bea.waitFor('left')).reason).toEqual('you_left');

			const frame = await ana.waitFor(message => message.type === 'room' && message.seats.length === 1);

			expect(frame.seats.map(seat => seat.name)).toEqual(['ANA']);
			// And the room is still there, still hers, still findable: leaving a waiting room costs
			// nothing, which is why the UI does not ask twice about it.
			expect(server.rooms.get(anaSeat.code)).toBeTruthy();
			expect(frame.hostSeatId).toEqual(anaSeat.seatId);
		} finally {
			await server.close();
		}
	});

	// Being alone in a waiting room is what having just opened one looks like, so the last seat is not
	// turned out of it. That rule is for a table that has been dealt.
	test('one seat left in a waiting room is left alone', async () => {
		const { server, url } = await startServer();

		try {
			const ana = createClient(url);
			await ana.opened;
			ana.send({ type: 'create', name: 'ANA' });
			const anaSeat = await ana.waitFor('seat');

			const bea = createClient(url);
			await bea.opened;
			bea.send({ type: 'join', code: anaSeat.code, name: 'BEA' });
			await bea.waitFor('seat');

			bea.send({ type: 'leave' });
			await bea.waitFor('left');

			expect(await ana.expectNothing('left')).toBe(true);
			expect(server.rooms.get(anaSeat.code).seats).toHaveLength(1);
		} finally {
			await server.close();
		}
	});

	test('the host leaving hands the room to whoever is left', async () => {
		const { server, url } = await startServer();

		try {
			const ana = createClient(url);
			await ana.opened;
			ana.send({ type: 'create', name: 'ANA' });
			const anaSeat = await ana.waitFor('seat');

			const bea = createClient(url);
			await bea.opened;
			bea.send({ type: 'join', code: anaSeat.code, name: 'BEA' });
			const beaSeat = await bea.waitFor('seat');

			ana.send({ type: 'leave' });
			await ana.waitFor('left');

			const frame = await bea.waitFor(message => message.type === 'room' && message.seats.length === 1);

			// Otherwise START belongs to somebody who is not there and the room can never begin.
			expect(frame.hostSeatId).toEqual(beaSeat.seatId);
		} finally {
			await server.close();
		}
	});

	// The rule the whole thing turns on: a game needs two, so leaving a dealt table in a way that would
	// strand somebody takes them with you rather than leaving them alone in a game they cannot play.
	test('leaving a two-player game takes the last player with it, and the room with them', async () => {
		const { server, url } = await startServer();

		try {
			const { ana, bea, anaSeat } = await playingRoom(url);

			ana.send({ type: 'leave' });

			expect((await ana.waitFor('left')).reason).toEqual('you_left');
			// Not something BEA did, and the two need different words on screen.
			expect((await bea.waitFor('left')).reason).toEqual('left_alone');
			expect(server.rooms.get(anaSeat.code)).toBeNull();

			const health = await fetch(`http://127.0.0.1:${new URL(url).port}/healthz`).then(r => r.json());
			expect(health.rooms).toEqual(0);
		} finally {
			await server.close();
		}
	});

	test('a three-player game carries on without the player who left', async () => {
		const { server, url } = await startServer();

		try {
			const ana = createClient(url);
			await ana.opened;
			ana.send({ type: 'create', name: 'ANA' });
			const anaSeat = await ana.waitFor('seat');

			const others = [];

			for (const name of ['BEA', 'CARA']) {
				const client = createClient(url);
				await client.opened;
				client.send({ type: 'join', code: anaSeat.code, name });
				await client.waitFor('seat');
				others.push(client);
			}

			ana.send({ type: 'start' });
			await ana.waitFor(message => message.type === 'room' && message.phase === 'alignment');
			[ana, ...others].forEach(client => client.send({ type: 'ready' }));
			await others[0].waitFor(message => message.type === 'room' && message.phase === 'play');
			others.forEach(client => client.drain());

			// ANA is on turn, so this is the case that could leave the table with nobody holding it.
			ana.send({ type: 'leave' });
			await ana.waitFor('left');

			const snapshot = await others[0].waitFor('snapshot');

			expect(snapshot.state.players.map(player => player.name)).toEqual(['BEA', 'CARA']);
			// Exactly one player holds the turn at all times: py.getTurn reads it with no guard, so a
			// table where nobody has it throws on the next render.
			expect(snapshot.state.players.filter(player => player.turn)).toHaveLength(1);
			expect(snapshot.state.players.find(player => player.turn).name).toEqual('BEA');
			expect(server.rooms.get(anaSeat.code).seats.map(seat => seat.name)).toEqual(['BEA', 'CARA']);
		} finally {
			await server.close();
		}
	});

	// Without this the others sit looking at cards they have already confirmed, in a game that will
	// never start, because the phase only ever advanced inside markReady.
	test('a seat leaving during alignment can be the last one the room was waiting for', async () => {
		const { server, url } = await startServer();

		try {
			const ana = createClient(url);
			await ana.opened;
			ana.send({ type: 'create', name: 'ANA' });
			const anaSeat = await ana.waitFor('seat');

			const others = [];

			for (const name of ['BEA', 'CARA']) {
				const client = createClient(url);
				await client.opened;
				client.send({ type: 'join', code: anaSeat.code, name });
				await client.waitFor('seat');
				others.push(client);
			}

			ana.send({ type: 'start' });
			await ana.waitFor(message => message.type === 'room' && message.phase === 'alignment');

			// Everybody but CARA says they are ready, and CARA leaves instead of confirming.
			ana.send({ type: 'ready' });
			others[0].send({ type: 'ready' });
			await ana.waitFor(message => message.type === 'room' && message.seats.filter(seat => seat.ready).length === 2);

			others[1].send({ type: 'leave' });
			await others[1].waitFor('left');

			const frame = await ana.waitFor(message => message.type === 'room' && message.phase === 'play');

			expect(frame.seats.map(seat => seat.name)).toEqual(['ANA', 'BEA']);
		} finally {
			await server.close();
		}
	});

	test('a client with no seat asking to leave is told so rather than crashing anything', async () => {
		const { server, url } = await startServer();

		try {
			const stranger = createClient(url);
			await stranger.opened;
			stranger.send({ type: 'leave' });

			expect((await stranger.waitFor('error')).reason).toEqual('not_seated');
		} finally {
			await server.close();
		}
	});

	// A leaver goes back to the lobby on the same socket, so everything tying that socket to the seat
	// has to go with the seat — otherwise the next thing it sends is attributed to a room it is not in.
	test('the socket is free to use the lobby again afterwards', async () => {
		const { server, url } = await startServer();

		try {
			const ana = createClient(url);
			await ana.opened;
			ana.send({ type: 'create', name: 'ANA', room: 'secret-agent' });
			const anaSeat = await ana.waitFor('seat');

			ana.send({ type: 'leave' });
			await ana.waitFor('left');
			// The room frame from the first room is still in the inbox, and it has a name too.
			ana.drain();

			// The room went with her — she was the only seat in it — so a fresh one can be opened on the
			// same socket, which is what the lobby does next.
			expect(server.rooms.get(anaSeat.code)).toBeNull();

			ana.send({ type: 'create', name: 'ANA', room: 'second-attempt' });
			const again = await ana.waitFor('seat');

			expect(again.code).not.toEqual(anaSeat.code);
			expect((await ana.waitFor('room')).name).toEqual('second-attempt');
		} finally {
			await server.close();
		}
	});
});
