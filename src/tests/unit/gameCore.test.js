import { test, expect } from '@playwright/test';
import { createInitialState, gameReducer } from 'Game/reducer';
import { createLocalStore } from 'Game/store';
import { startGame, nextTurn, revealFriend, revealFoe, syncState } from 'Game/actions';

// That this file loads at all is the point of phase 0: it imports the game core in node, with no
// browser present. Until the reducer moved out of the React state container it read
// window.location at module scope, so the server could not have imported it.

function twoPlayerGame() {
	const started = gameReducer(createInitialState(), startGame(['ANA', 'BEA']));

	return {
		...started,
		players: started.players.map((player, index) => ({
			...player,
			alignment: index === 0 ? { friend: '1', foe: '0' } : { friend: '0', foe: '3' },
		})),
	};
}

test.describe('game core', () => {
	// Phase 1 builds one state per room on the server, so these must not share structure.
	test('createInitialState hands out independent state', () => {
		const first = createInitialState();
		const second = createInitialState();

		expect(first).toEqual(second);
		expect(first.pieces).not.toBe(second.pieces);
		expect(first.pieces[0]).not.toBe(second.pieces[0]);
		expect(first.teamControl).not.toBe(second.teamControl);
	});

	test('SYNC_STATE replaces the whole state rather than being reduced slice by slice', () => {
		const snapshot = { ...createInitialState(), hasTurnEnded: true };

		// Identity, not equality: a server snapshot is adopted as-is.
		expect(gameReducer(twoPlayerGame(), syncState(snapshot))).toBe(snapshot);
	});

	test('an unknown action leaves every slice alone', () => {
		const state = twoPlayerGame();
		const next = gameReducer(state, { type: 'NOT_A_REAL_ACTION' });

		expect(next.players).toEqual(state.players);
		expect(next.pieces).toEqual(state.pieces);
		expect(next.teamControl).toEqual(state.teamControl);
	});
});

test.describe('reveal actions carry no payload', () => {
	// They used to ship the entire players array, which the reducers read instead of state.
	// A client with redacted players would have sent the wrong one, and a hostile client
	// anything it liked.
	test('revealing a friend reads the players from state', () => {
		const state = twoPlayerGame();

		const next = gameReducer(state, revealFriend());

		expect(revealFriend()).toEqual({ type: 'REVEAL_FRIEND' });
		expect(next.players[0].revealed.friend).toBe(true);
		expect(next.players[0].revealed.foe).toBe(false);
	});

	test('revealing a friend also hands that team to the revealing player', () => {
		const next = gameReducer(twoPlayerGame(), revealFriend());

		// ANA's friend is team 1.
		expect(next.teamControl[1].player).toEqual('ANA');
		expect(next.teamControl[1].controlling).toBe(true);
	});

	test('revealing a foe reads the players from state', () => {
		const next = gameReducer(twoPlayerGame(), revealFoe());

		expect(revealFoe()).toEqual({ type: 'REVEAL_FOE' });
		expect(next.players[0].revealed.foe).toBe(true);
		// ANA's foe is team 0.
		expect(next.teamControl[0].player).toEqual('ANA');
	});
});

test.describe('local store', () => {
	test('notifies subscribers when an action changes the state', () => {
		const store = createLocalStore();
		let notified = 0;
		const unsubscribe = store.subscribe(() => notified++);

		store.dispatch(startGame(['ANA', 'BEA']));

		expect(notified).toEqual(1);
		expect(store.getState().players).toHaveLength(2);

		unsubscribe();
		store.dispatch(nextTurn());

		expect(notified).toEqual(1);
	});

	test('starts from a given state, which is how the ?test= mocks load', () => {
		const initialState = { ...createInitialState(), hasTurnEnded: true };
		const store = createLocalStore({ initialState });

		expect(store.getState().hasTurnEnded).toBe(true);
	});

	test('advances the turn through the real reducer', () => {
		const store = createLocalStore();

		store.dispatch(startGame(['ANA', 'BEA']));
		expect(store.getState().players[0].turn).toBe(true);

		store.dispatch(nextTurn());
		expect(store.getState().players[0].turn).toBe(false);
		expect(store.getState().players[1].turn).toBe(true);
	});
});
