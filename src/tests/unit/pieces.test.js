import { test, expect } from '@playwright/test';
import { pz, STATES } from 'Domain/pieces';

const { SELECTION, MOVEMENT, MOVEMENT2 } = STATES;

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

	// A spy takes its facing from the step it just took, so there is no turning step to hand it to
	// and its last move puts it down as well. Everything else lands and is then aimed by hand.
	test('puts itself down on its last move, and stays in hand before it', () => {
		let pieces = pz.init();
		pieces = onBoard(pieces, '0-S', [3, 3]);
		pieces = withPiece(pieces, '0-S', { selected: true, showMoveCells: true });

		const first = pz.move(pieces, '0-S', [2, 3], SELECTION);
		expect(pz.getPieceById('0-S', first).selected).toBe(true);

		const second = pz.move(first, '0-S', [2, 2], MOVEMENT);
		expect(pz.getPieceById('0-S', second).selected).toBe(false);
		expect(pz.getPieceById('0-S', second).direction).toEqual(pz.getPieceById('0-S', second).selectedDirection);
	});

	test('a buffed spy settles on the third move rather than the second', () => {
		let pieces = pz.init();
		pieces = onBoard(pieces, '0-S', [3, 3]);
		pieces = withPiece(pieces, '0-S', { selected: true, showMoveCells: true, buffed: true });

		const second = pz.move(pz.move(pieces, '0-S', [2, 3], SELECTION), '0-S', [2, 2], MOVEMENT);
		expect(pz.getPieceById('0-S', second).selected).toBe(true);

		const third = pz.move(second, '0-S', [3, 2], MOVEMENT2);
		expect(pz.getPieceById('0-S', third).selected).toBe(false);
	});

	test('is still put down by hand when it comes out of an HQ', () => {
		const pieces = withPiece(pz.init(), '0-S', { selected: true, showMoveCells: true });
		const placed = pz.getPieceById('0-S', pz.move(pieces, '0-S', [3, 3], SELECTION));

		// No position to have come from means no direction of its own, so the aiming step stands.
		expect(placed.selected).toBe(true);
		expect(placed.direction).toBeUndefined();
	});

	test('isSettledByMove is the one place that decides it', () => {
		const onTheBoard = pz.getPieceById('0-S', onBoard(pz.init(), '0-S', [3, 3]));
		const inTheHq = pz.getPieceById('0-S', pz.init());
		const agent = pz.getPieceById('0-A1', onBoard(pz.init(), '0-A1', [3, 3]));
		const ceo = pz.getPieceById('0-C', onBoard(pz.init(), '0-C', [3, 3]));
		const ceoInTheHq = pz.getPieceById('0-C', pz.init());

		expect(pz.isSettledByMove(onTheBoard, SELECTION)).toBe(false);
		expect(pz.isSettledByMove(onTheBoard, MOVEMENT)).toBe(true);
		expect(pz.isSettledByMove({ ...onTheBoard, buffed: true }, MOVEMENT)).toBe(false);
		expect(pz.isSettledByMove({ ...onTheBoard, buffed: true }, MOVEMENT2)).toBe(true);
		expect(pz.isSettledByMove(inTheHq, SELECTION)).toBe(false);
		expect(pz.isSettledByMove(agent, MOVEMENT)).toBe(false);

		// A CEO spends its whole move in one direction, so there is no state at which it has more
		// of one to take: any move off the board settles it, and a deployment never does.
		expect(pz.isSettledByMove(ceo, SELECTION)).toBe(true);
		expect(pz.isSettledByMove(ceoInTheHq, SELECTION)).toBe(false);
	});

	// A spy takes somebody from behind, and what decides that is which way the *target* is facing.
	// The check used to ask whether any piece on the board had its back turned, which gives the right
	// answer with one enemy in reach and the wrong one with two: the spy was offered a kill on the
	// piece looking straight at it, because the other one happened to be facing away.
	test('offers only the enemy whose back is turned, with two of them equally in reach', () => {
		let pieces = pz.init();
		pieces = onBoard(pieces, '0-S', [3, 2], [0, 0]);
		pieces = withPiece(pieces, '0-S', { selected: true, showMoveCells: true });
		pieces = onBoard(pieces, '1-A1', [3, 3], [0, 0]);
		pieces = onBoard(pieces, '1-A2', [2, 2], [-1, 1]);

		const landings = pz.getHighlightedPositions(pieces, MOVEMENT);

		expect(landings).toContainEqual([3, 3]);
		expect(landings).not.toContainEqual([2, 2]);
	});
});

// A CEO faces the way it just went, exactly like a spy, so it settles on the move as well: it is the
// second piece with no turning step and the second one never asked for a confirming click.
test.describe('ceo movement', () => {
	test('puts itself down on the move, facing the way it went', () => {
		let pieces = pz.init();
		pieces = onBoard(pieces, '0-C', [3, 3]);
		pieces = withPiece(pieces, '0-C', { selected: true, showMoveCells: true });

		const ceo = pz.getPieceById('0-C', pz.move(pieces, '0-C', [3, 5], SELECTION));

		expect(ceo.position).toEqual([3, 5]);
		expect(ceo.selected).toBe(false);
		expect(ceo.showMoveCells).toBe(false);
		expect(ceo.direction).toEqual([0, 0]);
		expect(ceo.direction).toEqual(ceo.selectedDirection);
	});

	test('is still put down by hand when it comes out of an HQ', () => {
		const pieces = withPiece(pz.init(), '0-C', { selected: true, showMoveCells: true });
		const ceo = pz.getPieceById('0-C', pz.move(pieces, '0-C', [3, 3], SELECTION));

		// No position to have come from means no direction of its own, so the aiming step stands.
		expect(ceo.selected).toBe(true);
		expect(ceo.direction).toBeUndefined();
	});
});

// The board says where the rest of the walk could get to, a level per move away. A spy is the only
// piece that has one, and none of it is a legal move — see pz.getPreviewPositions.
test.describe('the spy walk preview', () => {
	function walkingSpy(extra = {}) {
		let pieces = pz.init();
		pieces = onBoard(pieces, '0-S', [3, 3]);

		return withPiece(pieces, '0-S', { selected: true, showMoveCells: true, ...extra });
	}

	function contains(positions, position) {
		return positions.some(([row, cell]) => row === position[0] && cell === position[1]);
	}

	test('shows the cells the second move could reach, one level of them', () => {
		const preview = pz.getPreviewPositions(walkingSpy(), SELECTION);

		// The two rings around the middle cell: six now, twelve one move further out.
		expect(preview).toHaveLength(1);
		expect(preview[0]).toHaveLength(12);
		expect(contains(preview[0], [1, 3])).toBe(true);
	});

	test('leaves a cell it can reach right now in the red it already has', () => {
		const pieces = walkingSpy();
		const now = pz.getHighlightedPositions(pieces, SELECTION);
		const later = pz.getPreviewPositions(pieces, SELECTION);

		// Every neighbour is reachable in two moves as well — out and back round — so this is the
		// rule that the nearer reading wins, not an accident of the geometry.
		expect(now).toHaveLength(6);
		for (const position of now) {
			expect(contains(later[0], position)).toBe(false);
		}
	});

	test('does not offer the cell the spy is standing on', () => {
		const preview = pz.getPreviewPositions(walkingSpy(), SELECTION);

		expect(contains(preview[0], [3, 3])).toBe(false);
	});

	test('has nothing left to show on the last move', () => {
		expect(pz.getPreviewPositions(walkingSpy(), MOVEMENT)).toEqual([]);
	});

	test('shows two levels for a buffed spy, and one after it has moved once', () => {
		const buffed = walkingSpy({ buffed: true });

		const fromTheStart = pz.getPreviewPositions(buffed, SELECTION);
		expect(fromTheStart.map(level => level.length)).toEqual([12, 18]);

		expect(pz.getPreviewPositions(buffed, MOVEMENT).map(level => level.length)).toEqual([12]);
		expect(pz.getPreviewPositions(buffed, MOVEMENT2)).toEqual([]);
	});

	test('cannot walk through an occupied cell', () => {
		// A middle move may not land on a piece, so the cell straight beyond one drops off the
		// walk while the rest of the ring, reachable round the other side, stays on it.
		const pieces = onBoard(walkingSpy(), '1-A1', [2, 3]);
		const blocked = pz.getPreviewPositions(pieces, SELECTION);

		expect(contains(pz.getHighlightedPositions(pieces, SELECTION), [2, 3])).toBe(false);
		expect(contains(blocked[0], [1, 3])).toBe(false);
		expect(contains(blocked[0], [1, 2])).toBe(true);

		// The last step of the walk is the one that may take a piece, so the cell it is standing on
		// is where the spy could get to next — which is the whole point of showing the walk.
		expect(contains(blocked[0], [2, 3])).toBe(true);
	});

	test('is empty for every piece that does not walk', () => {
		let pieces = pz.init();
		pieces = onBoard(pieces, '0-A1', [3, 3]);
		pieces = withPiece(pieces, '0-A1', { selected: true, showMoveCells: true });

		expect(pz.getPreviewPositions(pieces, SELECTION)).toEqual([]);
		expect(pz.getPreviewPositions(pz.init(), SELECTION)).toEqual([]);
	});

	test('is not a legal move', () => {
		const pieces = walkingSpy();
		const [twoAway] = pz.getPreviewPositions(pieces, SELECTION)[0];

		expect(pz.isMovePieceOnCellClick(false, twoAway, pieces, SELECTION)).toBe(false);
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
