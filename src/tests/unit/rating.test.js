import { test, expect } from '@playwright/test';
import {
	SKILL,
	STRANDED_WEIGHT,
	initialSkill,
	toMmr,
	rate,
	rateDeparture,
	pairSoftening,
	nextQuitLevel,
	quitCooldownMs,
} from 'Domain/rating';

// These are relationships, not magic numbers, for the same reason skin.test.js reads a fill's alpha
// rather than its hex: every constant in rating.js is expected to be retuned, and a spec pinned to
// today's output would fail on a change that was the whole point of making it. The one literal here is
// the starting MMR, because that number is a promise to the player.
//
// What is actually being guarded: that a result moves ratings the right way, that σ only ever shrinks
// on a rated game, that a softened pairing moves *both* μ and σ less, and that the departure rules
// touch exactly the players they say they do.

const HOUR = 60 * 60_000;
const DAY = 24 * HOUR;

function twoPlayers({ winner = SKILL, loser = SKILL } = {}) {
	return [
		{ id: 'winner', place: 1, ...winner },
		{ id: 'loser', place: 2, ...loser },
	];
}

test.describe('the number a player sees', () => {
	test('a new player is on exactly 1000', () => {
		// 60 × (μ₀ − σ₀) is 60 × 50/3. The scale was chosen to make this exact, so if it stops being
		// exact somebody has changed μ₀ or σ₀ without meaning to.
		expect(toMmr(initialSkill())).toBe(1000);
	});

	test('it is floored, so a long losing run cannot go negative', () => {
		expect(toMmr({ mu: 1, sigma: 20 })).toBe(0);
	});

	test('it is conservative, so being unsure costs a player', () => {
		const known = { mu: 30, sigma: 2 };
		const unknown = { mu: 30, sigma: 8 };

		expect(toMmr(known)).toBeGreaterThan(toMmr(unknown));
	});
});

test.describe('rating a result', () => {
	test('the winner goes up and the loser goes down', () => {
		const rated = rate({ entries: twoPlayers() });

		expect(rated.winner.mu).toBeGreaterThan(SKILL.mu);
		expect(rated.loser.mu).toBeLessThan(SKILL.mu);
		expect(toMmr(rated.winner)).toBeGreaterThan(1000);
		expect(toMmr(rated.loser)).toBeLessThan(1000);
	});

	test('a game always teaches us something, so σ shrinks for everybody', () => {
		const rated = rate({ entries: twoPlayers() });

		expect(rated.winner.sigma).toBeLessThan(SKILL.sigma);
		expect(rated.loser.sigma).toBeLessThan(SKILL.sigma);
	});

	test('a draw moves nothing between equals, but still narrows them', () => {
		// Two identical players tying is precisely the expected result, so there is nothing to learn
		// about which is better — and something to learn about how good they both are. py.getPoints can
		// tie two players exactly, so this is a real outcome and not a defensive case.
		const rated = rate({
			entries: [
				{ id: 'a', place: 1, ...SKILL },
				{ id: 'b', place: 1, ...SKILL },
			],
		});

		expect(rated.a.mu).toBe(SKILL.mu);
		expect(rated.b.mu).toBe(SKILL.mu);
		expect(rated.a.sigma).toBeLessThan(SKILL.sigma);
	});

	test('beating somebody better is worth more than beating somebody worse', () => {
		const strong = { mu: 40, sigma: SKILL.sigma };
		const weak = { mu: 10, sigma: SKILL.sigma };

		const upset = rate({ entries: twoPlayers({ loser: strong }) });
		const expected = rate({ entries: twoPlayers({ loser: weak }) });

		expect(upset.winner.mu - SKILL.mu).toBeGreaterThan(expected.winner.mu - SKILL.mu);
	});

	test('a player the game already knows moves less than a newcomer on the same result', () => {
		// This is what carrying an uncertainty buys, and it is the thing a fixed Elo K-factor cannot do:
		// nothing had to be told that one of these players is established.
		const settled = rate({ entries: twoPlayers({ winner: { mu: SKILL.mu, sigma: 1 } }) });
		const fresh = rate({ entries: twoPlayers() });

		expect(settled.winner.mu - SKILL.mu).toBeLessThan(fresh.winner.mu - SKILL.mu);
	});

	test('a six-player table orders everybody, and the table is not zero-sum', () => {
		const places = [1, 2, 3, 4, 5, 6];
		const rated = rate({ entries: places.map(place => ({ id: `p${place}`, place, ...SKILL })) });
		const mmrs = places.map(place => toMmr(rated[`p${place}`]));

		// Strictly descending: sixth place is worth less than fifth, all the way up.
		expect(mmrs).toEqual([...mmrs].sort((a, b) => b - a));
		expect(new Set(mmrs).size).toBe(places.length);

		// Not conserved, and deliberately so — each player's update is computed from their own
		// perspective. It is what lets a whole table lose rating for abandoning a game.
		const movement = places.reduce((total, place) => total + (rated[`p${place}`].mu - SKILL.mu), 0);

		expect(Math.abs(movement)).toBeGreaterThan(0);
	});

	test('`only` restricts who is written back, and does not change what they get', () => {
		const entries = twoPlayers();
		const both = rate({ entries });
		const one = rate({ entries, only: ['winner'] });

		expect(Object.keys(one)).toEqual(['winner']);
		expect(one.winner).toEqual(both.winner);
	});

	test('it does not mutate what it is given', () => {
		// The same guard the reducers carry, for the same reason: this runs inside a server that holds
		// one state object per room and persists it.
		const entries = twoPlayers().map(entry => Object.freeze(entry));

		Object.freeze(entries);

		expect(() => rate({ entries })).not.toThrow();
		expect(entries[0].mu).toBe(SKILL.mu);
	});
});

test.describe('playing the same person over and over', () => {
	test('softening halves at three meetings and quarters at nine', () => {
		expect(pairSoftening(0)).toBe(1);
		expect(pairSoftening(3)).toBeCloseTo(0.5);
		expect(pairSoftening(9)).toBeCloseTo(0.25);
	});

	test('it never reaches zero, so regulars keep having ratings', () => {
		// A geometric decay would round to nothing here, which would quietly stop rating a group of
		// friends who only ever play each other — the exact people most likely to be using this.
		expect(pairSoftening(100)).toBeGreaterThan(0);
	});

	test('a nonsensical count is treated as a first meeting', () => {
		expect(pairSoftening(-5)).toBe(1);
		expect(pairSoftening()).toBe(1);
	});

	test('a softened pairing damps the movement and the confidence together', () => {
		const full = rate({ entries: twoPlayers() });
		const softened = rate({ entries: twoPlayers(), pairWeight: () => pairSoftening(9) });

		expect(softened.winner.mu - SKILL.mu).toBeLessThan(full.winner.mu - SKILL.mu);
		// The half that is easy to forget: a game that should barely move a rating should barely
		// narrow it either, or farming would still buy certainty even when it stopped buying μ.
		expect(softened.winner.sigma).toBeGreaterThan(full.winner.sigma);
		expect(softened.winner.sigma).toBeLessThan(SKILL.sigma);
	});

	test('a zero weight is a game that never happened', () => {
		const rated = rate({ entries: twoPlayers(), pairWeight: () => 0 });

		// σ still takes the between-games τ, so this is "no information", not "no time passing".
		expect(rated.winner.mu).toBe(SKILL.mu);
		expect(rated.winner.sigma).toBeGreaterThanOrEqual(SKILL.sigma);
	});
});

test.describe('walking out of a game', () => {
	const leaver = { id: 'leaver', ...SKILL };
	const others = [
		{ id: 'stayed', ...SKILL },
		{ id: 'alsoStayed', ...SKILL },
	];

	test('the leaver takes a full loss and nobody still playing is touched', () => {
		const rated = rateDeparture({ leaver, others });

		expect(Object.keys(rated)).toEqual(['leaver']);
		expect(toMmr(rated.leaver)).toBeLessThan(1000);
	});

	test('losing to a whole table costs more than losing to one player', () => {
		const table = rateDeparture({ leaver, others });
		const single = rateDeparture({ leaver, others: [others[0]] });

		expect(table.leaver.mu).toBeLessThan(single.leaver.mu);
	});

	test('the player left alone gets a win, softened', () => {
		const stranded = rateDeparture({ leaver, others: [others[0]], strandedId: 'stayed' });
		const won = rate({
			entries: [
				{ ...others[0], place: 1 },
				{ ...leaver, place: 2 },
			],
		});

		expect(toMmr(stranded.stayed)).toBeGreaterThan(1000);
		// Less than beating them would have been. They did not win; the game was taken away.
		expect(stranded.stayed.mu - SKILL.mu).toBeLessThan(won.stayed.mu - SKILL.mu);
		expect(stranded.stayed.mu - SKILL.mu).toBeCloseTo(STRANDED_WEIGHT * (won.stayed.mu - SKILL.mu), 1);
	});

	test('the leaver still pays in full even when the survivor is only paid half', () => {
		const stranded = rateDeparture({ leaver, others: [others[0]], strandedId: 'stayed' });
		const plain = rateDeparture({ leaver, others: [others[0]] });

		expect(stranded.leaver).toEqual(plain.leaver);
	});

	test('softening applies to departures too, or feeding somebody wins is free', () => {
		// Two browsers alone in a room, one quits, the other collects, repeat. This is the cheapest
		// farm the whole system has, and the only thing standing in front of it is that the pair weight
		// reaches here as well.
		const fresh = rateDeparture({ leaver, others: [others[0]], strandedId: 'stayed' });
		const repeated = rateDeparture({
			leaver,
			others: [others[0]],
			strandedId: 'stayed',
			pairWeight: () => pairSoftening(9),
		});

		expect(repeated.stayed.mu - SKILL.mu).toBeLessThan(fresh.stayed.mu - SKILL.mu);
		expect(repeated.leaver.mu).toBeGreaterThan(fresh.leaver.mu);
	});
});

test.describe('the quit cooldown ladder', () => {
	test('a first quit is thirty seconds and each one after it doubles', () => {
		expect(quitCooldownMs(0)).toBe(0);
		expect(quitCooldownMs(1)).toBe(30_000);
		expect(quitCooldownMs(2)).toBe(60_000);
		expect(quitCooldownMs(3)).toBe(120_000);
	});

	test('it caps, so a bad week is never a ban', () => {
		expect(quitCooldownMs(8)).toBe(64 * 60_000);
		expect(quitCooldownMs(50)).toBe(quitCooldownMs(8));
	});

	test('the first quit ever puts a player on level one', () => {
		expect(nextQuitLevel(0, Infinity)).toBe(1);
		expect(nextQuitLevel()).toBe(1);
	});

	test('quitting again straight away climbs a level', () => {
		expect(nextQuitLevel(1, 0)).toBe(2);
		expect(nextQuitLevel(2, HOUR)).toBe(3);
	});

	test('a day off comes back down a level, so quitting once a day never escalates', () => {
		expect(nextQuitLevel(1, DAY)).toBe(1);
		expect(nextQuitLevel(3, DAY)).toBe(3);
		expect(nextQuitLevel(5, 3 * DAY)).toBe(3);
	});

	test('enough time away and it is as if it never happened', () => {
		expect(nextQuitLevel(8, 30 * DAY)).toBe(1);
	});

	test('the level cannot climb past the cap', () => {
		expect(nextQuitLevel(8, 0)).toBe(8);
	});
});
