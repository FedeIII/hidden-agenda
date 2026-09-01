import { test, expect } from '@playwright/test';
import { TYPES } from 'Domain/pieces';
import killMove, { CHANNELS, EFFECTS, sparkCurve } from 'Client/three/killMoves';

// The four kill gestures, checked without a renderer. What a token does when it takes a piece is
// not something a spec can read off the DOM — the 3D layer draws it and the invisible box a click
// lands on does not move, deliberately — so what is asserted here is the shape of the table rather
// than the picture, and the properties that would break the board quietly if they went: a gesture
// that does not come back to rest, one that outstays its welcome, and a blow that lands outside
// the gesture that is supposed to contain it.

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

// How far each channel may go, in its own units. These are gestures rather than nudges now — the
// first version of this table was too quiet to read — but none of them may reach the next cell:
// a column pitch is 1.7321R and a token radius is 0.74R, so half a token radius of travel is
// about a fifth of the way to the neighbouring tile. That is the line.
const CEILING = {
	[CHANNELS.LUNGE]: 0.6,
	[CHANNELS.SWEEP]: 0.6,
	[CHANNELS.KICK]: 0.6,
	// Six percent, and not a taste: past that a swollen nose reaches through the piece in front.
	// See the note on PROW_REACH in assets.js and the comment on the CEO in killMoves.js.
	[CHANNELS.SWELL]: 0.06,
};

test('every piece type kills in a way of its own', () => {
	const channels = ALL_TYPES.map(type => {
		const move = killMove(type);

		expect(move, `${type} has no kill move`).toBeTruthy();
		expect(Object.values(CHANNELS), `${type} moves in no known channel`).toContain(move.channel);

		return move.channel;
	});

	// One channel each. Four amounts of one motion would be four amounts of one motion, which at
	// this size and this speed is no distinction at all.
	expect(new Set(channels).size).toBe(ALL_TYPES.length);
});

test('every kill leaves a mark of its own', () => {
	const kinds = ALL_TYPES.map(type => {
		const { effect } = killMove(type);

		expect(effect, `${type} leaves no mark`).toBeTruthy();
		expect(Object.values(EFFECTS), `${type} leaves an unknown mark`).toContain(effect.kind);
		expect(effect.glow, `${type} throws no light`).toBeGreaterThan(0);

		// A mark that outlived its gesture would still be burning while the piece stood still.
		expect(effect.seconds, `${type}'s mark outlasts its gesture`).toBeLessThanOrEqual(killMove(type).seconds);

		return effect.kind;
	});

	expect(new Set(kinds).size).toBe(ALL_TYPES.length);
});

test('a kill gesture starts and ends at rest', () => {
	for (const type of ALL_TYPES) {
		const { curve } = killMove(type);

		// What the curve returns is ADDED to the token's rest pose. A curve that ends anywhere but
		// zero leaves that piece shoved off its cell, or the wrong size, for the rest of the game
		// — and every later kill compounds it.
		expect(curve(0), `${type} does not start at rest`).toBeCloseTo(0, 9);
		expect(curve(1), `${type} does not end at rest`).toBeCloseTo(0, 9);
	}
});

test('a kill gesture is peak-normalised, so its amount is its amplitude', () => {
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

test('the blow lands inside the gesture that carries it', () => {
	for (const type of ALL_TYPES) {
		const { strike, hold, seconds } = killMove(type);

		// The board hangs the corpse's release on this. At 0 it would fire before anything had
		// moved, and at 1 the gesture would be over before the dead piece was allowed to leave.
		expect(strike, `${type} strikes before it moves`).toBeGreaterThan(0);
		expect(strike, `${type} strikes after it has finished`).toBeLessThan(1);

		// A hold is stillness before the gesture, and only the spy has one. It is part of what the
		// player waits through, so it counts against the same budget.
		expect(hold).toBeGreaterThanOrEqual(0);
		expect(hold + seconds, `${type} takes too long`).toBeLessThanOrEqual(0.8);
	}
});

test('a kill gesture stays quick, and stays this side of the next cell', () => {
	for (const type of ALL_TYPES) {
		const { channel, amount, seconds } = killMove(type);

		expect(amount, `${type} moves too far`).toBeLessThanOrEqual(CEILING[channel]);
		expect(amount, `${type} does not move at all`).toBeGreaterThan(0);

		// Long enough to be seen, short enough to be over before the next player reaches for
		// anything. The CEO is the slowest at 0.6s and the agent's charge the quickest at 0.3s.
		expect(seconds).toBeGreaterThanOrEqual(0.3);
		expect(seconds).toBeLessThanOrEqual(0.8);
	}
});

test('the mark comes up at once and spends its life fading', () => {
	// Shared by all four, so it is asserted once. It has to start and end dark for the same reason
	// the gestures start and end at rest — the quad is simply left visible otherwise.
	expect(sparkCurve(0)).toBeCloseTo(0, 9);
	expect(sparkCurve(1)).toBeCloseTo(0, 9);

	const values = sample(sparkCurve);
	const brightest = values.indexOf(Math.max(...values));

	// In the first quarter: a spark that peaked halfway through would read as a shape being shown
	// rather than as light arriving.
	expect(brightest / SAMPLES).toBeLessThan(0.25);
});
