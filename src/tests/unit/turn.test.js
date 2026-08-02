import { test, expect } from '@playwright/test';
import { createInitialState, gameReducer } from 'Game/reducer';
import { startGame, nextTurn, togglePiece, movePiece, directPiece } from 'Game/actions';
import { pz } from 'Domain/pieces';
import cells from 'Domain/cells';

// A turn that leaves the board exactly as it found it is not a turn, and must not end one — the
// NEXT TURN button is nothing but hasTurnEnded. Every sequence below is one the UI produces from
// ordinary clicks, and each of them used to hand the turn on having changed nothing at all.

function dispatch(state, ...actions) {
	return actions.reduce((next, action) => gameReducer(next, action), state);
}

function twoPlayerGame() {
	return gameReducer(createInitialState(), startGame(['ANA', 'BEA']));
}

// Places a piece, points it and hands the turn on, so a spec starts from a settled board.
function deploy(state, id, position, facing) {
	const dropped = dispatch(
		state,
		togglePiece(id),
		movePiece(id, position),
		directPiece(cells.getDirection(position, facing)),
		togglePiece(id),
	);

	return dispatch(dropped, nextTurn());
}

// Hovering a cell is what points the selected piece at it.
function hover(state, id, cell) {
	return dispatch(state, directPiece(cells.getDirection(pz.getPieceById(id, state.pieces).position, cell)));
}

test.describe('a deployed sniper', () => {
	// Selecting a sniper that is already on the board goes straight to MOVEMENT, because turning
	// is the only move it has. Letting go of it again therefore looked exactly like finishing one.
	test('does not end the turn when it is picked up and put down again', () => {
		const state = deploy(twoPlayerGame(), '0-N', [3, 3], [3, 4]);

		const dropped = dispatch(state, togglePiece('0-N'), togglePiece('0-N'));

		expect(dropped.hasTurnEnded).toBe(false);
		expect(pz.getPieceById('0-N', dropped.pieces).direction).toEqual([0, 0]);
	});

	test('does not end the turn when it is turned away and back onto its own heading', () => {
		const state = deploy(twoPlayerGame(), '0-N', [3, 3], [3, 4]);

		let turned = dispatch(state, togglePiece('0-N'));
		turned = hover(turned, '0-N', [2, 3]);
		turned = hover(turned, '0-N', [4, 2]);
		turned = hover(turned, '0-N', [3, 4]);

		const dropped = dispatch(turned, togglePiece('0-N'));

		expect(dropped.hasTurnEnded).toBe(false);
		expect(pz.getPieceById('0-N', dropped.pieces).direction).toEqual([0, 0]);
	});

	test('does end the turn when it is left aiming somewhere new', () => {
		const state = deploy(twoPlayerGame(), '0-N', [3, 3], [3, 4]);

		const turned = hover(dispatch(state, togglePiece('0-N')), '0-N', [2, 3]);
		const dropped = dispatch(turned, togglePiece('0-N'));

		expect(dropped.hasTurnEnded).toBe(true);
		expect(pz.getPieceById('0-N', dropped.pieces).direction).toEqual([1, 0]);
	});

	// Aiming used to recompute the snipers covering the piece's own cell and union them in, so a
	// sniper standing in an enemy's line handed that enemy a shot just by turning on the spot.
	test('does not walk into an enemy line of sight by turning on the spot', () => {
		let state = twoPlayerGame();
		state = deploy(state, '1-N', [2, 1], [2, 2]);
		state = deploy(state, '0-N', [2, 3], [2, 4]);

		let turned = dispatch(state, togglePiece('0-N'));
		turned = hover(turned, '0-N', [1, 2]);
		turned = hover(turned, '0-N', [2, 4]);

		const dropped = dispatch(turned, togglePiece('0-N'));

		expect(pz.getPieceById('0-N', dropped.pieces).throughSniperLineOf).toEqual([]);
		expect(pz.isAnyPieceThroughSniperLine(dropped.pieces)).toBe(false);
		expect(dropped.hasTurnEnded).toBe(false);
	});
});

test.describe('a spy that walks back onto its own cell', () => {
	// Two moves are enough to leave and return, and the return leg sets the facing. Come back the
	// way you came and the board is untouched.
	test('does not end the turn when it arrives on the heading it left with', () => {
		const state = deploy(twoPlayerGame(), '1-S', [4, 3], [3, 3]);

		const dropped = dispatch(
			state,
			togglePiece('1-S'),
			movePiece('1-S', [5, 3]),
			movePiece('1-S', [4, 3]),
			togglePiece('1-S'),
		);

		const spy = pz.getPieceById('1-S', dropped.pieces);

		expect(dropped.hasTurnEnded).toBe(false);
		expect(spy.position).toEqual([4, 3]);
		expect(spy.direction).toEqual([1, 1]);
	});

	test('does end the turn when it arrives facing a different way', () => {
		const state = deploy(twoPlayerGame(), '1-S', [4, 3], [3, 3]);

		const dropped = dispatch(
			state,
			togglePiece('1-S'),
			movePiece('1-S', [4, 2]),
			movePiece('1-S', [4, 3]),
			togglePiece('1-S'),
		);

		expect(dropped.hasTurnEnded).toBe(true);
		expect(pz.getPieceById('1-S', dropped.pieces).direction).toEqual([0, 0]);
	});

	test('does end the turn when it walks somewhere else', () => {
		const state = deploy(twoPlayerGame(), '1-S', [4, 3], [3, 3]);

		const dropped = dispatch(
			state,
			togglePiece('1-S'),
			movePiece('1-S', [4, 2]),
			movePiece('1-S', [4, 1]),
			togglePiece('1-S'),
		);

		expect(dropped.hasTurnEnded).toBe(true);
	});
});

test.describe('turns that did something still end', () => {
	test('placing a piece out of its HQ', () => {
		const dropped = dispatch(
			twoPlayerGame(),
			togglePiece('0-A1'),
			movePiece('0-A1', [3, 3]),
			directPiece([1, 0]),
			togglePiece('0-A1'),
		);

		expect(dropped.hasTurnEnded).toBe(true);
	});

	test('moving an agent already on the board', () => {
		const state = deploy(twoPlayerGame(), '0-A1', [3, 3], [2, 3]);

		const dropped = dispatch(state, togglePiece('0-A1'), movePiece('0-A1', [1, 2]), togglePiece('0-A1'));

		expect(dropped.hasTurnEnded).toBe(true);
	});

	test('moving a ceo already on the board', () => {
		const state = deploy(twoPlayerGame(), '0-C', [3, 3], [3, 4]);

		const dropped = dispatch(state, togglePiece('0-C'), movePiece('0-C', [3, 5]), togglePiece('0-C'));

		expect(dropped.hasTurnEnded).toBe(true);
	});

	// The one that makes the whole board differ rather than one piece: a dead CEO takes its
	// team's undeployed pieces with it.
	test('a kill', () => {
		let state = deploy(twoPlayerGame(), '1-A1', [3, 3], [3, 4]);
		state = deploy(state, '0-A1', [3, 1], [3, 2]);

		const dropped = dispatch(state, togglePiece('0-A1'), movePiece('0-A1', [3, 3]), togglePiece('0-A1'));

		expect(dropped.hasTurnEnded).toBe(true);
		expect(pz.getPieceById('1-A1', dropped.pieces).killed).toBe(true);
	});
});

test.describe('hasBoardChanged', () => {
	test('sees no change between a board and itself', () => {
		expect(pz.hasBoardChanged(pz.init(), pz.init())).toBe(false);
	});

	test('sees a piece leaving its HQ, where the position goes from absent to a cell', () => {
		const pieces = pz.init();
		const moved = pieces.map(piece => (piece.id === '0-A1' ? { ...piece, position: [3, 3] } : piece));

		expect(pz.hasBoardChanged(moved, pieces)).toBe(true);
	});

	test('sees a facing change and a death', () => {
		const pieces = pz.init().map(piece => ({ ...piece, position: [3, 3], direction: [1, 0] }));

		const turned = pieces.map(piece => (piece.id === '0-A1' ? { ...piece, direction: [0, 0] } : piece));
		const dead = pieces.map(piece => (piece.id === '0-A1' ? { ...piece, killed: true } : piece));

		expect(pz.hasBoardChanged(turned, pieces)).toBe(true);
		expect(pz.hasBoardChanged(dead, pieces)).toBe(true);
	});

	// Everything a turn puts down and picks up again on its way. piecesPrevState is snapshotted
	// on NEXT_TURN before the buffs and sniper marks are recomputed, so comparing them would
	// report a change on every single turn.
	test('ignores selection, highlights, buffs and sniper marks', () => {
		const pieces = pz.init();
		const busy = pieces.map(piece => ({
			...piece,
			selected: true,
			showMoveCells: true,
			selectedDirection: [1, 0],
			highlight: true,
			buffed: true,
			throughSniperLineOf: ['0-N'],
		}));

		expect(pz.hasBoardChanged(busy, pieces)).toBe(false);
	});
});
