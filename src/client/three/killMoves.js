import { TYPES } from 'Domain/pieces/constants';

// What a piece does at the instant it takes another one off the board.
//
// A kill is the one moment a piece does something rather than merely being somewhere, and until
// now it was the quietest thing on the table: the victim's token stopped existing and the killer
// carried on as if it had walked onto an empty cell. These give each type a mark of its own.
//
// Two rules the table has to keep, and both of them are the feature rather than decoration:
//
// - **The move is a function of the killer's TYPE and of nothing else.** Not the victim, not the
//   distance, not whose turn it is. That is what makes it readable: a player learns four moves
//   once and then knows which piece just fired without looking away from where they were looking.
// - **It is small.** The board already says everything that matters with light and with one lift;
//   a kill that threw a token about would be the loudest thing in a game whose whole subject is
//   what people are not saying. The ceiling is asserted in `unit/killMoves.test.js`.
//
// No three.js import, for the same reason `layout.js` has none: this is a table of numbers, and
// the unit project has to be able to read it without a renderer or a browser. Amounts are in each
// channel's own natural unit — token heights, degrees, token radii, a fraction — and `token.js`
// is what knows the scene value of one of those.

const { AGENT, CEO, SPY, SNIPER } = TYPES;

/**
 * One channel each, which is the whole of why four moves this small stay tellable apart. Height,
 * yaw, ground plane and size are four different things to see, so no two of these can be mistaken
 * for one another — where four variations on one channel would only be four amounts of the same
 * move, and at these amplitudes that is no distinction at all.
 */
export const CHANNELS = {
	// Down into the tile, in token heights.
	SINK: 'sink',
	// Off its bearing and back, in degrees.
	TWIST: 'twist',
	// Backwards along its own bearing, in token radii.
	KICK: 'kick',
	// Bigger, as a fraction of itself.
	SWELL: 'swell',
};

// Each curve runs over u in [0, 1] and MUST start and end at zero: what it returns is added to the
// token's rest pose, so a curve that ends anywhere else leaves that piece displaced, turned or
// resized for the rest of the game. Peak-normalised below rather than by hand, so `amount` reads
// as "how far, at most" and re-tuning a curve cannot quietly change how big the move is.
const MOVES = {
	// THE AGENT PUTS ITS WEIGHT ON IT. The agent kills by walking onto the cell, and it is the
	// blunt instrument of the four — five of them per team, no special sight, no second move. So
	// it lands: a press down into the tile and one rebound about half as big, damped, over.
	[AGENT]: {
		channel: CHANNELS.SINK,
		seconds: 0.34,
		amount: 0.26,
		curve: u => -Math.sin(2 * Math.PI * u ** 0.8) * (1 - u) ** 0.6,
	},

	// THE SPY TURNS AWAY. A spy walks a cell at a time and takes its target on the last step, and
	// nothing about it is meant to be loud. So it does not press and it does not travel: it slips
	// a few degrees off its bearing and comes back to it. A turn of the wrist, and no more.
	[SPY]: {
		channel: CHANNELS.TWIST,
		seconds: 0.44,
		amount: 9,
		curve: u => Math.sin(Math.PI * u ** 0.7),
	},

	// THE SNIPER KICKS. It is the only piece that kills something it is not standing on, so it is
	// the only one whose move can be about the shot rather than about the arrival: a hard recoil
	// straight back along its own line, then a long settle forward. The asymmetry is the read —
	// this curve is at its peak a seventh of the way in and spends the rest of the time returning.
	[SNIPER]: {
		channel: CHANNELS.KICK,
		seconds: 0.4,
		amount: 0.1,
		curve: u => Math.sin(Math.PI * u ** 0.35),
	},

	// THE CEO SWELLS. Killing a CEO takes that team's whole undeployed half of the board with it,
	// and three of them end the game — so the CEO is the one piece whose kills are worth more than
	// the piece it killed. It answers with presence rather than with effort: no press, no recoil,
	// just a few percent bigger and slowly back, over twice the agent's time.
	//
	// Four and a half percent is also about as far as this can go before it argues with the board.
	// `PROW_REACH` in assets.js is 0.84R and two noses meet at 1.68R against a 1.7321R column
	// pitch: a swollen nose facing a settled one comes to 1.718R, which is clear and only just.
	// Only the killer ever swells, so two swollen noses is not a case.
	[CEO]: {
		channel: CHANNELS.SWELL,
		seconds: 0.62,
		amount: 0.045,
		curve: u => (1 - Math.cos(2 * Math.PI * u)) / 2,
	},
};

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

		return [type, { ...move, curve: u => move.curve(u) / peak }];
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
