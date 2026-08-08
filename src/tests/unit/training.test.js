import { test, expect } from '@playwright/test';
import { gameReducer } from 'Game/reducer';
import { togglePiece, movePiece, directPiece, claimControl, nextTurn, snipe, revealFriend, accuse } from 'Game/actions';
import cells from 'Domain/cells';
import { pz } from 'Domain/pieces';
import py from 'Domain/py';
import { seedState } from 'Phases/lobbyPhase/training/seed';
import { EXERCISES, allowsAction, note } from 'Phases/lobbyPhase/training/exercises';

// The training course, walked by the real reducer with no browser in the room.
//
// An exercise is a promise: "click exactly these things, in this order, and the game will do what
// the verb says". That promise is checkable without rendering anything, and it is the half most
// likely to rot — a board written down by hand is a board nobody has played, and one cell out is a
// lesson whose second step is simply not offered. So the walk below is derived from the marks the
// screen actually paints rather than from a script kept beside them: what it proves is that a
// learner clicking only where the coach marks point finishes every exercise.

// What clicking a mark sends, as a sequence — because one click is not always one action.
//
// A cell means two different things depending on what is in hand, and the app resolves which in
// `useCellAction`: land there, or point that way and let go. Pointing arrives as a pair, since the
// pointer crosses the cell before the button goes down. Both readings are offered and the gate below
// decides which one the step meant, by looking at the action that actually settles it.
function clicksFor(mark, state) {
	if (mark.piece) {
		return [[togglePiece(mark.piece)]];
	}

	if (mark.cell) {
		const held = pz.getSelectedPiece(state.pieces);

		if (!held) {
			return [];
		}

		const aim = held.position ? [directPiece(cells.getDirection(held.position, mark.cell))] : [];

		return [[movePiece(held.id, mark.cell)], [...aim, togglePiece(held.id)]];
	}

	if (mark.control === 'next-turn') {
		return [[nextTurn()]];
	}

	if (mark.control === 'snipe') {
		return [[snipe()]];
	}

	if (mark.control && mark.control.startsWith('claim-')) {
		return [[claimControl(py.getTurn(state.players), mark.control.slice('claim-'.length))]];
	}

	if (mark.control && mark.control.startsWith('training-card-')) {
		return [[note(mark.control.slice('training-card-'.length))]];
	}

	// The two screens open and close on a note, and their own three-question flow is local to the
	// screen — only the guess at the end of it is an action, so only the guess can be walked here.
	if (mark.control === 'reveal' || mark.control === 'accuse') {
		return [[note('open')]];
	}

	if (mark.control === 'reveal-close' || mark.control === 'accuse-close') {
		return [[note('shut')]];
	}

	if (mark.control === 'reveal-friend') {
		return [[revealFriend()]];
	}

	if (mark.control && mark.control.startsWith('accuse-team-')) {
		return [
			[
				accuse({
					accuser: py.getTurn(state.players),
					accusee: 'SARA',
					alignment: 'foe',
					team: mark.control.slice('accuse-team-'.length),
				}),
			],
		];
	}

	return [];
}

function apply({ state, notes }, action) {
	// A note never reaches the reducer — looking at your own card changes nothing about the board.
	if (action.type === 'TRAINING_NOTE') {
		return { state, notes: new Set(notes).add(action.payload.flag) };
	}

	return { state: gameReducer(state, action), notes };
}

// One step: take the first click the gate accepts and hand back what the board became. A sequence is
// judged on its last action, which is the one the gate is written against — the aim in front of a
// drop is a hover, and hovering is never gated.
function takeStep(step, state, notes) {
	for (const mark of step.marks.filter(candidate => !candidate.deny)) {
		for (const clicks of clicksFor(mark, state)) {
			if (!allowsAction(step, clicks[clicks.length - 1])) {
				continue;
			}

			return clicks.reduce(apply, { state, notes });
		}
	}

	return null;
}

const boardExercises = EXERCISES.filter(exercise => exercise.seed);

test.describe('THE TRAINING COURSE', () => {
	for (const exercise of EXERCISES) {
		test(`can be finished by clicking only what is marked — ${exercise.slug}`, () => {
			let state = exercise.seed ? seedState(exercise.seed) : seedState();
			let notes = new Set();

			for (const [index, step] of exercise.steps.entries()) {
				const taken = takeStep(step, state, notes);

				expect(taken, `${exercise.slug} step ${index + 1} (${step.verb}) had no click to make`).not.toBeNull();

				state = taken.state;
				notes = taken.notes;

				expect(step.done(state, notes), `${exercise.slug} step ${index + 1} (${step.verb}) did not finish`).toBe(true);
			}
		});

		// The engine advances *while* the current step is done, so a step that was already satisfied
		// before its own click would be skipped past and its coach mark never shown.
		test(`asks for something that has not happened yet — ${exercise.slug}`, () => {
			const state = exercise.seed ? seedState(exercise.seed) : seedState();

			expect(exercise.steps[0].done(state, new Set())).toBe(false);
		});

		test(`refuses a click it did not ask for — ${exercise.slug}`, () => {
			for (const step of exercise.steps) {
				// A piece no exercise ever mentions, so this is off-script in all of them.
				expect(allowsAction(step, togglePiece('2-A5'))).toBe(false);
			}
		});
	}

	for (const exercise of boardExercises) {
		test(`seeds a board the reducer will accept — ${exercise.slug}`, () => {
			const state = seedState(exercise.seed);

			expect(state.pieces).toHaveLength(32);
			expect(state.piecesPrevState.map(piece => piece.id)).toEqual(state.pieces.map(piece => piece.id));
			expect(state.teamControl).toHaveLength(4);
			expect(state.players.filter(player => player.turn)).toHaveLength(1);
			expect(state.hasTurnEnded).toBe(false);

			for (const piece of state.pieces) {
				expect(Array.isArray(piece.throughSniperLineOf), `${piece.id} has no sniper list`).toBe(true);
			}

			// A team whose CEO is standing on the board cannot be claimed by anybody, so an HQ card
			// must not be left offering it.
			for (const team of [0, 1, 2, 3]) {
				expect(state.teamControl[team].claimEnabled).toBe(!!pz.canClaimControl(String(team), state.pieces));
			}
		});
	}

	// Same guard as the reducer-purity specs next door: the runner keeps one state object and hands
	// the same array to the previous-turn snapshot, so a reducer that wrote into a piece would
	// corrupt the board a snipe rolls back to.
	test('leaves a frozen seed alone', () => {
		const state = seedState(EXERCISES.find(exercise => exercise.slug === 'agent').seed);

		state.pieces.forEach(Object.freeze);
		Object.freeze(state.pieces);
		Object.freeze(state);

		expect(() => gameReducer(state, togglePiece('0-A1'))).not.toThrow();
	});

	test('gives every exercise a rule page to read after it', () => {
		for (const exercise of EXERCISES) {
			expect(exercise.file, `${exercise.slug} names no rule page`).toBeTruthy();
			// The stamped line has to be readable across a room, so it stays one line. Anything the
			// board cannot show goes in the note under it, which is allowed a sentence.
			expect(exercise.finding.split(' ').length, `${exercise.slug}'s finding is a paragraph`).toBeLessThanOrEqual(8);

			if (exercise.note) {
				expect(exercise.note.split(' ').length, `${exercise.slug}'s note is a paragraph`).toBeLessThanOrEqual(16);
			}
		}
	});

	// A spy kills by coming at somebody's back. What decides that is which way the target is facing
	// and nothing else — so with two enemies equally in reach, only the one turned away is offered.
	test('offers the spy the enemy with its back turned and not the one facing it', () => {
		const state = seedState(EXERCISES.find(exercise => exercise.slug === 'spy').seed);
		const held = gameReducer(state, togglePiece('0-S'));
		const stepped = gameReducer(held, movePiece('0-S', [3, 2]));

		const landings = pz.getHighlightedPositions(stepped.pieces, stepped.pieceState);

		expect(landings).toContainEqual([3, 3]);
		expect(landings).not.toContainEqual([2, 2]);
	});

	// Buffs are worked out once, when a turn starts. Standing a CEO beside a stuck agent mid-turn
	// does nothing at all until the turn is passed, which is the whole of that exercise.
	test('does not buff the agent until the turn is passed', () => {
		const buff = EXERCISES.find(exercise => exercise.slug === 'buff');
		let state = seedState(buff.seed);

		expect(pz.getHighlightedPositions(gameReducer(state, togglePiece('0-A1')).pieces, 'selection')).toEqual([]);

		// Two clicks and the turn is spent: a CEO settles on its move, like a spy.
		state = gameReducer(state, togglePiece('0-C'));
		state = gameReducer(state, movePiece('0-C', [3, 2]));

		expect(state.hasTurnEnded).toBe(true);
		expect(pz.getPieceById('0-A1', state.pieces).buffed).toBe(false);

		state = gameReducer(state, nextTurn());

		expect(pz.getPieceById('0-A1', state.pieces).buffed).toBe(true);
		expect(pz.getHighlightedPositions(gameReducer(state, togglePiece('0-A1')).pieces, 'selection')).toEqual([[2, 3]]);
	});
});
