import { test, expect } from '@playwright/test';
import { pz, STATES } from 'Domain/pieces';

const { SELECTION, MOVEMENT } = STATES;

function withPiece(pieces, id, patch) {
	return pieces.map(piece => (piece.id === id ? { ...piece, ...patch } : piece));
}

function onBoard(pieces, id, position, direction = [1, 0]) {
	return withPiece(pieces, id, {
		position,
		direction,
		selectedDirection: direction,
	});
}

test.describe('spy movement', () => {
	test('keeps its move cells after the first of two moves', () => {
		let pieces = pz.init();
		pieces = onBoard(pieces, '0-S', [3, 3]);
		pieces = withPiece(pieces, '0-S', { selected: true, showMoveCells: true });

		const moved = pz.move(pieces, '0-S', [2, 3], SELECTION);
		const spy = pz.getPieceById('0-S', moved);

		expect(spy.position).toEqual([2, 3]);
		expect(spy.showMoveCells).toBe(true);
	});

	test('stops showing move cells after the second move', () => {
		let pieces = pz.init();
		pieces = onBoard(pieces, '0-S', [3, 3]);
		pieces = withPiece(pieces, '0-S', { selected: true, showMoveCells: true });

		const first = pz.move(pieces, '0-S', [2, 3], SELECTION);
		const second = pz.move(first, '0-S', [2, 2], MOVEMENT);

		expect(pz.getPieceById('0-S', second).showMoveCells).toBe(false);
	});
});

test.describe('togglePieceState', () => {
	// Regression: this read `.selected` off the pre-action state and relied on piecesReducer
	// having already mutated it. Selecting a piece must report SELECTION, not DESELECTION.
	function stateWith(pieces) {
		return { pieces, pieceState: undefined, followMouse: false };
	}

	test('reports SELECTION when a piece is being selected', () => {
		const pieces = onBoard(pz.init(), '0-S', [2, 2]);

		expect(pz.togglePieceState('0-S', stateWith(pieces))).toEqual(SELECTION);
	});

	test('reports DESELECTION when a selected piece is being deselected', () => {
		let pieces = onBoard(pz.init(), '0-S', [2, 2]);
		pieces = withPiece(pieces, '0-S', { selected: true, showMoveCells: true });

		expect(pz.togglePieceState('0-S', stateWith(pieces))).toEqual('deselection');
	});

	test('reports MOVEMENT when selecting a sniper already on the board', () => {
		const pieces = onBoard(pz.init(), '0-N', [2, 2]);

		expect(pz.togglePieceState('0-N', stateWith(pieces))).toEqual(MOVEMENT);
	});
});

test.describe('killing a CEO', () => {
	// Regression: a sniped CEO used to die alone. killSnipedPiece marked it via killedPiece but
	// never cascaded, so the rule that a dead CEO takes its undeployed team with it — which every
	// other kill obeys — silently did not apply to the one kill the whole table can trigger.
	test('a snipe takes the rest of that team out of the HQ', () => {
		let pieces = pz.init();
		pieces = onBoard(pieces, '0-N', [3, 0]);
		pieces = onBoard(pieces, '1-C', [3, 3]);
		pieces = onBoard(pieces, '1-S', [1, 1]);

		const prevState = [...pieces];

		pieces = withPiece(pieces, '1-C', { throughSniperLineOf: ['0-N'] });
		pieces = withPiece(pieces, '0-N', { highlight: true });

		const after = pz.killSnipedPiece(pieces, prevState, '0-N');

		expect(pz.getPieceById('1-C', after).killed).toBe(true);
		expect(pz.getPieceById('1-A1', after).killed).toBe(true);
		expect(pz.getPieceById('1-A1', after).killedById).toEqual('0-N');

		// Deployed pieces of the same team are not touched, and neither is anyone else.
		expect(pz.getPieceById('1-S', after).killed).toBe(false);
		expect(pz.getPieceById('2-A1', after).killed).toBe(false);
	});

	test('a snipe clears the transient marker off the dead CEO', () => {
		let pieces = pz.init();
		pieces = onBoard(pieces, '0-N', [3, 0]);
		pieces = onBoard(pieces, '1-C', [3, 3]);

		const prevState = [...pieces];

		pieces = withPiece(pieces, '1-C', { throughSniperLineOf: ['0-N'] });

		const after = pz.killSnipedPiece(pieces, prevState, '0-N');

		expect(pz.getPieceById('1-C', after).teamKilledBy).toBeUndefined();
	});

	test('a move onto the CEO still takes the rest of that team out of the HQ', () => {
		let pieces = pz.init();
		pieces = onBoard(pieces, '0-A1', [3, 1]);
		pieces = onBoard(pieces, '1-C', [3, 3]);
		pieces = withPiece(pieces, '0-A1', { selected: true });

		const after = pz.move(pieces, '0-A1', [3, 3], SELECTION);

		expect(pz.getPieceById('1-C', after).killed).toBe(true);
		expect(pz.getPieceById('1-C', after).teamKilledBy).toBeUndefined();
		expect(pz.getPieceById('1-A1', after).killed).toBe(true);
		expect(pz.getPieceById('0-A1', after).killed).toBe(false);
	});
});

test.describe('reducer purity', () => {
	function deepFreeze(pieces) {
		pieces.forEach(piece => Object.freeze(piece));
		return Object.freeze(pieces);
	}

	test('pz.move does not mutate the pieces it is given', () => {
		let pieces = pz.init();
		pieces = onBoard(pieces, '0-A1', [3, 3]);
		pieces = onBoard(pieces, '1-A1', [1, 1]);
		const frozen = deepFreeze(pieces);

		expect(() => pz.move(frozen, '0-A1', [2, 3], SELECTION)).not.toThrow();
	});

	test('pz.toggle does not mutate the pieces it is given', () => {
		const frozen = deepFreeze(pz.init());
		const state = {
			hasTurnEnded: false,
			pieces: frozen,
			piecesPrevState: frozen,
			players: [{ name: 'A', turn: true }],
			teamControl: [
				{ player: null, prevPlayer: null, claimEnabled: true, controlling: false },
				{ player: null, prevPlayer: null, claimEnabled: true, controlling: false },
				{ player: null, prevPlayer: null, claimEnabled: true, controlling: false },
				{ player: null, prevPlayer: null, claimEnabled: true, controlling: false },
			],
			pieceState: undefined,
			snipe: false,
		};

		expect(() => pz.toggle(state, '0-A1')).not.toThrow();
		expect(pz.getPieceById('0-A1', frozen).selected).toBe(false);
	});

	test('a kill does not reach back into a previous-turn snapshot', () => {
		let pieces = pz.init();
		pieces = onBoard(pieces, '0-A1', [3, 1]);
		pieces = onBoard(pieces, '1-A1', [3, 3]);

		// What piecesPrevStateReducer does on NEXT_TURN: a shallow copy.
		const prevState = [...pieces];

		pz.move(pieces, '0-A1', [3, 3], SELECTION);

		const victimInSnapshot = pz.getPieceById('1-A1', prevState);
		expect(victimInSnapshot.killed).toBe(false);
		expect(victimInSnapshot.position).toEqual([3, 3]);
	});
});
