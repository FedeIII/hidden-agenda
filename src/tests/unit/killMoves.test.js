import { test, expect } from '@playwright/test';
import { TYPES } from 'Domain/pieces';
import killMove, { CHANNELS } from 'Client/three/killMoves';

// The four kill moves, checked without a renderer. What a token does when it takes a piece is not
// something a spec can read off the DOM — the 3D layer draws it and the invisible box a click
// lands on does not move, deliberately — so what is asserted here is the shape of the table
// rather than the picture, and the two properties that would break the board quietly if they
// went: a move that does not come back to rest, and a move that stops being subtle.

const ALL_TYPES = Object.values(TYPES);
const SAMPLES = 200;

// Read at u = 0 and u = 1 exactly, plus every step between.
function sample(curve) {
	const values = [];

	for (let at = 0; at <= SAMPLES; at++) {
		values.push(curve(at / SAMPLES));
	}

	return values;
}

// How far each channel may go, in its own units. This is the "very subtle" of the brief written
// down: a press of a third of a token's height, a slip of a dozen degrees, a recoil of a seventh
// of a token, a swell of six percent. A move that wants more than this is a different feature.
const CEILING = {
	[CHANNELS.SINK]: 0.35,
	[CHANNELS.TWIST]: 12,
	[CHANNELS.KICK]: 0.15,
	[CHANNELS.SWELL]: 0.06,
};

test('every piece type kills in a way of its own', () => {
	const channels = ALL_TYPES.map(type => {
		const move = killMove(type);

		expect(move, `${type} has no kill move`).toBeTruthy();

		return move.channel;
	});

	// One channel each. Four variations on one channel would be four amounts of the same move,
	// and at these amplitudes that is no distinction at all.
	expect(new Set(channels).size).toBe(ALL_TYPES.length);
});

test('a kill move starts and ends at rest', () => {
	for (const type of ALL_TYPES) {
		const { curve } = killMove(type);

		// What the curve returns is ADDED to the token's rest pose. A curve that ends anywhere but
		// zero leaves that piece pressed into the board, turned off its bearing or the wrong size
		// for the rest of the game — and every later kill compounds it.
		expect(curve(0), `${type} does not start at rest`).toBeCloseTo(0, 9);
		expect(curve(1), `${type} does not end at rest`).toBeCloseTo(0, 9);
	}
});

test('a kill move is peak-normalised, so its amount is its amplitude', () => {
	for (const type of ALL_TYPES) {
		const { curve } = killMove(type);
		const peak = Math.max(...sample(curve).map(Math.abs));

		// Within a tenth of a percent either side, and not exactly one: both the normalisation and
		// this reading are sampled, on grids of different sizes, so neither lands on the true peak
		// of a continuous curve. What matters is that `amount` is the amplitude rather than a
		// coefficient of it — a curve peaking at 0.55 would make every amount below a lie.
		expect(peak, `${type} does not reach its amplitude`).toBeGreaterThan(0.999);
		expect(peak, `${type} overshoots its amplitude`).toBeLessThan(1.001);
	}
});

test('a kill move stays subtle, and stays short', () => {
	for (const type of ALL_TYPES) {
		const { channel, amount, seconds } = killMove(type);

		expect(amount, `${type} moves too far`).toBeLessThanOrEqual(CEILING[channel]);
		expect(amount, `${type} does not move at all`).toBeGreaterThan(0);

		// Long enough to be seen, short enough to be over before the next player reaches for
		// anything. The CEO is the slowest at 0.62s.
		expect(seconds).toBeGreaterThan(0.2);
		expect(seconds).toBeLessThanOrEqual(0.8);
	}
});
