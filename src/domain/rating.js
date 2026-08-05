// What a player's rating is, and what a game does to it.
//
// Pure, injectable, no I/O — the same reasoning as `deal.js`: the server owns every rating decision,
// and none of it should need a socket or a filesystem to be tested. Held in `domain` because it is a
// rule of the game rather than a fact about the server, and because `py.getPoints` — the score this
// reads — lives here too.
//
// The model is **Weng–Lin (2011), Bradley–Terry with full pairing**, not Elo. Two reasons, both about
// this game specifically:
//
//   - A game here is two to six players with a full ordering. Elo is a two-player formula, so it
//     could only ever be applied to a table by expanding it into pairs anyway — and once you are
//     doing that, the pairwise update may as well be one that carries an uncertainty.
//   - `dealAlignments` hands out the friend and foe cards at random, so a result is a noisy reading
//     of how well somebody played. A system that knows how sure it is about a player converges fast
//     while it is ignorant and slowly once it is not, which is what a hand-tuned Elo K-factor is
//     trying to approximate.
//
// Everything here returns new objects. Nothing takes a game state, and nothing mutates its input.

// ─── Who a rating belongs to ────────────────────────────────────────────────────────────────────

// A rating is keyed by an id the browser mints for itself (see `client/net/playerId.js`). The shape
// check is here, next to what the id is *for*, because both ends need it and neither may import the
// other's: the client refuses to store a malformed one, the server refuses to accept it. Same
// reasoning as `roomNames.js` holding the validation the lobby and the server both apply.
//
// Wide enough for a UUID and for the fallbacks the client uses on an insecure origin, narrow enough
// that the field cannot smuggle anything interesting.
const PLAYER_ID = /^[a-zA-Z0-9-]{8,64}$/;

export function isPlayerIdShaped(value) {
	return typeof value === 'string' && PLAYER_ID.test(value);
}

// ─── The scale ──────────────────────────────────────────────────────────────────────────────────

// Where a player starts: a skill estimate and how unsure we are of it. Weng–Lin's own defaults,
// which is worth keeping — every published constant below is expressed in terms of them.
export const SKILL = { mu: 25, sigma: 25 / 3 };

// How much of the difference between two players is luck on the day.
//
// Weng–Lin's own default is σ₀/2, and it is too confident for this game. A six-player table produces
// five pairwise results at once, but they are not five independent readings: everybody played the same
// board off the same deal, so one lucky pair of cards moves all five the same way. Raising β is the
// honest way to say that, because β *is* the outcome-noise term — the alternative, dividing each pair
// by N−1, would make the model underconfident about tables it genuinely did learn a lot from.
//
// Measured at 1.5σ₀, which is what this is: one 6-player win moves a new player 1000 → 1510 rather
// than → 1877, one 2-player win moves them → 1102, and a player who wins thirty still reaches 2313 —
// so the volatility comes off the first game without costing any of the separation that matters.
const BETA = 1.5 * SKILL.sigma;
// How much certainty a player loses between games, so that somebody who stops playing and comes back
// is not pinned to a two-year-old reading. Deliberately tiny: it is added once per rated game.
const TAU = SKILL.sigma / 100;
// A floor on how much of its variance one game may take, so σ cannot collapse to zero and freeze a
// player's rating for good.
const KAPPA = 1e-4;

// Skill is on a 0–50-ish scale that means nothing to anybody, so it is shown multiplied. 60 rather
// than any other number because μ₀ − σ₀ is exactly 50/3, which puts a new player on exactly 1000.
const MMR_SCALE = 60;

export function initialSkill() {
	return { ...SKILL };
}

/**
 * The number a player actually sees.
 *
 * Conservative on purpose — `μ − σ` rather than `μ` — and this is the same number the leaderboard
 * sorts by, which is the point of it: a player three games in is genuinely not known to be good, and
 * a rating that showed only μ would let one lucky evening sit at the top of the table. The
 * side-effect is a number that drifts upward as σ shrinks even on ordinary results: a player who wins
 * exactly half of thirty games ends around 1115 rather than back at 1000. That reads as the game
 * getting to know you, which is what is happening.
 */
export function toMmr({ mu, sigma } = SKILL) {
	return Math.max(0, Math.round(MMR_SCALE * (mu - sigma)));
}

// ─── Rating a result ────────────────────────────────────────────────────────────────────────────

// Lower place is better. Equal places are a draw, which is a real outcome here: `py.getPoints` can
// tie two players exactly.
function outcome(myPlace, theirPlace) {
	if (myPlace === theirPlace) {
		return 0.5;
	}

	return myPlace < theirPlace ? 1 : 0;
}

// The chance the first player beats the second, given how unsure we are about both. Written as a
// logistic of the difference rather than as the ratio of two exponentials it is algebraically equal
// to: the ratio form overflows for extreme μ, and this one cannot.
function probability(myMu, theirMu, c) {
	return 1 / (1 + Math.exp((theirMu - myMu) / c));
}

// Uncertainty grows between games, and it has to grow for *everyone* before any pair is looked at —
// otherwise the result would depend on which player the loop happened to reach first.
function withDynamics(entries) {
	return entries.map(entry => ({
		...entry,
		variance: entry.sigma * entry.sigma + TAU * TAU,
	}));
}

/**
 * Rates one result.
 *
 * `entries` is `[{ id, place, mu, sigma }]`. Returns `{ [id]: { mu, sigma } }` for the players it
 * updated — never a mutated input.
 *
 * Two knobs, and between them they express every rule this game has about ratings:
 *
 *   - `pairWeight(selfId, otherId)` scales what one opponent is worth. It is asked per direction
 *     rather than per pair, so the two halves of a pairing can be worth different amounts — which is
 *     what "a full loss for the player who walked out, half a win for the one left behind" needs. It
 *     damps the *confidence* gain as well as the movement, which is the right shape: a game that
 *     should not move your rating much should not teach us much about you either.
 *   - `only` restricts which ids are written back. Absent, everybody in `entries` is rated.
 *
 * Note that nothing here is zero-sum, and that is a property of the model rather than an oversight —
 * each player's update is computed from their own perspective, so all of a table can lose rating at
 * once. A game everybody abandoned should do exactly that.
 */
export function rate({ entries, pairWeight = () => 1, only = null }) {
	const inflated = withDynamics(entries);
	const rated = {};

	inflated.forEach(self => {
		if (only && !only.includes(self.id)) {
			return;
		}

		let omega = 0;
		let delta = 0;

		inflated.forEach(other => {
			if (other.id === self.id) {
				return;
			}

			const weight = pairWeight(self.id, other.id);

			if (!weight) {
				return;
			}

			const c = Math.sqrt(self.variance + other.variance + 2 * BETA * BETA);
			const p = probability(self.mu, other.mu, c);
			const gamma = Math.sqrt(self.variance) / c;

			omega += weight * (self.variance / c) * (outcome(self.place, other.place) - p);
			delta += weight * gamma * (self.variance / (c * c)) * p * (1 - p);
		});

		rated[self.id] = {
			mu: self.mu + omega,
			sigma: Math.sqrt(self.variance * Math.max(1 - delta, KAPPA)),
		};
	});

	return rated;
}

// ─── What a departure is worth ──────────────────────────────────────────────────────────────────

// What the last player standing gets when somebody else's exit ends the game under them. Half,
// because they did not win — the game was taken away from them, and the table they would have had to
// beat is not the table that was there.
export const STRANDED_WEIGHT = 0.5;

const LEFT = 2;
const STAYED = 1;

/**
 * Rates somebody walking out of a game in progress, or being swept out of one they abandoned.
 *
 * The leaver is placed last against everybody still seated, at full weight. Nobody else is touched —
 * they are still playing, and the game will rate them properly when it ends — *except* the one case
 * where the departure leaves a single player who now has nothing to play: that survivor gets a
 * softened win, and `rooms.leave` is what decides they were stranded.
 *
 * `pairWeight` is threaded through rather than defaulted away because without it this is the cheapest
 * farm in the system: two browsers alone in a room, one quits, the other collects, repeat.
 */
export function rateDeparture({ leaver, others, strandedId = null, pairWeight = () => 1 }) {
	const entries = [{ ...leaver, place: LEFT }, ...others.map(other => ({ ...other, place: STAYED }))];

	return rate({
		entries,
		only: strandedId ? [leaver.id, strandedId] : [leaver.id],
		pairWeight: (selfId, otherId) =>
			selfId === leaver.id ? pairWeight(selfId, otherId) : STRANDED_WEIGHT * pairWeight(selfId, otherId),
	});
}

// ─── Playing the same person over and over ──────────────────────────────────────────────────────

// How many recent meetings halve what a pairing is worth. Harmonic rather than geometric on purpose:
// the fifth game against your regular opponent should still count for something, and the fiftieth
// should barely count — whereas a decay of the form `rate^n` reaches "nothing at all" quickly enough
// that a group of friends who only play each other would stop having ratings.
const SOFTENING_HALF_LIFE = 3;

// How far back meetings are counted. A week, so that a rating is soft against the people you played
// yesterday and firm again against the people you played last month.
export const PAIR_WINDOW_MS = 7 * 24 * 60 * 60_000;

/**
 * What a pairing is worth given how many times these two have already met inside the window.
 *
 * 1 for a first meeting, ½ at three, ¼ at nine. This is the whole anti-farming story, and it is
 * deliberately the only one: it needs nothing about where a player connected from, so no address is
 * ever stored, hashed or compared.
 */
export function pairSoftening(meetings = 0) {
	return 1 / (1 + Math.max(0, meetings) / SOFTENING_HALF_LIFE);
}

// ─── Walking out repeatedly ─────────────────────────────────────────────────────────────────────

// The first quit costs half a minute, and each one after it doubles. Eight levels, so the worst it
// reaches is a little over an hour: long enough that quitting out of eight games in a day stops
// being worth it, short enough that it is never a ban.
const QUIT_BASE_MS = 30_000;
const MAX_QUIT_LEVEL = 8;
// One level comes off per day since the last quit, so a bad evening is forgiven by the weekend
// without anybody having to forgive it.
const QUIT_DECAY_MS = 24 * 60 * 60_000;

/**
 * The level a player is on after quitting again, given the level they were on and how long ago that
 * was. Derived rather than stored: folding the log's quit events through this reproduces it exactly,
 * which is what keeps the ladder replayable when its constants change.
 */
export function nextQuitLevel(previousLevel = 0, msSincePreviousQuit = Infinity) {
	const decayed = Math.max(0, previousLevel - Math.floor(msSincePreviousQuit / QUIT_DECAY_MS));

	return Math.min(MAX_QUIT_LEVEL, decayed + 1);
}

/** How long a player sits out after the quit that put them on this level. */
export function quitCooldownMs(level = 0) {
	if (level < 1) {
		return 0;
	}

	return QUIT_BASE_MS * 2 ** (Math.min(MAX_QUIT_LEVEL, level) - 1);
}

export default {
	SKILL,
	STRANDED_WEIGHT,
	PAIR_WINDOW_MS,
	isPlayerIdShaped,
	initialSkill,
	toMmr,
	rate,
	rateDeparture,
	pairSoftening,
	nextQuitLevel,
	quitCooldownMs,
};
