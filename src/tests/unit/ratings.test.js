import { appendFileSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test, expect } from '@playwright/test';
import { createRatings, LOG_NAME } from 'Server/ratings';

// The store has one job beyond arithmetic: **a restart must agree with the server that wrote the
// file.** Almost every test here is a version of that, because it is the property that makes the log
// the truth rather than a diary nobody reads — and the one that breaks silently, since a server with
// the wrong numbers in memory looks exactly like a server with the right ones.

const DAY = 24 * 60 * 60_000;

// A clock that has to be advanced on purpose. Real timestamps would make the pair-softening window and
// the cooldown ladder untestable without waiting a week.
function clock(start = 1_700_000_000_000) {
	let at = start;

	return {
		now: () => at,
		advance(ms) {
			at += ms;

			return at;
		},
	};
}

function store({ dir = mkdtempSync(join(tmpdir(), 'ha-ratings-')), now = clock().now, log = () => {} } = {}) {
	return { dir, ratings: createRatings({ dir, now, log }) };
}

function finished(code, ...ids) {
	return { code, players: ids.map((id, index) => ({ id, name: id.toUpperCase(), place: index + 1 })) };
}

function lines(dir) {
	return readFileSync(join(dir, LOG_NAME), 'utf8')
		.split('\n')
		.filter(Boolean)
		.map(line => JSON.parse(line));
}

test.describe('an unrated browser', () => {
	test('is on the starting rating without being written down', () => {
		const { ratings } = store();

		expect(ratings.mmrFor('never-played')).toBe(1000);
		// Reading must not invent a player. Every room frame and every row of the finder asks about ids
		// that have never finished a game, so a read that created an entry would be a slow leak of
		// whatever anybody's browser cared to send.
		expect(ratings.stats().players).toBe(0);
	});

	test('has no cooldown', () => {
		const { ratings } = store();

		expect(ratings.cooldownFor('never-played')).toBe(0);
	});

	test('is absent from the leaderboard', () => {
		const { ratings } = store();

		ratings.mmrFor('never-played');

		expect(ratings.leaderboard()).toEqual([]);
	});
});

test.describe('recording a finished game', () => {
	test('moves the winner up and the loser down, and says by how much', () => {
		const { ratings } = store();

		const movement = ratings.recordGame(finished('AB12', 'ana', 'bea'));

		expect(movement).toHaveLength(2);
		expect(movement[0]).toMatchObject({ id: 'ana', name: 'ANA', before: 1000 });
		expect(movement[0].delta).toBeGreaterThan(0);
		expect(movement[1].delta).toBeLessThan(0);
		// The delta is the difference, not a second opinion about it.
		expect(movement[0].after - movement[0].before).toBe(movement[0].delta);
		expect(ratings.mmrFor('ana')).toBe(movement[0].after);
	});

	test('writes exactly one line, and it is the event', () => {
		const { dir, ratings } = store();

		ratings.recordGame(finished('AB12', 'ana', 'bea'));

		expect(lines(dir)).toHaveLength(1);
		expect(lines(dir)[0]).toMatchObject({ t: 'game', code: 'AB12' });
		expect(lines(dir)[0].players.map(player => player.id)).toEqual(['ana', 'bea']);
	});

	test('a six-player table is one line and one place each', () => {
		const { dir, ratings } = store();
		const ids = ['a', 'b', 'c', 'd', 'e', 'f'];

		ratings.recordGame(finished('AB12', ...ids));

		expect(lines(dir)).toHaveLength(1);
		expect(ids.map(id => ratings.mmrFor(id))).toEqual([...ids.map(id => ratings.mmrFor(id))].sort((a, b) => b - a));
	});

	test('the leaderboard is the ratings, best first', () => {
		const { ratings } = store();

		ratings.recordGame(finished('AB12', 'ana', 'bea', 'caz'));

		const board = ratings.leaderboard();

		expect(board.map(entry => entry.id)).toEqual(['ana', 'bea', 'caz']);
		expect(board[0]).toMatchObject({ name: 'ANA', games: 1 });
		expect(board[0].mmr).toBeGreaterThan(board[2].mmr);
	});
});

test.describe('a restart', () => {
	test('reproduces the ratings exactly', () => {
		const time = clock();
		const { dir, ratings } = store({ now: time.now });

		ratings.recordGame(finished('AB12', 'ana', 'bea'));
		time.advance(60_000);
		ratings.recordGame(finished('CD34', 'bea', 'ana'));
		time.advance(60_000);
		ratings.recordQuit({ code: 'EF56', id: 'ana', name: 'ANA', others: [{ id: 'bea', name: 'BEA' }], stranded: 'bea' });

		const reloaded = createRatings({ dir, now: time.now, log: () => {} });

		// Exactly, not approximately. Both went through the same `apply`, in the same order.
		expect(reloaded.mmrFor('ana')).toBe(ratings.mmrFor('ana'));
		expect(reloaded.mmrFor('bea')).toBe(ratings.mmrFor('bea'));
		expect(reloaded.stats()).toEqual(ratings.stats());
		expect(reloaded.cooldownFor('ana')).toBe(ratings.cooldownFor('ana'));
	});

	test('rebuild() re-folds in place, which is how a retuned formula is applied', () => {
		const time = clock();
		const { ratings } = store({ now: time.now });

		ratings.recordGame(finished('AB12', 'ana', 'bea'));
		const before = ratings.mmrFor('ana');

		ratings.rebuild();

		expect(ratings.mmrFor('ana')).toBe(before);
		expect(ratings.stats().events).toBe(1);
	});

	test('a torn last line costs one game and nothing else', () => {
		const time = clock();
		const { dir, ratings } = store({ now: time.now });

		ratings.recordGame(finished('AB12', 'ana', 'bea'));
		const survived = ratings.mmrFor('ana');

		// What a process going away mid-append leaves behind.
		appendFileSync(join(dir, LOG_NAME), '{"t":"game","at":1,"code":"CD3', 'utf8');

		const messages = [];
		const reloaded = createRatings({ dir, now: time.now, log: message => messages.push(message) });

		expect(reloaded.mmrFor('ana')).toBe(survived);
		expect(reloaded.stats().events).toBe(1);
		expect(messages.some(message => message.includes('skipped 1'))).toBe(true);
	});

	test('an event from a newer build is carried past rather than fatal', () => {
		// The bundle is committed and rolling it back is a documented procedure, so an older server will
		// meet lines it does not understand. It has to keep reading.
		const time = clock();
		const { dir, ratings } = store({ now: time.now });

		ratings.recordGame(finished('AB12', 'ana', 'bea'));
		appendFileSync(join(dir, LOG_NAME), `${JSON.stringify({ t: 'tournament', at: time.now() })}\n`, 'utf8');
		ratings.recordGame(finished('CD34', 'ana', 'bea'));

		const reloaded = createRatings({ dir, now: time.now, log: () => {} });

		expect(reloaded.mmrFor('ana')).toBe(ratings.mmrFor('ana'));
	});

	test('no file at all is an empty history, not an error', () => {
		const messages = [];
		const ratings = createRatings({
			dir: mkdtempSync(join(tmpdir(), 'ha-ratings-')),
			log: message => messages.push(message),
		});

		expect(ratings.stats()).toMatchObject({ enabled: true, players: 0, events: 0 });
		expect(messages).toEqual([]);
	});
});

test.describe('when it cannot write', () => {
	// The dev-machine case, and the one that must never take the server down: /var/lib is not writable,
	// so the store disables itself and the game carries on unrated.
	function unwritable() {
		const path = join(mkdtempSync(join(tmpdir(), 'ha-ratings-')), 'wall');

		writeFileSync(path, 'not a directory', 'utf8');

		return path;
	}

	test('it says so once and disables itself', () => {
		const messages = [];

		const ratings = createRatings({ dir: unwritable(), log: message => messages.push(message) });

		expect(ratings.enabled).toBe(false);
		expect(messages.some(message => message.includes('ratings disabled'))).toBe(true);
	});

	test('recording still works in memory, so one server run stays consistent', () => {
		const ratings = createRatings({ dir: unwritable(), log: () => {} });

		const movement = ratings.recordGame(finished('AB12', 'ana', 'bea'));

		expect(movement[0].delta).toBeGreaterThan(0);
		expect(ratings.mmrFor('ana')).toBeGreaterThan(1000);
	});
});

test.describe('playing the same person over and over', () => {
	test('the same pairing moves less each time', () => {
		const time = clock();
		const { ratings } = store({ now: time.now });
		const gains = [];

		for (let game = 0; game < 6; game++) {
			gains.push(ratings.recordGame(finished('AB12', 'ana', 'bea'))[0].delta);
			time.advance(60_000);
		}

		// Not a cap — every one of these still counts for something, it just counts for less. A hard
		// cap would have made the sixth game worth exactly nothing, which is a different rule.
		expect(gains[5]).toBeLessThan(gains[0]);
		expect(gains[5]).toBeGreaterThan(0);
	});

	test('a fresh opponent is worth full weight again', () => {
		const time = clock();
		const { ratings } = store({ now: time.now });

		for (let game = 0; game < 6; game++) {
			ratings.recordGame(finished('AB12', 'ana', 'bea'));
			time.advance(60_000);
		}

		const stale = ratings.recordGame(finished('AB12', 'ana', 'bea'))[0].delta;
		time.advance(60_000);
		const fresh = ratings.recordGame(finished('CD34', 'ana', 'caz'))[0].delta;

		expect(fresh).toBeGreaterThan(stale);
	});

	test('a week apart and the pairing is worth full weight again', () => {
		const time = clock();
		const { ratings } = store({ now: time.now });

		for (let game = 0; game < 6; game++) {
			ratings.recordGame(finished('AB12', 'ana', 'bea'));
			time.advance(60_000);
		}

		const stale = ratings.recordGame(finished('AB12', 'ana', 'bea'))[0].delta;
		time.advance(8 * DAY);
		const rested = ratings.recordGame(finished('AB12', 'ana', 'bea'))[0].delta;

		expect(rested).toBeGreaterThan(stale);
	});

	test('feeding somebody the stranded bonus softens too', () => {
		const time = clock();
		const { ratings } = store({ now: time.now });
		const gains = [];

		for (let round = 0; round < 5; round++) {
			// One browser quits, the other collects. Repeatedly. The cheapest farm in the system.
			const movement = ratings.recordQuit({
				code: 'AB12',
				id: 'ana',
				name: 'ANA',
				others: [{ id: 'bea', name: 'BEA' }],
				stranded: 'bea',
			});

			gains.push(movement.find(entry => entry.id === 'bea').delta);
			time.advance(60_000);
		}

		expect(gains[4]).toBeLessThan(gains[0]);
	});
});

test.describe('walking out', () => {
	test('costs the leaver and nobody else, unless somebody was left alone', () => {
		const { ratings } = store();

		const movement = ratings.recordQuit({
			code: 'AB12',
			id: 'ana',
			name: 'ANA',
			others: [
				{ id: 'bea', name: 'BEA' },
				{ id: 'caz', name: 'CAZ' },
			],
		});

		expect(movement.map(entry => entry.id)).toEqual(['ana']);
		expect(movement[0].delta).toBeLessThan(0);
		expect(ratings.mmrFor('bea')).toBe(1000);
	});

	test('the player left with nothing to play is paid, partly', () => {
		const { ratings } = store();

		const movement = ratings.recordQuit({
			code: 'AB12',
			id: 'ana',
			name: 'ANA',
			others: [{ id: 'bea', name: 'BEA' }],
			stranded: 'bea',
		});

		expect(movement.map(entry => entry.id).sort()).toEqual(['ana', 'bea']);
		expect(movement.find(entry => entry.id === 'bea').delta).toBeGreaterThan(0);
		expect(movement.find(entry => entry.id === 'ana').delta).toBeLessThan(0);
	});

	test('the first walk-out costs thirty seconds, and waiting it out clears it', () => {
		const time = clock();
		const { ratings } = store({ now: time.now });

		ratings.recordQuit({ code: 'AB12', id: 'ana', name: 'ANA', others: [{ id: 'bea', name: 'BEA' }] });

		expect(ratings.cooldownFor('ana')).toBe(30_000);
		expect(ratings.cooldownFor('bea')).toBe(0);

		time.advance(31_000);

		expect(ratings.cooldownFor('ana')).toBe(0);
	});

	test('doing it again straight away doubles the wait', () => {
		const time = clock();
		const { ratings } = store({ now: time.now });

		ratings.recordQuit({ code: 'AB12', id: 'ana', name: 'ANA', others: [{ id: 'bea', name: 'BEA' }] });
		time.advance(60_000);
		ratings.recordQuit({ code: 'CD34', id: 'ana', name: 'ANA', others: [{ id: 'bea', name: 'BEA' }] });

		expect(ratings.cooldownFor('ana')).toBe(60_000);

		time.advance(60_000);
		ratings.recordQuit({ code: 'EF56', id: 'ana', name: 'ANA', others: [{ id: 'bea', name: 'BEA' }] });

		expect(ratings.cooldownFor('ana')).toBe(120_000);
	});

	test('one a day never escalates', () => {
		// The ladder decays a level per day, so the player who drops out of one game an evening — a
		// phone ringing, a bus arriving — is never treated as a serial quitter.
		const time = clock();
		const { ratings } = store({ now: time.now });

		for (let day = 0; day < 5; day++) {
			ratings.recordQuit({ code: 'AB12', id: 'ana', name: 'ANA', others: [{ id: 'bea', name: 'BEA' }] });

			expect(ratings.cooldownFor('ana')).toBe(30_000);

			time.advance(DAY);
		}
	});
});
