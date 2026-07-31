import { test, expect } from '@playwright/test';
import { PHASES } from 'Domain/phases';
import { createInitialState, gameReducer } from 'Game/reducer';
import { startGame, setAlignment, revealFriend } from 'Game/actions';
import { redactFor, alignmentsVisibleTo } from 'Server/redact';
import { snapshotMessage } from 'Server/protocol';

// The single most important test in the repo: it is what stops the game's whole premise leaking.

const ALIGNMENTS = {
	ANA: { friend: '1', foe: '0' },
	BEA: { friend: '0', foe: '3' },
	CAI: { friend: '2', foe: '1' },
};

function dealtGame(names = ['ANA', 'BEA', 'CAI']) {
	let state = gameReducer(createInitialState(), startGame(names));

	for (const name of names) {
		state = gameReducer(state, setAlignment({ name, ...ALIGNMENTS[name] }));
	}

	return state;
}

test.describe('redactFor', () => {
	test('shows a seat its own alignment', () => {
		const visible = redactFor('ANA', dealtGame(), PHASES.PLAY);
		const ana = visible.players.find(player => player.name === 'ANA');

		expect(ana.alignment).toEqual({ friend: '1', foe: '0' });
	});

	test('hides every other seat’s alignment', () => {
		const visible = redactFor('ANA', dealtGame(), PHASES.PLAY);

		for (const name of ['BEA', 'CAI']) {
			const other = visible.players.find(player => player.name === name);

			expect(other.alignment).toEqual({ friend: null, foe: null });
		}
	});

	test('reveals only the half that its owner revealed', () => {
		// ANA is on turn, so revealFriend reveals ANA's friend and nothing else.
		const state = gameReducer(dealtGame(), revealFriend());
		const seenByBea = redactFor('BEA', state, PHASES.PLAY);
		const ana = seenByBea.players.find(player => player.name === 'ANA');

		expect(ana.alignment.friend).toEqual('1');
		expect(ana.alignment.foe).toBeNull();
	});

	test('stops redacting once the game is over, because scoring needs every alignment', () => {
		const state = dealtGame();
		const visible = redactFor('ANA', state, PHASES.END);

		expect(visible.players.find(player => player.name === 'BEA').alignment).toEqual(ALIGNMENTS.BEA);
	});

	test('never leaks the ?test= mock marker', () => {
		const state = { ...dealtGame(), test: true };

		expect(redactFor('ANA', state, PHASES.PLAY).test).toBeUndefined();
	});

	test('leaves everything that is not an alignment intact', () => {
		const state = dealtGame();
		const visible = redactFor('ANA', state, PHASES.PLAY);

		expect(visible.pieces).toEqual(state.pieces);
		expect(visible.teamControl).toEqual(state.teamControl);
		expect(visible.pieceState).toEqual(state.pieceState);
		expect(visible.players.map(player => player.name)).toEqual(['ANA', 'BEA', 'CAI']);
		// Turn, reveal flags and accusation rights stay public — they are part of the shared game.
		expect(visible.players.map(player => player.turn)).toEqual(state.players.map(player => player.turn));
	});

	test('does not mutate the state it projects', () => {
		const state = dealtGame();

		redactFor('ANA', state, PHASES.PLAY);

		expect(state.players.find(player => player.name === 'BEA').alignment).toEqual(ALIGNMENTS.BEA);
	});
});

test.describe('what actually goes on the wire', () => {
	// The assertion that matters is the negative one, made against the serialised bytes rather
	// than against the object graph: no other seat's secret may appear anywhere in the frame.
	test('a snapshot frame contains no other seat’s hidden alignment', () => {
		const room = { code: 'ABCD', phase: PHASES.PLAY, version: 7, state: dealtGame() };
		const frame = JSON.stringify(snapshotMessage(room, { name: 'ANA' }));
		const sent = JSON.parse(frame);

		expect(sent.v).toEqual(7);

		const alignments = sent.state.players.map(player => player.alignment);

		expect(alignments).toEqual([
			{ friend: '1', foe: '0' },
			{ friend: null, foe: null },
			{ friend: null, foe: null },
		]);
	});

	test('every seat sees only itself across a whole table', () => {
		const state = dealtGame();

		for (const seatName of ['ANA', 'BEA', 'CAI']) {
			const visible = alignmentsVisibleTo(seatName, state, PHASES.PLAY);

			for (const entry of visible) {
				if (entry.name === seatName) {
					expect(entry).toEqual({ name: seatName, ...ALIGNMENTS[seatName] });
				} else {
					expect(entry).toEqual({ name: entry.name, friend: null, foe: null });
				}
			}
		}
	});

	test('a seat name that is not at the table sees nothing at all', () => {
		// Defensive: a bug that passed the wrong name must fail closed, not open.
		const visible = alignmentsVisibleTo('NOBODY', dealtGame(), PHASES.PLAY);

		expect(visible.every(entry => entry.friend === null && entry.foe === null)).toBe(true);
	});
});
