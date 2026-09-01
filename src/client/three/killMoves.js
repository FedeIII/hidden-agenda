import { TYPES } from 'Domain/pieces/constants';

// What a piece does at the instant it takes another one off the board.
//
// A kill is the one moment a piece does something rather than merely being somewhere. This is the
// third attempt at it. The first was a nudge per type, a few pixels in one channel each, which was
// correct and invisible. The second added marks and made the nudges gestures, but the gesture still
// happened *after* the piece had arrived — so an agent crossed the cell at walking pace and then
// twitched. These carry the piece: the gesture IS the arrival, it starts where the piece was
// standing, and it ends exactly on the cell it took.
//
// Four rules the table keeps, and each is the feature rather than decoration:
//
// - **The move is a function of the killer's TYPE and of nothing else.** Not the victim, not the
//   distance, not whose turn it is. That is what makes it worth learning: the gestures are seen
//   once, and afterwards a player knows which piece fired without looking away from where they
//   already were. Three of them can actually happen — see the CEO below, which cannot kill.
// - **A carried gesture starts at 0 and ends at exactly 1.** 0 is where the piece stood before the
//   move; 1 is the cell it is taking. In between it may drive straight through — that is what the
//   overshoot is for — but it lands on the cell, because that is where the game says it is.
// - **The blow lands partway through, and the board hangs the corpse on it.** `strike` is when the
//   point is through, which for a carried gesture is roughly when it has arrived. A corpse released
//   any earlier would be gone before the piece got there.
// - **It is over quickly.** The longest is 0.5s including the spy's hold. A kill that outlasted the
//   eye would be in the way of the next player's turn.
//
// No three.js import, for the same reason `layout.js` has none: this is a table of numbers, and
// the unit project has to read it without a renderer or a browser. Lengths are in token radii and
// angles in degrees, and `token.js` is what knows what one of those is worth in the scene.

const { AGENT, CEO, SPY, SNIPER } = TYPES;

export const CHANNELS = {
	// Carried, straight through: the agent's charge.
	CHARGE: 'charge',
	// Carried, cutting from side to side on the way in: the spy's approach.
	ADVANCE: 'advance',
	// Not carried. Thrown backward along its own bearing, in token radii.
	KICK: 'kick',
	// Not carried. Bigger, as a fraction of itself.
	SWELL: 'swell',
};

/**
 * The mark left at the moment the blow lands. Each is drawn from up to three flat additive quads
 * and a flare on the piece's own rim — a `blade` along or across the bearing, a `burst` that
 * expands where the blow lands, and a `trail` streaming out behind a piece that is being carried.
 * `BLOOM` draws none of them and is the rim alone.
 */
export const EFFECTS = {
	PIERCE: 'pierce',
	SLASH: 'slash',
	FLASH: 'flash',
	BLOOM: 'bloom',
};

/**
 * An ease that drives past where it is going and settles back onto it.
 *
 * This is the whole of the agent's charge and most of the spy's, and it is one function because
 * the two halves are one motion: a piece that accelerated in, stopped dead on the cell and then
 * pushed forward again would be two gestures, and would read as a bump rather than as a thrust.
 * Starts at exactly 0 and ends at exactly 1 whatever `back` is; `back` only decides how far past
 * 1 it goes on the way, and therefore how much of the piece comes out of the other side.
 */
function drivingThrough(back) {
	const c3 = back + 1;

	return u => 1 + c3 * (u - 1) ** 3 + back * (u - 1) ** 2;
}

/**
 * A yaw that swings one way, then the other, and unwinds to nothing.
 *
 * `cycles` is in whole swings, and has to be a multiple of a half so the piece ends up facing the
 * way the game says it is facing. The decay is what stops it looking like a metronome.
 */
function swinging(cycles, decay) {
	return u => Math.sin(2 * Math.PI * cycles * u) * (1 - u) ** decay;
}

// Every non-carried curve, and every swing, MUST start and end at zero: what they return is added
// to the token's rest pose, so anything else leaves the piece shoved off its cell or turned off
// its bearing for the rest of the game. Peak-normalised below, so an `amount` is an amplitude
// rather than a coefficient of whatever the expression happens to peak at. Carried curves are
// deliberately NOT normalised — they have to land on 1, not on their own maximum.
const MOVES = {
	// THE AGENT CHARGES, AND COMES OUT THE OTHER SIDE. It kills by walking onto the cell and it is
	// the blunt instrument of the four — five per team, no special sight, no second move. So the
	// walk becomes a run: it leaves the cell it was on, drives about eighteen percent of the way
	// past the one it is taking with a spike of light running out of its nose, and settles back
	// onto it. The streak behind it is the run; the burst is the moment the point is through.
	[AGENT]: {
		channel: CHANNELS.CHARGE,
		seconds: 0.34,
		strike: 0.6,
		carry: drivingThrough(2.4),
		effect: {
			kind: EFFECTS.PIERCE,
			seconds: 0.22,
			glow: 1.1,
			blade: { length: 2.4, width: 0.34, ahead: 0.9 },
			burst: { size: 2.2, ahead: 0.3 },
			trail: { length: 2.4, width: 0.55 },
		},
	},

	// THE SPY WAITS, THEN CUTS ITS WAY IN. A spy walks a cell at a time and takes its target on the
	// last step, and nothing about it is meant to be loud — so it is the one gesture that begins
	// with stillness. It settles, holds for a sixth of a second while the table catches up, and
	// then goes in cutting: three strokes of the blade, right and left and right, unwinding as it
	// arrives. It barely overshoots. A spy does not need to be on the other side of anything.
	[SPY]: {
		channel: CHANNELS.ADVANCE,
		seconds: 0.36,
		hold: 0.16,
		strike: 0.62,
		carry: drivingThrough(1.2),
		swing: { degrees: 17, curve: swinging(1.5, 0.35) },
		effect: {
			kind: EFFECTS.SLASH,
			seconds: 0.2,
			glow: 1,
			blade: { length: 0.3, width: 3, ahead: 0.1 },
			burst: { size: 1.8, ahead: 0.2 },
			trail: { length: 2, width: 0.5 },
		},
	},

	// THE SNIPER IS THROWN. It is the only piece that kills something it is not standing on, so it
	// is the only one whose gesture is about the shot rather than about the arrival — and the only
	// one that does not travel, because it never leaves its cell. The flash is off the nose inside
	// a twentieth of a second, the piece is thrown back more than half its own radius, the barrel
	// jumps once, and then it takes the rest of the gesture to come forward again. This curve is at
	// its peak a fortieth of the way in and spends everything after that returning, which is what
	// separates a rifle from a shove.
	[SNIPER]: {
		channel: CHANNELS.KICK,
		seconds: 0.46,
		strike: 0.04,
		amount: 0.55,
		curve: u => Math.sin(Math.PI * u ** 0.18),
		swing: { degrees: 9, curve: swinging(1, 1.2) },
		effect: {
			kind: EFFECTS.FLASH,
			seconds: 0.13,
			glow: 3.6,
			blade: { length: 1.7, width: 0.55, ahead: 1.25 },
			burst: { size: 3, ahead: 1.15 },
		},
	},

	// THE CEO SIMPLY ARRIVES — and, as the rules stand, never does.
	//
	// **A CEO cannot kill.** `getCeoPositions` in pz.js builds its destinations with
	// `getFreeCells`, which stops at the first occupied cell and never includes it, so a CEO is
	// blocked by every piece and can never land on one. `ceo.test.js`'s "is blocked by any piece"
	// asserts exactly that, for enemies as much as for friends, and the README's roadmap lists the
	// capture mechanic for the agent, the spy and the sniper only. Nothing in the game writes a
	// CEO's id into a victim's `killedById`: a dead CEO's `killedById` names whoever killed IT.
	//
	// So this entry has never been seen in a game and will not be until the rules change. It is
	// here because the table is meant to be total over TYPES — `killMove` returning undefined is a
	// piece with no gesture, which is a thing the board then has to have an opinion about — and
	// because the day a CEO is given a capture, there is nothing to add here. Do not tune it by
	// eye; there is nothing to look at.
	//
	// Were it reachable: presence rather than effort. It would not travel at all, it would swell
	// and its rim would come up warm. Six percent is a ceiling and not a taste — `PROW_REACH` in
	// assets.js is 0.84R, two noses meet at 1.68R against a 1.7321R column pitch, and a nose
	// swollen by six percent facing a settled one comes to 1.730R. Seven percent puts them through
	// each other.
	[CEO]: {
		channel: CHANNELS.SWELL,
		seconds: 0.5,
		strike: 0.3,
		amount: 0.06,
		curve: u => (1 - Math.cos(2 * Math.PI * u)) / 2,
		effect: { kind: EFFECTS.BLOOM, seconds: 0.4, glow: 1.1 },
	},
};

// How a mark comes and goes: on almost at once, then most of its life spent fading. A spark that
// faded evenly reads as a shape being shown rather than as light arriving.
export const sparkCurve = u => Math.sin(Math.PI * u ** 0.35);

// A burst is the same light on a shape that is still opening, so it is drawn from four tenths of
// its size outwards. Starting at nothing would make it a dot that grows, which is a firework; a
// burst is already the size of the thing that made it by the time you see it.
export const burstScale = u => 0.4 + 0.6 * u ** 0.5;

// A trail belongs to the run rather than to the blow, so it has its own window — up and gone
// across the approach, brightest halfway in, over by the time the point lands.
export const trailCurve = u => Math.sin(Math.PI * u) ** 1.3;

// Sampled once at module load. Cheap, and it means the amounts above are amplitudes.
const SAMPLES = 400;

function peakOf(curve) {
	let most = 0;

	for (let sample = 0; sample <= SAMPLES; sample++) {
		most = Math.max(most, Math.abs(curve(sample / SAMPLES)));
	}

	return most;
}

function normalise(curve) {
	const peak = peakOf(curve);

	return u => curve(u) / peak;
}

const normalised = Object.fromEntries(
	Object.entries(MOVES).map(([type, move]) => [
		type,
		{
			hold: 0,
			...move,
			// Carried curves are left alone: they are not amplitudes, they are journeys, and they
			// have to arrive at 1.
			...(move.curve ? { curve: normalise(move.curve) } : {}),
			...(move.swing ? { swing: { ...move.swing, curve: normalise(move.swing.curve) } } : {}),
		},
	]),
);

/**
 * How this type kills, or undefined if it has no move of its own.
 *
 * @param type one of `TYPES` — the KILLER's type, never the victim's.
 */
export default function killMove(type) {
	return normalised[type];
}
