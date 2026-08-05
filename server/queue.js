import { MIN_PLAYERS, MAX_PLAYERS } from 'Domain/py';

// Automatch: the queue, and the one decision it makes — who is at the next table.
//
// No sockets are touched here and nothing is persisted, which is what lets the whole of it be tested
// without a server. Entries carry an opaque `client` that this module never looks at; index.js puts the
// socket there. (A room may not hold a socket because a room is written to disk — a queue entry lives
// for at most a minute and is never saved, so the same rule does not apply.)

// A table of four is the game at its best, so the queue holds out for one. Below that it settles.
export const PREFERRED_SIZE = 4;

// How far apart two ratings may be, and how fast that opens up. Somebody who has been waiting a minute
// would rather play the wrong table than no table, so past that the window is simply open.
export const WINDOW_BASE = 150;
export const WINDOW_STEP = 100;
export const WINDOW_EVERY_MS = 10_000;
export const WINDOW_OPEN_AFTER_MS = 60_000;

// How long the longest-waiting player holds out for a fourth before accepting a smaller table.
//
// Overridable by the environment, the same shape as `HA_SKIN` and `HA_JOINS_PER_MINUTE` and for the same
// reason: **do not lower the default, override it where it needs to be lower.** Fifteen seconds is right
// for a real table and hopeless for a browser spec — two contexts held open for the whole of it is enough
// extra parallel load to make unrelated specs start failing on unstable clicks, which is exactly how this
// override came to exist.
export const HOLD_MS = Number(process.env.HA_MATCH_HOLD_MS) || 15_000;

export function createMatchQueue({ now = () => Date.now() } = {}) {
	const waiting = new Map();

	// How wide a net this entry has earned. Null rather than Infinity once it is open, because this
	// number goes out on the wire and JSON has no infinity — it would arrive as null anyway, and a
	// client reading it should not have to know that.
	function windowFor(entry, at = now()) {
		const waited = at - entry.at;

		if (waited >= WINDOW_OPEN_AFTER_MS) {
			return null;
		}

		return WINDOW_BASE + WINDOW_STEP * Math.floor(waited / WINDOW_EVERY_MS);
	}

	// Two reasons a candidate cannot sit at a table somebody is already at, and they are different
	// reasons. The same browser twice would be a player matched against themselves — the cheapest way
	// to farm a rating there is. The same *name* twice is simply a seat the room would refuse:
	// `addSeat` enforces unique names, so a group with a clash could not be seated at all.
	function canJoin(group, candidate) {
		return !group.some(
			member => (member.playerId && member.playerId === candidate.playerId) || member.name === candidate.name,
		);
	}

	/**
	 * Adds somebody to the queue, and returns the entry plus anybody it displaced.
	 *
	 * A browser queueing twice — two tabs — replaces its own earlier entry rather than joining itself.
	 * The displaced entries come back, carrying their clients, so the caller can tell those sockets they
	 * have stopped searching instead of leaving them on a spinner forever.
	 */
	function add({ key, playerId = null, name, mmr, client = null }) {
		const displaced = playerId
			? [...waiting.values()].filter(entry => entry.playerId === playerId && entry.key !== key)
			: [];

		displaced.forEach(stale => waiting.delete(stale.key));
		waiting.set(key, { key, playerId, name, mmr, client, at: now() });

		return { entry: waiting.get(key), displaced };
	}

	function remove(key) {
		return waiting.delete(key);
	}

	function has(key) {
		return waiting.has(key);
	}

	/**
	 * The next table, or null if there is not one worth making yet.
	 *
	 * Anchored on whoever has waited longest rather than on the tightest cluster in the queue, which is
	 * a fairness decision: it means the person who has been waiting the longest is in the *next* match,
	 * always, instead of being passed over indefinitely by a well-matched pair who arrived after them.
	 */
	function formMatch() {
		if (waiting.size < MIN_PLAYERS) {
			return null;
		}

		const at = now();
		const queue = [...waiting.values()];
		const anchor = queue.reduce((oldest, entry) => (entry.at < oldest.at ? entry : oldest));
		const window = windowFor(anchor, at);
		const group = [anchor];

		queue
			.filter(entry => entry.key !== anchor.key && (window === null || Math.abs(entry.mmr - anchor.mmr) <= window))
			// Closest rating first, and a longer wait breaks a tie. The point is a good table; after that
			// it is a queue.
			.sort(
				(first, second) => Math.abs(first.mmr - anchor.mmr) - Math.abs(second.mmr - anchor.mmr) || first.at - second.at,
			)
			.forEach(entry => {
				if (group.length < MAX_PLAYERS && canJoin(group, entry)) {
					group.push(entry);
				}
			});

		if (group.length < MIN_PLAYERS) {
			return null;
		}

		// Either the table is worth having, or the anchor has waited long enough that a smaller one beats
		// carrying on waiting.
		const ready = group.length >= PREFERRED_SIZE || at - anchor.at >= HOLD_MS;

		return ready ? group : null;
	}

	/** Takes a formed match out of the queue. Separate from `formMatch` so a caller can decide not to. */
	function claim(group) {
		group.forEach(entry => waiting.delete(entry.key));
	}

	/** What one waiting client is told about its own search. Null once it is no longer in the queue. */
	function describe(key) {
		const entry = waiting.get(key);

		if (!entry) {
			return null;
		}

		const at = now();

		// `mmr` is the searcher's own rating, and this frame is the only place an unseated client learns
		// it — the finder's `rooms` frame is one encoding shared by every watcher, so it cannot carry
		// anything about whoever is reading it. Which is fine: searching is when a player wants to know.
		return {
			searching: true,
			waiting: waiting.size,
			elapsed: at - entry.at,
			window: windowFor(entry, at),
			mmr: entry.mmr,
		};
	}

	return {
		add,
		remove,
		has,
		formMatch,
		claim,
		describe,

		entries() {
			return [...waiting.values()];
		},

		get size() {
			return waiting.size;
		},
	};
}

export default createMatchQueue;
