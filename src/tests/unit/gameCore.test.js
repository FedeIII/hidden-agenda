import { test, expect } from '@playwright/test';
import { createInitialState, gameReducer } from 'Game/reducer';
import { createLocalStore } from 'Game/store';
import { startGame, nextTurn, revealFriend, revealFoe, syncState, claimControl, movePiece } from 'Game/actions';
import { pz } from 'Domain/pieces';

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

// A team is claimable only while its CEO is still in its HQ, because claiming it IS deploying that
// CEO: the claim selects it and control becomes real when it lands.
//
// This is a regression suite, not documentation. The two halves of CLAIM_CONTROL used to disagree —
// `teams.claimControl` refused a team whose CEO was already on the board while `pz.claimControl`
// selected that CEO regardless — so on somebody else's turn the claim line of a team they controlled
// handed you their CEO to move. Both halves ask the same predicate now.
test.describe('claiming a team', () => {
	// ANA claims team 1 and deploys its CEO, which is what makes control real.
	function withTeamOneHeld() {
		const claimed = gameReducer(twoPlayerGame(), claimControl('ANA', '1'));

		return gameReducer(claimed, movePiece('1-C', [3, 3]));
	}

	test('is refused once that team is on the board, pieces included', () => {
		const held = withTeamOneHeld();

		expect(held.teamControl[1].player).toEqual('ANA');
		expect(held.teamControl[1].controlling).toBe(true);
		expect(pz.getCeo(held.pieces, '1').position).toEqual([3, 3]);

		// BEA tries to take it. Nothing moves — and in particular the CEO is not selected, which is
		// what used to leave somebody else's CEO in your hand.
		const grabbed = gameReducer(held, claimControl('BEA', '1'));

		expect(grabbed.teamControl).toEqual(held.teamControl);
		expect(grabbed.pieces).toEqual(held.pieces);
		expect(grabbed.pieceState).toEqual(held.pieceState);

		// The same object, so the CEO was not toggled — which is the actual bug rather than a proxy for
		// it. And the turn has NOT ended, or this would be passing for the other reason claimControl
		// refuses and would go on passing with the guard taken back out.
		expect(held.hasTurnEnded).toBe(false);
		expect(pz.getCeo(grabbed.pieces, '1')).toBe(pz.getCeo(held.pieces, '1'));
	});

	test('says so in the state, so the control can be offered or refused before it is clicked', () => {
		// The UI disables the claim line off this flag rather than accepting a click and quietly doing
		// nothing. It used to carry through unchanged when a CEO deployed, which is what made the line
		// clickable on a team nobody could claim.
		expect(withTeamOneHeld().teamControl[1].claimEnabled).toBe(false);
	});

	test('is still open on a team taken by a reveal, because that CEO is still in its HQ', () => {
		// The trade a reveal makes: the team is yours at once, and anybody can take it back by
		// deploying the CEO you never had to.
		const revealed = gameReducer(twoPlayerGame(), revealFriend());

		expect(revealed.teamControl[1].player).toEqual('ANA');
		expect(revealed.teamControl[1].controlling).toBe(true);
		expect(revealed.teamControl[1].claimEnabled).toBe(true);

		const snatched = gameReducer(revealed, claimControl('BEA', '1'));

		expect(snatched.teamControl[1].player).toEqual('BEA');
		expect(pz.getCeo(snatched.pieces, '1').selected).toBe(true);
	});
});
