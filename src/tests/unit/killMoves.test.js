import { test, expect } from '@playwright/test';
import { TYPES } from 'Domain/pieces';
import killMove, { burstScale, CHANNELS, EFFECTS, sparkCurve, trailCurve } from 'Client/three/killMoves';

// The four kill gestures, checked without a renderer. What a token does when it takes a piece is
// not something a spec can read off the DOM — the 3D layer draws it and the invisible box a click
// lands on does not move, deliberately — so what is asserted here is the shape of the table rather
// than the picture, and the properties that would break the board quietly if they went.
//
// Two of the gestures now CARRY the piece: they start on the cell it was standing on and end on
// the cell it took. That makes "ends at exactly 1" the load-bearing property for those, where for
// the other two it is still "ends at exactly 0" — a carried curve is a journey and the rest are
// amplitudes, and confusing the two would either leave a piece on the wrong cell or shove it off
// the one it is on.

const ALL_TYPES = Object.values(TYPES);
const CARRIED = [CHANNELS.CHARGE, CHANNELS.ADVANCE];
const SAMPLES = 200;

// Read at u = 0 and u = 1 exactly, plus every step between.
function sample(curve) {
	const values = [];

	for (let at = 0; at <= SAMPLES; at++) {
		values.push(curve(at / SAMPLES));
	}

	return values;
}

// How far each non-carried channel may go, in its own units. A carried channel has no ceiling: its
// distance is the distance the piece actually travelled, which is not a number anybody chooses.
const CEILING = {
	[CHANNELS.KICK]: 0.8,
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

test('a carried gesture starts where the piece stood and ends on the cell it took', () => {
	for (const type of ALL_TYPES) {
		const { channel, carry } = killMove(type);

		if (!CARRIED.includes(channel)) {
			expect(carry, `${type} is not carried but has a carry curve`).toBeUndefined();
			continue;
		}

		// 0 is the cell being left, 1 is the cell being taken. Both exactly: the game has already
		// moved the piece, so a curve that ended at 0.98 would leave it permanently short of the
		// cell it is standing on, and every kill after that would start from the wrong place.
		expect(carry(0), `${type} does not start where it stood`).toBeCloseTo(0, 9);
		expect(carry(1), `${type} does not land on the cell it took`).toBeCloseTo(1, 9);

		// And it must go PAST on the way, or nothing pierces anything.
		expect(Math.max(...sample(carry)), `${type} never drives through`).toBeGreaterThan(1);
	}
});

test('a non-carried gesture starts and ends at rest', () => {
	for (const type of ALL_TYPES) {
		const { channel, curve } = killMove(type);

		if (CARRIED.includes(channel)) {
			continue;
		}

		// What the curve returns is ADDED to the token's rest pose. A curve that ends anywhere but
		// zero leaves that piece shoved off its cell, or the wrong size, for the rest of the game
		// — and every later kill compounds it.
		expect(curve(0), `${type} does not start at rest`).toBeCloseTo(0, 9);
		expect(curve(1), `${type} does not end at rest`).toBeCloseTo(0, 9);

		const peak = Math.max(...sample(curve).map(Math.abs));

		// Peak-normalised, within a tenth of a percent either side, so `amount` is an amplitude
		// rather than a coefficient of whatever the expression happens to peak at. Not exactly one
		// because both the normalisation and this reading are sampled, on grids of different sizes.
		expect(peak, `${type} does not reach its amplitude`).toBeGreaterThan(0.999);
		expect(peak, `${type} overshoots its amplitude`).toBeLessThan(1.001);

		expect(killMove(type).amount, `${type} moves too far`).toBeLessThanOrEqual(CEILING[channel]);
		expect(killMove(type).amount, `${type} does not move at all`).toBeGreaterThan(0);
	}
});

test('a swing unwinds, so the piece ends up facing where the game says', () => {
	for (const type of ALL_TYPES) {
		const { swing } = killMove(type);

		if (!swing) {
			continue;
		}

		// The yaw is ADDED to the bearing. Anything but zero at the end and the piece is left
		// pointing somewhere the rules disagree with — and facing is a mechanic here, not a look.
		expect(swing.curve(0), `${type}'s swing does not start straight`).toBeCloseTo(0, 9);
		expect(swing.curve(1), `${type}'s swing does not unwind`).toBeCloseTo(0, 9);

		// It has to go both ways round, or it is a lean rather than a swing.
		const values = sample(swing.curve);

		expect(Math.max(...values), `${type} never swings one way`).toBeGreaterThan(0.5);
		expect(Math.min(...values), `${type} never swings the other`).toBeLessThan(-0.1);
		expect(swing.degrees).toBeGreaterThan(0);
		expect(swing.degrees, `${type} swings too far`).toBeLessThanOrEqual(25);
	}
});

test('every kill leaves a mark of its own', () => {
	const kinds = ALL_TYPES.map(type => {
		const move = killMove(type);
		const { effect } = move;

		expect(effect, `${type} leaves no mark`).toBeTruthy();
		expect(Object.values(EFFECTS), `${type} leaves an unknown mark`).toContain(effect.kind);
		expect(effect.glow, `${type} throws no light`).toBeGreaterThan(0);

		// A mark that outlived its gesture would still be burning while the piece stood still.
		expect(effect.seconds, `${type}'s mark outlasts its gesture`).toBeLessThanOrEqual(move.seconds);

		// A streak is the run, so only a piece that is carried anywhere may have one.
		if (effect.trail) {
			expect(CARRIED, `${type} trails without going anywhere`).toContain(move.channel);
		}

		return effect.kind;
	});

	expect(new Set(kinds).size).toBe(ALL_TYPES.length);
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
		expect(hold + seconds, `${type} takes too long`).toBeLessThanOrEqual(0.6);
	}
});

test('a carried gesture strikes about when it arrives', () => {
	for (const type of ALL_TYPES) {
		const { channel, carry, strike } = killMove(type);

		if (!CARRIED.includes(channel)) {
			continue;
		}

		// The point goes through as the piece gets there, so by the strike it has to have covered
		// most of the ground. Struck at a third of the way in, the victim would vanish while the
		// killer was still visibly a cell away from it.
		expect(carry(strike), `${type} strikes before it has arrived`).toBeGreaterThan(0.8);
	}
});

test('the marks come up at once and spend their lives fading', () => {
	// Shared by all of them, so asserted once. The blade and the burst have to start and end dark
	// for the same reason the gestures start and end at rest — the quad is simply left on screen
	// otherwise. Same for the streak, which additionally must be out before the blow lands.
	for (const [name, curve] of [
		['spark', sparkCurve],
		['trail', trailCurve],
	]) {
		expect(curve(0), `${name} does not start dark`).toBeCloseTo(0, 9);
		expect(curve(1), `${name} does not end dark`).toBeCloseTo(0, 9);
	}

	const values = sample(sparkCurve);
	const brightest = values.indexOf(Math.max(...values));

	// In the first quarter: a spark that peaked halfway through would read as a shape being shown
	// rather than as light arriving.
	expect(brightest / SAMPLES).toBeLessThan(0.25);

	// A burst is already the size of the thing that made it by the time it is seen, and only opens
	// from there. Starting at nothing would make it a dot that grows, which is a firework.
	expect(burstScale(0)).toBeGreaterThan(0.3);
	expect(burstScale(1)).toBeCloseTo(1, 6);
	expect(burstScale(0.5)).toBeGreaterThan(burstScale(0));
});
