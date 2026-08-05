import { test, expect } from '@playwright/test';
import py, { BASE_POINTS } from 'Domain/py';
import { dealAlignments } from 'Domain/deal';

function player(name, friend, foe, overrides = {}) {
	return {
		name,
		turn: false,
		alignment: { friend, foe },
		revealed: { friend: false, foe: false },
		allowedToAccuse: { friend: true, foe: true },
		...overrides,
	};
}

test.describe('py.accuse', () => {
	// Regression: the map had no fallback return, so anyone who was neither accuser nor
	// accusee came back undefined. Two players masked it; three or more is a crash.
	test('leaves uninvolved players intact in a 3 player game', () => {
		const players = [player('ANA', '1', '0', { turn: true }), player('BEA', '0', '3'), player('CAI', '2', '1')];

		const result = py.accuse({ accuser: 'ANA', accusee: 'BEA', alignment: 'friend', team: '0' }, players);

		expect(result).toHaveLength(3);
		expect(result.every(Boolean)).toBe(true);
		expect(py.getTurn(result)).toEqual('ANA');
		expect(result[2]).toEqual(players[2]);
	});

	test('reveals the accusee and keeps the accuser allowed when the accusation is right', () => {
		const players = [player('ANA', '1', '0', { turn: true }), player('BEA', '0', '3')];

		const result = py.accuse({ accuser: 'ANA', accusee: 'BEA', alignment: 'friend', team: '0' }, players);

		expect(result[1].revealed.friend).toBe(true);
		expect(result[0].allowedToAccuse.friend).toBe(true);
	});

	test('bars the accuser from accusing again when the accusation is wrong', () => {
		const players = [player('ANA', '1', '0', { turn: true }), player('BEA', '0', '3')];

		const result = py.accuse({ accuser: 'ANA', accusee: 'BEA', alignment: 'friend', team: '2' }, players);

		expect(result[1].revealed.friend).toBe(false);
		expect(result[0].allowedToAccuse.friend).toBe(false);
	});
});

test.describe('py.getBaseScore', () => {
	// The number the friend-and-foe screen shows for every player at the table, and the number the
	// final score sheet starts from. One function so those two can never disagree.
	test('is a hundred until an alignment goes public, then fifty, then nothing', () => {
		expect(py.getBaseScore(player('ANA', '1', '0'))).toEqual(BASE_POINTS);

		expect(py.getBaseScore(player('ANA', '1', '0', { revealed: { friend: true, foe: false } }))).toEqual(50);
		expect(py.getBaseScore(player('ANA', '1', '0', { revealed: { friend: false, foe: true } }))).toEqual(50);

		expect(py.getBaseScore(player('ANA', '1', '0', { revealed: { friend: true, foe: true } }))).toEqual(0);
	});

	// Revealing and being accused correctly set the same field, and they cost the same. The ledger
	// tells them apart for the story; the score does not care which it was.
	test('charges an accusation exactly what a reveal costs', () => {
		const players = [player('ANA', '1', '0', { turn: true }), player('BEA', '0', '3')];

		const accused = py.accuse({ accuser: 'ANA', accusee: 'BEA', alignment: 'friend', team: '0' }, players);
		const revealed = py.revealFriend([player('BEA', '0', '3', { turn: true })]);

		expect(py.getBaseScore(accused[1])).toEqual(py.getBaseScore(revealed[0]));
		expect(py.getBaseScore(accused[0])).toEqual(BASE_POINTS);
	});

	// A room persisted before `revealed` was a field, or a fixture built by hand: the screen this
	// feeds renders for every player on every frame of the play phase, so it may not throw.
	test('survives a player with no revealed field at all', () => {
		expect(py.getBaseScore({ name: 'ANA', alignment: { friend: '1', foe: '0' } })).toEqual(BASE_POINTS);
	});

	test('is the whole of the score when neither team has anything on the board', () => {
		// No pieces, so no kills and no survivors on either side: the score is the baseline and nothing
		// else, which is what makes it the honest half to show mid-game.
		const revealed = player('ANA', '1', '0', { revealed: { friend: true, foe: false } });

		expect(py.getPoints(revealed, [])).toEqual(py.getBaseScore(revealed));
	});
});

test.describe('dealAlignments', () => {
	const names = ['ANA', 'BEA', 'CAI', 'DAN', 'EVA', 'FAY'];

	test('never deals a player the same team as friend and foe', () => {
		// Deterministic sweep rather than one lucky draw.
		for (let seed = 0; seed < 200; seed++) {
			let n = seed + 1;
			const rng = () => {
				n = (n * 1103515245 + 12345) % 2147483648;
				return n / 2147483648;
			};

			dealAlignments(names, rng).forEach(({ friend, foe }) => {
				expect(friend).not.toEqual(foe);
			});
		}
	});

	test('deals every player a pair', () => {
		const dealt = dealAlignments(names);

		expect(dealt).toHaveLength(6);
		dealt.forEach(({ name, friend, foe }) => {
			expect(names).toContain(name);
			expect(['0', '1', '2', '3']).toContain(friend);
			expect(['0', '1', '2', '3']).toContain(foe);
		});
	});

	// The old module-level decks were spliced in place, so a second game in one page load
	// started depleted and eventually dealt undefined.
	test('starts from a full deck on every call', () => {
		const first = dealAlignments(names);
		const second = dealAlignments(names);

		expect(second).toHaveLength(first.length);
		second.forEach(({ friend, foe }) => {
			expect(friend).toBeDefined();
			expect(foe).toBeDefined();
		});
	});
});

test.describe('py.removePlayer', () => {
	test('drops the player and leaves everybody else exactly as they were', () => {
		const players = [player('ANA', '1', '0', { turn: true }), player('BEA', '0', '3'), player('CAI', '2', '1')];

		const result = py.removePlayer(players, 'BEA');

		expect(result.map(entry => entry.name)).toEqual(['ANA', 'CAI']);
		expect(result[0]).toEqual(players[0]);
		expect(result[1]).toEqual(players[2]);
	});

	// The invariant this exists to keep: exactly one player holds the turn, always. getTurn reads it
	// with no guard — `players.find(...).name` — so a table where nobody has it throws on the next
	// render, from a component that has nothing to do with anybody leaving.
	test('passes the turn on when it belonged to the player leaving', () => {
		const players = [player('ANA', '1', '0', { turn: true }), player('BEA', '0', '3'), player('CAI', '2', '1')];

		const result = py.removePlayer(players, 'ANA');

		expect(result.map(entry => entry.name)).toEqual(['BEA', 'CAI']);
		expect(py.getTurn(result)).toEqual('BEA');
	});

	test('wraps, when the player leaving was last in the order and held the turn', () => {
		const players = [player('ANA', '1', '0'), player('BEA', '0', '3'), player('CAI', '2', '1', { turn: true })];

		const result = py.removePlayer(players, 'CAI');

		expect(py.getTurn(result)).toEqual('ANA');
	});

	test('the last player leaving empties the table rather than looking for somebody to hand it to', () => {
		const players = [player('ANA', '1', '0', { turn: true })];

		expect(py.removePlayer(players, 'ANA')).toEqual([]);
	});

	test('a name nobody at the table has changes nothing', () => {
		const players = [player('ANA', '1', '0', { turn: true }), player('BEA', '0', '3')];

		expect(py.removePlayer(players, 'NOBODY')).toEqual(players);
	});
});
