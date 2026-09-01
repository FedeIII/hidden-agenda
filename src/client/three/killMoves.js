import { TYPES } from 'Domain/pieces/constants';

// What a piece does at the instant it takes another one off the board.
//
// A kill is the one moment a piece does something rather than merely being somewhere. The first
// version of this was a nudge per type — a few pixels in one channel each — and it was too quiet
// to read: correct, and invisible. These are gestures. They are still short, and none of them
// moves a piece as far as a neighbouring cell, but each one is meant to be seen from across a
// table rather than looked for.
//
// Three rules the table keeps, and each is the feature rather than decoration:
//
// - **The move is a function of the killer's TYPE and of nothing else.** Not the victim, not the
//   distance, not whose turn it is. That is what makes it worth learning: the gestures are seen
//   once, and afterwards a player knows which piece fired without looking away from where they
//   already were. Three of them can actually happen — see the CEO below, which cannot kill.
// - **A direction of its own, relative to its own bearing.** The agent drives FORWARD, the spy cuts
//   ACROSS, the sniper is thrown BACKWARD, and the CEO does not travel at all. Those are four
//   different things to see even before the marks are drawn, which is what keeps them apart at a
//   glance — where four amounts of one motion would only be four amounts of one motion.
// - **It is over quickly.** The slowest is the CEO at 0.6s and the quickest is the agent's charge
//   at 0.3s. A kill that outlasted the eye would be in the way of the next player's turn.
//
// No three.js import, for the same reason `layout.js` has none: this is a table of numbers, and
// the unit project has to read it without a renderer or a browser. Everything here is in the
// channel's own natural unit — token radii, or a fraction of the piece — and `token.js` is what
// knows what one of those is worth in the scene.

const { AGENT, CEO, SPY, SNIPER } = TYPES;

/**
 * How a piece moves. Each is measured along the piece's OWN bearing, so a move means the same
 * thing whichever way the piece happens to be facing.
 */
export const CHANNELS = {
	// Forward, past where it came to rest, in token radii.
	LUNGE: 'lunge',
	// Sideways, in token radii. Positive is to the piece's right.
	SWEEP: 'sweep',
	// Backward, in token radii.
	KICK: 'kick',
	// Bigger, as a fraction of itself.
	SWELL: 'swell',
};

/**
 * The mark drawn at the moment the blow lands. `PIERCE` and `SLASH` are a bright sliver laid over
 * the cell — long and thin along the bearing, or wide and thin across it. `FLASH` is a small hot
 * blob off the nose. `BLOOM` draws nothing and only lights the piece's own rim.
 */
export const EFFECTS = {
	PIERCE: 'pierce',
	SLASH: 'slash',
	FLASH: 'flash',
	BLOOM: 'bloom',
};

// Each curve runs over u in [0, 1] and MUST start and end at zero: what it returns is added to the
// token's rest pose, so a curve that ends anywhere else leaves that piece displaced, turned or
// resized for the rest of the game. Peak-normalised below rather than by hand, so `amount` reads
// as "how far, at most" and re-tuning a curve cannot quietly change how big the move is.
//
// `strike` is the fraction of the gesture at which the blow actually lands. Two things hang off
// it: the mark is drawn from that instant, and it is when the board lets the dead piece go. A
// corpse that left on the state change would already be gone by the time the agent arrived to run
// it through, which is the whole of what makes a charge read as a charge.
const MOVES = {
	// THE AGENT CHARGES, AND RUNS IT THROUGH. The agent kills by walking onto the cell and it is
	// the blunt instrument of the four — five per team, no special sight, no second move. So it
	// does not stop on arrival: it drives on past the cell's centre with a sliver of light running
	// out of its nose, then pulls back. Quick out and slower back, which is the difference between
	// a thrust and a wobble.
	[AGENT]: {
		channel: CHANNELS.LUNGE,
		seconds: 0.3,
		amount: 0.45,
		strike: 0.18,
		curve: u => Math.sin(Math.PI * u ** 0.4),
		effect: { kind: EFFECTS.PIERCE, seconds: 0.16, length: 2.3, width: 0.3, ahead: 0.6, glow: 0.6 },
	},

	// THE SPY WAITS, THEN CUTS. A spy walks a cell at a time and takes its target on the last step,
	// and nothing about it is meant to be loud — so it is the one gesture that begins with
	// stillness. It settles, holds for a sixth of a second while the table catches up, and only
	// then goes across in one stroke. The hold is the gesture; the stroke is just what ends it.
	[SPY]: {
		channel: CHANNELS.SWEEP,
		seconds: 0.34,
		hold: 0.16,
		amount: 0.4,
		strike: 0.25,
		curve: u => Math.sin(Math.PI * u ** 0.5),
		effect: { kind: EFFECTS.SLASH, seconds: 0.14, length: 0.26, width: 2.4, ahead: 0, glow: 0.6 },
	},

	// THE SNIPER IS THROWN BACKWARD. It is the only piece that kills something it is not standing
	// on, so it is the only one whose move is about the shot rather than about the arrival: the
	// flash comes off the nose in the first twentieth of a second, the piece is thrown back hard,
	// and then it takes the rest of the gesture to come forward again. This curve is at its peak a
	// sixteenth of the way in and spends everything after that returning, which is what a recoil
	// is — the difference between a rifle and a shove.
	[SNIPER]: {
		channel: CHANNELS.KICK,
		seconds: 0.42,
		amount: 0.32,
		strike: 0.06,
		curve: u => Math.sin(Math.PI * u ** 0.25),
		effect: { kind: EFFECTS.FLASH, seconds: 0.1, length: 0.8, width: 0.8, ahead: 1.05, glow: 2.4 },
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
	// and its rim would come up warm, over twice the agent's time. Six percent is a ceiling and
	// not a taste — `PROW_REACH` in assets.js is 0.84R, two noses meet at 1.68R against a 1.7321R
	// column pitch, and a nose swollen by six percent facing a settled one comes to 1.730R. Seven
	// percent puts them through each other.
	[CEO]: {
		channel: CHANNELS.SWELL,
		seconds: 0.6,
		amount: 0.06,
		strike: 0.3,
		curve: u => (1 - Math.cos(2 * Math.PI * u)) / 2,
		effect: { kind: EFFECTS.BLOOM, seconds: 0.4, glow: 1.1 },
	},
};

// How the mark comes and goes, shared by all of them: on almost at once, then most of its life
// spent fading. A spark that faded evenly reads as a shape being shown rather than as light.
export const sparkCurve = u => Math.sin(Math.PI * u ** 0.35);

// Four closed-form expressions sampled once at module load. Cheap, and it means the amounts above
// are the amplitudes rather than coefficients of whatever the curve happens to peak at.
const SAMPLES = 400;

function peakOf(curve) {
	let most = 0;

	for (let sample = 0; sample <= SAMPLES; sample++) {
		most = Math.max(most, Math.abs(curve(sample / SAMPLES)));
	}

	return most;
}

const normalised = Object.fromEntries(
	Object.entries(MOVES).map(([type, move]) => {
		const peak = peakOf(move.curve);

		return [type, { hold: 0, ...move, curve: u => move.curve(u) / peak }];
	}),
);

/**
 * How this type kills, or undefined if it has no move of its own.
 *
 * @param type one of `TYPES` — the KILLER's type, never the victim's.
 */
export default function killMove(type) {
	return normalised[type];
}
