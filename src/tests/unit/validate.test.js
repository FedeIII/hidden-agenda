import { test, expect } from '@playwright/test';
import { PHASES } from 'Domain/phases';
import { pz } from 'Domain/pieces';
import { createInitialState, gameReducer } from 'Game/reducer';
import {
	startGame,
	togglePiece,
	movePiece,
	directPiece,
	nextTurn,
	accuse,
	setAlignment,
	revealFriend,
} from 'Game/actions';
import { validateAction, createRateLimiter } from 'Server/validate';
import { applyAction, TURN_GRACE_MS } from 'Server/apply';

// Legality used to be enforced only by which hexagons the UI made clickable, which is no
// enforcement at all once the client is somebody else's browser.

function seat(name, overrides = {}) {
	return {
		id: `seat-${name}`,
		name,
		token: `token-${name}`,
		ready: true,
		connected: true,
		lastSeenAt: 0,
		...overrides,
	};
}

function playingRoom(names = ['ANA', 'BEA']) {
	return {
		code: 'ABCD',
		phase: PHASES.PLAY,
		version: 1,
		state: gameReducer(createInitialState(), startGame(names)),
		seats: names.map(name => seat(name)),
		hostSeatId: 'seat-ANA',
		createdAt: 0,
		updatedAt: 0,
	};
}

function check(room, seatName, action, extra = {}) {
	return validateAction({ action, room, seat: seat(seatName), ...extra });
}

test.describe('turn ownership', () => {
	test('accepts an action from the seat whose turn it is', () => {
		const room = playingRoom();

		expect(check(room, 'ANA', togglePiece('0-A1')).ok).toBe(true);
	});

	test('rejects the same action from any other seat', () => {
		const room = playingRoom();

		expect(check(room, 'BEA', togglePiece('0-A1'))).toEqual({ ok: false, reason: 'not_your_turn' });
	});

	test('the turn holder may move any team’s piece, which is the point of the game', () => {
		const room = playingRoom();

		// ANA is on turn but team 3's pieces are not "hers" — the game deliberately allows it.
		expect(check(room, 'ANA', togglePiece('3-C')).ok).toBe(true);
	});
});

test.describe('phase gating', () => {
	test('rejects play actions before the game has started', () => {
		const room = { ...playingRoom(), phase: PHASES.START };

		expect(check(room, 'ANA', togglePiece('0-A1'))).toEqual({ ok: false, reason: 'wrong_phase' });
	});

	test('refuses actions a client may never send, even from the turn holder', () => {
		const room = playingRoom();

		// Starting the game and dealing cards belong to the server alone.
		expect(check(room, 'ANA', startGame(['ANA', 'BEA'])).reason).toEqual('action_not_allowed');
		expect(check(room, 'ANA', setAlignment({ name: 'ANA', friend: '1', foe: '0' })).reason).toEqual(
			'action_not_allowed',
		);
	});
});

test.describe('payload shape', () => {
	test('rejects an unknown piece id', () => {
		expect(check(playingRoom(), 'ANA', togglePiece('9-Z9')).reason).toEqual('bad_piece_id');
	});

	test('rejects coordinates that are not a pair of integers', () => {
		const room = playingRoom();

		expect(check(room, 'ANA', movePiece('0-A1', ['3', '3'])).reason).toEqual('bad_coords');
		expect(check(room, 'ANA', movePiece('0-A1', [3])).reason).toEqual('bad_coords');
	});

	test('rejects a malformed action outright', () => {
		const room = playingRoom();

		expect(validateAction({ action: null, room, seat: seat('ANA') }).reason).toEqual('malformed_action');
		expect(validateAction({ action: { payload: {} }, room, seat: seat('ANA') }).reason).toEqual('malformed_action');
	});

	test('rejects an accusation naming somebody else as the accuser', () => {
		const room = playingRoom();
		const action = accuse({ accuser: 'BEA', accusee: 'BEA', alignment: 'friend', team: '0' });

		expect(check(room, 'ANA', action).reason).toEqual('accuser_mismatch');
	});

	test('rejects an accusation against a player who is not at the table', () => {
		const room = playingRoom();
		const action = accuse({ accuser: 'ANA', accusee: 'NOBODY', alignment: 'friend', team: '0' });

		expect(check(room, 'ANA', action).reason).toEqual('unknown_accusee');
	});
});

test.describe('move legality, re-derived from state', () => {
	test('rejects a move to a cell that is not highlighted', () => {
		const room = playingRoom();

		// Nothing is selected, so no cell is legal.
		expect(check(room, 'ANA', movePiece('0-A1', [3, 3])).reason).toEqual('illegal_move');
	});

	test('accepts a placement the domain layer considers legal', () => {
		const room = playingRoom();

		room.state = gameReducer(room.state, togglePiece('0-A1'));

		const legal = pz.getHighlightedPositions(room.state.pieces, room.state.pieceState)[0];

		expect(check(room, 'ANA', movePiece('0-A1', legal)).ok).toBe(true);
	});

	test('rejects a direction the selected piece cannot face', () => {
		const room = playingRoom();

		room.state = gameReducer(room.state, togglePiece('0-A1'));

		expect(check(room, 'ANA', directPiece([7, 7])).reason).toEqual('illegal_direction');
	});

	test('rejects directing when nothing is selected', () => {
		expect(check(playingRoom(), 'ANA', directPiece([1, 0])).reason).toEqual('no_selected_piece');
	});
});

test.describe('the disconnected turn holder escape hatch', () => {
	test('normally refuses to let another seat pass the turn', () => {
		const room = playingRoom();

		expect(applyAction(room, seat('BEA'), nextTurn()).reason).toEqual('not_your_turn');
	});

	test('lets any seat pass the turn once the turn holder has been gone long enough', () => {
		const room = playingRoom();
		room.seats[0] = seat('ANA', { connected: false, lastSeenAt: 0 });

		const result = applyAction(room, seat('BEA'), nextTurn(), { now: () => TURN_GRACE_MS + 1 });

		expect(result.ok).toBe(true);
		expect(room.state.players[1].turn).toBe(true);
	});

	test('still refuses inside the grace period', () => {
		const room = playingRoom();
		room.seats[0] = seat('ANA', { connected: false, lastSeenAt: 0 });

		const result = applyAction(room, seat('BEA'), nextTurn(), { now: () => TURN_GRACE_MS - 1000 });

		expect(result.reason).toEqual('not_your_turn');
	});

	test('the hatch only passes the turn, it does not let a seat play out of turn', () => {
		const room = playingRoom();
		room.seats[0] = seat('ANA', { connected: false, lastSeenAt: 0 });

		const result = applyAction(room, seat('BEA'), togglePiece('0-A1'), { now: () => TURN_GRACE_MS + 1 });

		expect(result.reason).toEqual('not_your_turn');
	});
});

test.describe('applyAction', () => {
	test('bumps the version only when an action is accepted', () => {
		const room = playingRoom();

		expect(applyAction(room, seat('ANA'), togglePiece('0-A1')).version).toEqual(2);
		expect(applyAction(room, seat('BEA'), togglePiece('0-A2')).version).toEqual(2);
	});

	test('advances to the end phase when the game finishes', () => {
		const room = playingRoom();
		// Three dead CEOs is the end condition.
		room.state = {
			...room.state,
			pieces: room.state.pieces.map(piece =>
				['0-C', '1-C', '2-C'].includes(piece.id) ? { ...piece, killed: true } : piece,
			),
		};

		applyAction(room, seat('ANA'), togglePiece('0-A1'));

		expect(room.phase).toEqual(PHASES.END);
	});

	test('runs the reveal actions, which carry no payload', () => {
		const room = playingRoom();

		expect(applyAction(room, seat('ANA'), revealFriend()).ok).toBe(true);
		expect(room.state.players[0].revealed.friend).toBe(true);
	});
});

test.describe('rate limiting', () => {
	test('lets a burst through and then stops it', () => {
		let clock = 0;
		const allow = createRateLimiter({ perSecond: 30, burst: 5, now: () => clock });
		const action = togglePiece('0-A1');

		expect([1, 2, 3, 4, 5].map(() => allow('seat-ANA', action))).toEqual([true, true, true, true, true]);
		expect(allow('seat-ANA', action)).toBe(false);
	});

	test('refills over time', () => {
		let clock = 0;
		const allow = createRateLimiter({ perSecond: 30, burst: 1, now: () => clock });
		const action = togglePiece('0-A1');

		expect(allow('seat-ANA', action)).toBe(true);
		expect(allow('seat-ANA', action)).toBe(false);

		clock = 1000;
		expect(allow('seat-ANA', action)).toBe(true);
	});

	test('limits each seat separately', () => {
		const allow = createRateLimiter({ perSecond: 30, burst: 1, now: () => 0 });
		const action = togglePiece('0-A1');

		expect(allow('seat-ANA', action)).toBe(true);
		expect(allow('seat-ANA', action)).toBe(false);
		expect(allow('seat-BEA', action)).toBe(true);
	});

	test('exempts aiming, which fires at hover rate', () => {
		const allow = createRateLimiter({ perSecond: 1, burst: 1, now: () => 0 });

		expect([1, 2, 3, 4, 5].every(() => allow('seat-ANA', directPiece([1, 0])))).toBe(true);
	});
});
