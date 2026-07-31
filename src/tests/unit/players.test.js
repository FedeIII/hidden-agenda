import { test, expect } from '@playwright/test';
import py from 'Domain/py';
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
