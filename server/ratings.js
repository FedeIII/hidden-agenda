import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	PAIR_WINDOW_MS,
	initialSkill,
	nextQuitLevel,
	pairSoftening,
	quitCooldownMs,
	rate,
	rateDeparture,
	toMmr,
} from 'Domain/rating';

// Where ratings live, and the one property the whole design turns on: **the log is the truth and a
// rating is derived from it.** Every finished game and every walk-out is appended as a line, and the
// numbers players see are the result of folding those lines through `domain/rating.js` at boot.
//
// That is what makes the constants in `domain/rating.js` changeable. None of them — β, the softening
// half-life, the cooldown ladder — is known to be right yet, and with only current ratings on disk,
// finding out would mean throwing everybody's away. Here, retuning is `rebuild()`.
//
// Best-effort, exactly like `persistence.js`: a laptop cannot write to /var/lib, and a game that
// cannot be recorded is still a perfectly good game. Failing to save must never take the server down.

// **Its own directory, and not HA_STATE_DIR.** `persistence.loadAll()` reads every *.json in the room
// directory and maps `room.seats` inside its outer try — so one foreign file there throws, the catch
// returns an empty list, and every game in progress is silently dropped on the next restart. This
// file would have been that foreign file.
export const DEFAULT_RATINGS_DIR = '/var/lib/hidden-agenda/ratings';

export const LOG_NAME = 'games.jsonl';

// The two things worth writing down. A game that never finished is not one of them: it is unrated,
// and the walk-outs that ended it are recorded as themselves.
export const EVENTS = { GAME: 'game', QUIT: 'quit' };

export function createRatings({
	dir = process.env.HA_RATINGS_DIR || DEFAULT_RATINGS_DIR,
	now = () => Date.now(),
	log = () => {},
} = {}) {
	let enabled = true;

	try {
		mkdirSync(dir, { recursive: true });
	} catch (error) {
		enabled = false;
		log(`ratings disabled (${dir}: ${error.code || error.message})`);
	}

	const file = join(dir, LOG_NAME);
	// Everything below is derived from the log. Nothing here is authoritative.
	const players = new Map();
	const meetings = new Map();
	let events = 0;

	// Reading a player must not invent one. `mmrsFor` is called for every seat of every room frame and
	// every row of the finder, most of them ids that have never finished a game — and an unrated
	// browser is on the starting rating by definition, so it needs no entry to say so.
	function peek(id) {
		return players.get(id) || { id, name: null, ...initialSkill(), games: 0, quits: 0, level: 0, quitAt: 0, seenAt: 0 };
	}

	function playerFor(id) {
		const existing = players.get(id);

		if (existing) {
			return existing;
		}

		const created = { ...peek(id) };

		players.set(id, created);

		return created;
	}

	function pairKey(a, b) {
		return a < b ? `${a}|${b}` : `${b}|${a}`;
	}

	function meetingsBetween(a, b, at) {
		const times = meetings.get(pairKey(a, b));

		return times ? times.filter(time => at - time < PAIR_WINDOW_MS).length : 0;
	}

	// The softening reads only the meetings recorded *before* the event being applied, which is what
	// makes a replay of the log produce the numbers the live server produced. Note the corollary: the
	// order of the lines is load-bearing, so nothing may ever rewrite the log out of order.
	function weightAt(at) {
		return (selfId, otherId) => pairSoftening(meetingsBetween(selfId, otherId, at));
	}

	function noteMeeting(a, b, at) {
		const key = pairKey(a, b);
		// Pruned as it is written rather than swept: the window is the only reason these are kept, and a
		// pair that stops playing stops costing anything.
		const times = (meetings.get(key) || []).filter(time => at - time < PAIR_WINDOW_MS);

		times.push(at);
		meetings.set(key, times);
	}

	function skillOf(id) {
		const { mu, sigma } = playerFor(id);

		return { id, mu, sigma };
	}

	function absorb(rated) {
		Object.entries(rated).forEach(([id, { mu, sigma }]) => {
			Object.assign(playerFor(id), { mu, sigma });
		});
	}

	// The last name a player was seated under, kept so a leaderboard has something to print. Not an
	// identity: names are neither unique nor stable, the id is.
	function remember(id, name, at) {
		const player = playerFor(id);

		player.name = name || player.name;
		player.seenAt = at;
	}

	function applyGame({ at, players: finishers }) {
		absorb(rate({ entries: finishers.map(({ id, place }) => ({ ...skillOf(id), place })), pairWeight: weightAt(at) }));

		finishers.forEach(({ id, name }) => {
			remember(id, name, at);
			playerFor(id).games += 1;
		});

		// After rating, never before — `weightAt` counts what happened before this game.
		finishers.forEach(({ id }, index) => finishers.slice(index + 1).forEach(other => noteMeeting(id, other.id, at)));
	}

	// `others` are the seats still at the table, as `{ id, name }` rather than bare ids. The name is
	// carried because one of them may be the stranded player, and the frame that tells them what they
	// just gained has to be able to say who they are — the leaver's name is not enough.
	function applyQuit({ at, id, name, others = [], stranded = null }) {
		absorb(
			rateDeparture({
				leaver: skillOf(id),
				others: others.map(other => skillOf(other.id)),
				strandedId: stranded,
				pairWeight: weightAt(at),
			}),
		);

		others.forEach(other => remember(other.id, other.name, at));

		const player = playerFor(id);

		// Read the old level and the old timestamp before either is overwritten: the ladder is "one
		// level up from wherever the decay has left you", so both halves are needed at once.
		player.level = nextQuitLevel(player.level, at - player.quitAt);
		player.quits += 1;
		player.quitAt = at;
		remember(id, name, at);

		// A walk-out counts as a meeting, or feeding somebody the stranded bonus would never soften.
		others.forEach(other => noteMeeting(id, other.id, at));
	}

	// One entry point for both replay and live recording, which is the only reason a restart is
	// guaranteed to agree with the server that wrote the file.
	function apply(event) {
		if (event.t === EVENTS.GAME) {
			return applyGame(event);
		}

		if (event.t === EVENTS.QUIT) {
			return applyQuit(event);
		}

		// A line from a newer build than this one. Counted, ignored, and not an error: rolling back the
		// bundle must not make the history unreadable.
		return undefined;
	}

	function load() {
		if (!enabled) {
			return;
		}

		let contents;

		try {
			contents = readFileSync(file, 'utf8');
		} catch (error) {
			if (error.code !== 'ENOENT') {
				log(`could not read ${LOG_NAME}: ${error.message}`);
			}

			return;
		}

		let skipped = 0;

		contents.split('\n').forEach(line => {
			if (!line.trim()) {
				return;
			}

			try {
				apply(JSON.parse(line));
				events += 1;
			} catch {
				// Almost always the last line of a file that was being appended to when the process
				// went away. One lost game, and the rest of the history is intact.
				skipped += 1;
			}
		});

		if (skipped) {
			log(`skipped ${skipped} unreadable line(s) in ${LOG_NAME}`);
		}

		if (events) {
			log(`replayed ${events} rated event(s) for ${players.size} player(s)`);
		}
	}

	function mmrFor(id) {
		return toMmr(peek(id));
	}

	function mmrsFor(ids = []) {
		return ids.reduce((all, id) => (id ? { ...all, [id]: mmrFor(id) } : all), {});
	}

	// What the player is shown after a game: where they were, where they are, and the difference.
	// Built here because only this module knows the before.
	function movementOf(ids, before) {
		return ids.map(id => ({
			id,
			name: peek(id).name,
			before: before[id],
			after: mmrFor(id),
			delta: mmrFor(id) - before[id],
		}));
	}

	function record(event, ids) {
		const before = mmrsFor(ids);

		try {
			apply(event);
		} catch (error) {
			// A malformed event is a bug in the caller, and losing a rating is better than losing the
			// process. Deliberately not appended: a line that cannot be applied must not be replayed.
			log(`could not rate ${event.t}: ${error.message}`);

			return [];
		}

		events += 1;

		if (enabled) {
			try {
				appendFileSync(file, `${JSON.stringify(event)}\n`, 'utf8');
			} catch (error) {
				// In memory but not on disk: this game counts until the next restart. Worth a line in
				// the log and not worth refusing to play over.
				log(`could not append to ${LOG_NAME}: ${error.message}`);
			}
		}

		return movementOf(ids, before);
	}

	// Folded here rather than by the caller. Unlike the rooms, which index.js has to hand back to the
	// room store one at a time, there is nothing for anybody else to do with the result — so making it
	// a step somebody could forget would only create a way to boot with everybody on 1000.
	load();

	return {
		get enabled() {
			return enabled;
		},

		mmrFor,
		mmrsFor,

		/**
		 * A game that reached the end. `players` is `[{ id, name, place }]`, places from
		 * `py.sortByPoints` with equal scores sharing a place.
		 */
		recordGame({ code, players: finishers }) {
			return record(
				{ t: EVENTS.GAME, at: now(), code, players: finishers },
				finishers.map(({ id }) => id),
			);
		},

		/**
		 * Somebody out of a game in progress: pressing LEAVE, or being swept out of one they walked
		 * away from. `others` are the seats still at the table as `{ id, name }`, and `stranded` is the
		 * id of the one left with nothing to play, if the departure did that.
		 */
		recordQuit({ code, id, name, others = [], stranded = null }) {
			return record({ t: EVENTS.QUIT, at: now(), code, id, name, others, stranded }, stranded ? [id, stranded] : [id]);
		},

		/** How long this player must wait before joining another game. Zero for almost everybody. */
		cooldownFor(id) {
			const { level, quitAt } = peek(id);

			return Math.max(0, quitCooldownMs(level) - (now() - quitAt));
		},

		leaderboard(limit = 20) {
			return [...players.values()]
				.filter(player => player.games > 0)
				.map(player => ({ id: player.id, name: player.name, mmr: toMmr(player), games: player.games }))
				.sort((first, second) => second.mmr - first.mmr)
				.slice(0, limit);
		},

		/** Re-folds the log from scratch. This is what a change to the rating constants is applied with. */
		rebuild() {
			players.clear();
			meetings.clear();
			events = 0;
			load();
		},

		stats() {
			return { enabled, players: players.size, events };
		},
	};
}

export default createRatings;
