import { test, expect } from '@playwright/test';
import { MAX_PLAYERS } from 'Domain/py';
import {
	createMatchQueue,
	HOLD_MS,
	PREFERRED_SIZE,
	WINDOW_BASE,
	WINDOW_EVERY_MS,
	WINDOW_OPEN_AFTER_MS,
} from 'Server/queue';

// The queue makes one decision — who is at the next table — and it has to make it without ever
// matching somebody against themselves, without holding a table up forever, and without leaving the
// person who has waited longest behind. Those are the three things here.

function clock(start = 1_000_000) {
	let at = start;

	return {
		now: () => at,
		advance(ms) {
			at += ms;

			return at;
		},
	};
}

function queueOf(entries, now) {
	const queue = createMatchQueue({ now });

	entries.forEach(entry => queue.add({ key: entry.name, playerId: `${entry.name}-browser`, ...entry }));

	return queue;
}

test.describe('forming a table', () => {
	test('nobody plays alone', () => {
		const queue = queueOf([{ name: 'ANA', mmr: 1000 }]);

		expect(queue.formMatch()).toBeNull();
	});

	test('a full table of four goes straight away', () => {
		const time = clock();
		const queue = queueOf(
			[
				{ name: 'ANA', mmr: 1000 },
				{ name: 'BEA', mmr: 1020 },
				{ name: 'CAZ', mmr: 1040 },
				{ name: 'DEE', mmr: 1060 },
			],
			time.now,
		);

		expect(queue.formMatch()).toHaveLength(PREFERRED_SIZE);
	});

	test('two players wait for a third before settling for each other', () => {
		const time = clock();
		const queue = queueOf(
			[
				{ name: 'ANA', mmr: 1000 },
				{ name: 'BEA', mmr: 1020 },
			],
			time.now,
		);

		// Worth holding out for a better table, briefly.
		expect(queue.formMatch()).toBeNull();

		time.advance(HOLD_MS);

		// And then not.
		expect(
			queue
				.formMatch()
				.map(entry => entry.name)
				.sort(),
		).toEqual(['ANA', 'BEA']);
	});

	test('a table never exceeds the size the game allows', () => {
		const time = clock();
		const queue = queueOf(
			Array.from({ length: MAX_PLAYERS + 3 }, (_, index) => ({ name: `P${index}`, mmr: 1000 + index })),
			time.now,
		);

		expect(queue.formMatch()).toHaveLength(MAX_PLAYERS);
	});

	test('a table takes everybody it can rather than leaving somebody behind', () => {
		const time = clock();
		const queue = queueOf(
			Array.from({ length: 5 }, (_, index) => ({ name: `P${index}`, mmr: 1000 })),
			time.now,
		);

		// Five waiting is a table of five, not a table of four and somebody left in the queue on their
		// own — PREFERRED_SIZE is the point at which it stops holding out, not a cap.
		expect(queue.formMatch()).toHaveLength(5);
	});

	test('claiming a table takes it out of the queue and leaves the rest waiting', () => {
		const time = clock();
		const queue = queueOf(
			Array.from({ length: MAX_PLAYERS + 1 }, (_, index) => ({ name: `P${index}`, mmr: 1000 })),
			time.now,
		);

		const group = queue.formMatch();
		queue.claim(group);

		expect(group).toHaveLength(MAX_PLAYERS);
		expect(queue.size).toEqual(1);
		expect(group.every(entry => !queue.has(entry.key))).toBe(true);
	});
});

test.describe('who gets matched with whom', () => {
	test('a rating too far away is not a table, however long they have both waited', () => {
		const time = clock();
		const queue = queueOf(
			[
				{ name: 'ANA', mmr: 1000 },
				{ name: 'FAR', mmr: 1000 + WINDOW_BASE * 4 },
			],
			time.now,
		);

		time.advance(HOLD_MS);

		expect(queue.formMatch()).toBeNull();
	});

	test('the window widens with waiting, and eventually opens completely', () => {
		const time = clock();
		const queue = queueOf(
			[
				{ name: 'ANA', mmr: 1000 },
				{ name: 'FAR', mmr: 9000 },
			],
			time.now,
		);

		expect(queue.describe('ANA').window).toEqual(WINDOW_BASE);

		time.advance(WINDOW_EVERY_MS);
		expect(queue.describe('ANA').window).toBeGreaterThan(WINDOW_BASE);

		time.advance(WINDOW_OPEN_AFTER_MS);
		// Open, reported as null rather than an infinity JSON has no way to carry.
		expect(queue.describe('ANA').window).toBeNull();
		// Somebody who has waited a minute would rather play the wrong table than no table.
		expect(queue.formMatch()).toHaveLength(2);
	});

	test('the closest ratings fill the table first', () => {
		const time = clock();
		const queue = queueOf(
			[
				{ name: 'ANCHOR', mmr: 1000 },
				{ name: 'MILES', mmr: 1140 },
				{ name: 'NEAR', mmr: 1010 },
				{ name: 'CLOSE', mmr: 1050 },
			],
			time.now,
		);

		time.advance(HOLD_MS);

		expect(queue.formMatch().map(entry => entry.name)).toEqual(['ANCHOR', 'NEAR', 'CLOSE', 'MILES']);
	});

	// The fairness rule, and the reason the anchor is the longest wait rather than the tightest cluster:
	// two well-matched players who arrive later must not keep stepping over somebody already waiting.
	test('whoever has waited longest is always in the next table', () => {
		const time = clock();
		const queue = createMatchQueue({ now: time.now });

		queue.add({ key: 'first', playerId: 'first-browser', name: 'FIRST', mmr: 1000 });

		time.advance(HOLD_MS);
		queue.add({ key: 'pair-a', playerId: 'a-browser', name: 'PAIRA', mmr: 1100 });
		queue.add({ key: 'pair-b', playerId: 'b-browser', name: 'PAIRB', mmr: 1105 });

		expect(queue.formMatch().map(entry => entry.name)).toContain('FIRST');
	});
});

test.describe('the same player twice', () => {
	test('one browser cannot be matched against itself', () => {
		const time = clock();
		const queue = createMatchQueue({ now: time.now });

		// Two tabs. The second replaces the first rather than joining it, so there is nobody to play.
		queue.add({ key: 'tab-one', playerId: 'same-browser', name: 'ANA', mmr: 1000 });
		const { displaced } = queue.add({ key: 'tab-two', playerId: 'same-browser', name: 'ANA', mmr: 1000 });

		expect(queue.size).toEqual(1);
		// The abandoned tab is handed back so it can be told to stop searching, rather than being left on
		// a spinner that never resolves.
		expect(displaced.map(entry => entry.key)).toEqual(['tab-one']);
		expect(queue.formMatch()).toBeNull();
	});

	test('re-queueing on the same key is not a displacement', () => {
		const queue = createMatchQueue();

		queue.add({ key: 'tab', playerId: 'same-browser', name: 'ANA', mmr: 1000 });

		expect(queue.add({ key: 'tab', playerId: 'same-browser', name: 'ANA', mmr: 1000 }).displaced).toEqual([]);
	});

	test('two browsers with no rating id at all are still two players', () => {
		const time = clock();
		const queue = createMatchQueue({ now: time.now });

		// Storage disabled at both ends. Nothing identifies them, so nothing may assume they are the same
		// person either — and there is no rating to farm.
		queue.add({ key: 'one', name: 'ANA', mmr: 1000 });
		queue.add({ key: 'two', name: 'BEA', mmr: 1000 });

		time.advance(HOLD_MS);

		expect(queue.formMatch()).toHaveLength(2);
	});

	// `addSeat` refuses a name already at the table, so a group carrying a clash could not be seated at
	// all. Better to leave one of them waiting than to form a table that cannot be made.
	test('two players with the same name cannot share a table', () => {
		const time = clock();
		const queue = createMatchQueue({ now: time.now });

		queue.add({ key: 'one', playerId: 'one-browser', name: 'FEDE', mmr: 1000 });
		queue.add({ key: 'two', playerId: 'two-browser', name: 'FEDE', mmr: 1000 });

		time.advance(HOLD_MS);

		expect(queue.formMatch()).toBeNull();
	});
});

test.describe('what a waiting client is told', () => {
	test('how many are waiting and how long it has been', () => {
		const time = clock();
		const queue = queueOf(
			[
				{ name: 'ANA', mmr: 1000 },
				{ name: 'BEA', mmr: 1000 },
			],
			time.now,
		);

		time.advance(5000);

		expect(queue.describe('ANA')).toMatchObject({ searching: true, waiting: 2, elapsed: 5000 });
	});

	test('nothing at all once they are no longer in it', () => {
		const queue = queueOf([{ name: 'ANA', mmr: 1000 }]);

		queue.remove('ANA');

		expect(queue.describe('ANA')).toBeNull();
	});
});
