import { test, expect } from '@playwright/test';
import { createInitialState, gameReducer } from 'Game/reducer';
import {
	accuse,
	claimControl,
	directPiece,
	movePiece,
	nextTurn,
	revealFoe,
	revealFriend,
	snipe,
	startGame,
	togglePiece,
} from 'Game/actions';
import { pz, MOVES, STATES } from 'Domain/pieces';
import cells from 'Domain/cells';

const { SELECTION, MOVEMENT2 } = STATES;

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

// None of these ends with a togglePiece: a spy has no turning step, so its last move both points
// it and puts it down. The move is the whole turn.
test.describe('a spy that walks back onto its own cell', () => {
	// Two moves are enough to leave and return, and the return leg sets the facing. Come back the
	// way you came and the board is untouched.
	test('does not end the turn when it arrives on the heading it left with', () => {
		const state = deploy(twoPlayerGame(), '1-S', [4, 3], [3, 3]);

		const walked = dispatch(state, togglePiece('1-S'), movePiece('1-S', [5, 3]), movePiece('1-S', [4, 3]));

		const spy = pz.getPieceById('1-S', walked.pieces);

		expect(walked.hasTurnEnded).toBe(false);
		expect(spy.position).toEqual([4, 3]);
		expect(spy.direction).toEqual([1, 1]);

		// Settled rather than stuck: the steps are spent, so it is back on the board with nothing
		// in hand, and picking it up again is a fresh walk.
		expect(spy.selected).toBe(false);
		expect(pz.getPieceById('1-S', dispatch(walked, togglePiece('1-S')).pieces).showMoveCells).toBe(true);
	});

	test('does end the turn when it arrives facing a different way', () => {
		const state = deploy(twoPlayerGame(), '1-S', [4, 3], [3, 3]);

		const walked = dispatch(state, togglePiece('1-S'), movePiece('1-S', [4, 2]), movePiece('1-S', [4, 3]));

		expect(walked.hasTurnEnded).toBe(true);
		expect(pz.getPieceById('1-S', walked.pieces).direction).toEqual([0, 0]);
		expect(pz.getPieceById('1-S', walked.pieces).selected).toBe(false);
	});

	test('does end the turn when it walks somewhere else', () => {
		const state = deploy(twoPlayerGame(), '1-S', [4, 3], [3, 3]);

		const walked = dispatch(state, togglePiece('1-S'), movePiece('1-S', [4, 2]), movePiece('1-S', [4, 1]));

		expect(walked.hasTurnEnded).toBe(true);
	});

	test('is settled for good — a click after it lands does not pick it up again', () => {
		const state = deploy(twoPlayerGame(), '1-S', [4, 3], [3, 3]);

		const walked = dispatch(state, togglePiece('1-S'), movePiece('1-S', [4, 2]), movePiece('1-S', [4, 1]));
		const clicked = dispatch(walked, togglePiece('1-S'));

		expect(clicked.hasTurnEnded).toBe(true);
		expect(pz.getPieceById('1-S', clicked.pieces).selected).toBe(false);
		expect(pz.getPieceById('1-S', clicked.pieces).showMoveCells).toBe(false);
	});
});

// A CEO has no turning step either — it faces whichever way it just went — so the move ends the turn
// on its own and the confirming click it used to ask for was a decision already made.
test.describe('a ceo that moves on the board', () => {
	test('settles where it lands and ends the turn on the move', () => {
		const state = deploy(twoPlayerGame(), '0-C', [3, 3], [3, 4]);

		const moved = dispatch(state, togglePiece('0-C'), movePiece('0-C', [1, 1]));
		const ceo = pz.getPieceById('0-C', moved.pieces);

		expect(moved.hasTurnEnded).toBe(true);
		expect(ceo.position).toEqual([1, 1]);
		expect(ceo.selected).toBe(false);
		expect(ceo.showMoveCells).toBe(false);
		expect(ceo.direction).toEqual([1, 1]);
	});

	test('is settled for good — a click after it lands does not pick it up again', () => {
		const state = deploy(twoPlayerGame(), '0-C', [3, 3], [3, 4]);

		const moved = dispatch(state, togglePiece('0-C'), movePiece('0-C', [1, 1]));
		const clicked = dispatch(moved, togglePiece('0-C'));

		expect(clicked.hasTurnEnded).toBe(true);
		expect(pz.getPieceById('0-C', clicked.pieces).selected).toBe(false);
		expect(pz.getPieceById('0-C', clicked.pieces).showMoveCells).toBe(false);
	});

	// The exception, and the one place a CEO is still put down by hand: out of an HQ it lands with no
	// facing of its own, so it is pointed like everything else.
	test('is still pointed by hand when it comes out of its HQ', () => {
		const placed = dispatch(twoPlayerGame(), togglePiece('0-C'), movePiece('0-C', [3, 3]));

		expect(placed.hasTurnEnded).toBe(false);
		expect(pz.getPieceById('0-C', placed.pieces).selected).toBe(true);

		const dropped = dispatch(hover(placed, '0-C', [2, 2]), togglePiece('0-C'));

		expect(dropped.hasTurnEnded).toBe(true);
		expect(pz.getPieceById('0-C', dropped.pieces).direction).toEqual([1, 1]);
	});
});

// Regression. A settled spy ends the turn without a toggle, so the state machine is left sitting on
// MOVEMENT2 instead of the DESELECTION a drop used to leave — and the guard that stops a spy being
// put down mid-walk read that state without asking whose it was. A buffed spy picked up afterwards
// inherited two steps it had never taken and moved once.
test.describe('a spy does not inherit the last one’s steps', () => {
	function buffedSpyAndAWalkedOne() {
		let state = twoPlayerGame();

		state = deploy(state, '1-C', [3, 3], [2, 3]);
		state = deploy(state, '1-S', [4, 3], [3, 3]);
		state = deploy(state, '0-S', [1, 1], [1, 2]);

		// The other spy takes its two steps, settling itself and leaving MOVEMENT2 behind.
		const walked = dispatch(state, togglePiece('0-S'), movePiece('0-S', [1, 2]), movePiece('0-S', [2, 2]));

		expect(walked.pieceState).toEqual(MOVEMENT2);
		expect(walked.hasTurnEnded).toBe(true);

		return dispatch(walked, nextTurn());
	}

	test('a buffed spy still gets all three of its steps', () => {
		const state = buffedSpyAndAWalkedOne();

		expect(pz.getPieceById('1-S', state.pieces).buffed).toBe(true);

		const picked = dispatch(state, togglePiece('1-S'));
		expect(picked.pieceState).toEqual(SELECTION);

		const first = dispatch(picked, movePiece('1-S', [4, 2]));
		expect(first.hasTurnEnded).toBe(false);

		const second = dispatch(first, movePiece('1-S', [4, 1]));
		expect(second.hasTurnEnded).toBe(false);

		const third = dispatch(second, movePiece('1-S', [3, 1]));
		expect(third.hasTurnEnded).toBe(true);
		expect(pz.getPieceById('1-S', third.pieces).position).toEqual([3, 1]);
	});

	test('and still cannot be put down in the middle of them', () => {
		const state = buffedSpyAndAWalkedOne();

		const midWalk = dispatch(state, togglePiece('1-S'), movePiece('1-S', [4, 2]), togglePiece('1-S'));

		expect(pz.getPieceById('1-S', midWalk.pieces).selected).toBe(true);
		expect(midWalk.hasTurnEnded).toBe(false);
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

	// No togglePiece at the end of this one, for the same reason as the spy above: a CEO faces the
	// way it just went, so the move points it and puts it down in one.
	test('moving a ceo already on the board', () => {
		const state = deploy(twoPlayerGame(), '0-C', [3, 3], [3, 4]);

		const dropped = dispatch(state, togglePiece('0-C'), movePiece('0-C', [3, 5]));

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

// The mark over a cell that says what the last player did. Everybody moves everybody's pieces, so
// what has just changed is the one thing the board cannot say by itself.
test.describe('the last move', () => {
	test('is nothing at all before anybody has moved', () => {
		expect(twoPlayerGame().lastMove).toBe(null);
	});

	test('names a piece deployed out of its HQ', () => {
		const placed = dispatch(twoPlayerGame(), togglePiece('0-A1'), movePiece('0-A1', [3, 3]));
		const passed = dispatch(hover(placed, '0-A1', [3, 4]), togglePiece('0-A1'), nextTurn());

		expect(passed.lastMove).toEqual({ id: '0-A1', position: [3, 3], event: MOVES.PLACED });
	});

	test('names a piece that moved on the board', () => {
		const state = deploy(twoPlayerGame(), '0-A1', [3, 3], [3, 4]);

		const passed = dispatch(state, togglePiece('0-A1'), movePiece('0-A1', [3, 5]), togglePiece('0-A1'), nextTurn());

		expect(passed.lastMove).toEqual({ id: '0-A1', position: [3, 5], event: MOVES.MOVED });
	});

	// A sniper's whole move can be a turn on the spot, and that is still a move it made.
	test('names a piece that only turned where it stood', () => {
		const state = deploy(twoPlayerGame(), '0-N', [3, 3], [3, 4]);

		const turned = hover(dispatch(state, togglePiece('0-N')), '0-N', [2, 3]);
		const passed = dispatch(turned, togglePiece('0-N'), nextTurn());

		expect(passed.lastMove).toEqual({ id: '0-N', position: [3, 3], event: MOVES.MOVED });
	});

	// The mover is the piece alive on both boards and not where it was, so a kill is read as the
	// consequence of a move rather than as a second one — and the mark names what was TAKEN, because
	// the killer is standing on that cell for anybody to read.
	test('names the piece a kill took, and the mover it belongs to', () => {
		let state = deploy(twoPlayerGame(), '1-S', [3, 3], [3, 4]);
		state = deploy(state, '0-A1', [3, 1], [3, 2]);

		const passed = dispatch(state, togglePiece('0-A1'), movePiece('0-A1', [3, 3]), togglePiece('0-A1'), nextTurn());

		expect(pz.getPieceById('1-S', passed.pieces).killed).toBe(true);
		expect(passed.lastMove).toEqual({ id: '0-A1', position: [3, 3], event: MOVES.KILLED, victim: '1-S' });
	});

	// A CEO takes its team's undeployed pieces with it, out of their HQ and straight to a cemetery.
	// The mark names the CEO, which is the piece the move actually reached — and the biggest thing
	// that can happen on one cell.
	test('names a killed ceo rather than one of the pieces its death took', () => {
		let state = deploy(twoPlayerGame(), '1-C', [3, 3], [3, 4]);
		state = deploy(state, '0-A1', [3, 1], [3, 2]);

		const passed = dispatch(state, togglePiece('0-A1'), movePiece('0-A1', [3, 3]), togglePiece('0-A1'), nextTurn());

		// Still in its HQ when the CEO died, so it went too.
		expect(pz.getPieceById('1-A2', passed.pieces).killed).toBe(true);
		expect(passed.lastMove.event).toEqual(MOVES.KILLED);
		expect(passed.lastMove.victim).toEqual('1-C');
	});

	// Deploying a CEO is HOW a team is claimed, so the board cannot tell the two apart on its own.
	// `teamControl.controlling` is set by that very placement and says which it was.
	test('says a team was claimed when the ceo placed was the claim', () => {
		const claimed = dispatch(twoPlayerGame(), claimControl('ANA', '0'), movePiece('0-C', [3, 3]));
		const passed = dispatch(hover(claimed, '0-C', [3, 4]), togglePiece('0-C'), nextTurn());

		expect(passed.teamControl[0].player).toEqual('ANA');
		expect(passed.lastMove).toEqual({ id: '0-C', position: [3, 3], event: MOVES.CLAIMED });
	});

	test('says a plain placement when the ceo was deployed with nobody holding the team', () => {
		const placed = dispatch(twoPlayerGame(), togglePiece('0-C'), movePiece('0-C', [3, 3]));
		const passed = dispatch(hover(placed, '0-C', [3, 4]), togglePiece('0-C'), nextTurn());

		expect(passed.teamControl[0].player).toBe(null);
		expect(passed.lastMove).toEqual({ id: '0-C', position: [3, 3], event: MOVES.PLACED });
	});

	test('is replaced by the next turn, not added to', () => {
		let state = deploy(twoPlayerGame(), '0-A1', [3, 3], [3, 4]);
		state = deploy(state, '1-A1', [1, 1], [1, 2]);

		const passed = dispatch(state, togglePiece('0-A1'), movePiece('0-A1', [3, 5]), togglePiece('0-A1'), nextTurn());
		const again = dispatch(passed, togglePiece('1-A1'), movePiece('1-A1', [1, 3]), togglePiece('1-A1'), nextTurn());

		expect(again.lastMove).toEqual({ id: '1-A1', position: [1, 3], event: MOVES.MOVED });
	});

	// A turn is passed without a move when the server passes over a seat that has gone. There is
	// nothing to point at, and the mark from the turn before it is two turns old.
	test('is wiped by a turn that moved nothing', () => {
		const state = deploy(twoPlayerGame(), '0-A1', [3, 3], [3, 4]);
		const passed = dispatch(state, togglePiece('0-A1'), movePiece('0-A1', [3, 5]), togglePiece('0-A1'), nextTurn());

		expect(dispatch(passed, nextTurn()).lastMove).toBe(null);
	});
});

// The mark lasts until the player being handed the turn commits to something, not for their whole
// turn. Looking at what is on offer is free; anything that cannot be taken back answers the mark.
test.describe('what puts the last move away', () => {
	function aMarkedBoard() {
		let state = deploy(twoPlayerGame(), '0-A1', [3, 3], [3, 4]);
		state = deploy(state, '1-N', [5, 3], [5, 4]);

		return dispatch(state, togglePiece('0-A1'), movePiece('0-A1', [3, 5]), togglePiece('0-A1'), nextTurn());
	}

	test('survives picking a piece up and putting it back', () => {
		const marked = aMarkedBoard();

		expect(dispatch(marked, togglePiece('1-N')).lastMove).not.toBe(null);
		expect(dispatch(marked, togglePiece('1-N'), togglePiece('1-N')).lastMove).not.toBe(null);
	});

	test('survives pointing a piece somewhere, which a hover elsewhere undoes', () => {
		const held = dispatch(aMarkedBoard(), togglePiece('1-N'));

		expect(hover(held, '1-N', [4, 3]).lastMove).not.toBe(null);
	});

	test('survives arming a snipe, and standing down again', () => {
		const marked = aMarkedBoard();

		expect(dispatch(marked, snipe()).lastMove).not.toBe(null);
		expect(dispatch(marked, snipe(), snipe()).lastMove).not.toBe(null);
	});

	// Claiming is cancellable — it selects the team's CEO and CANCEL_CONTROL puts it back.
	test('survives claiming a team', () => {
		expect(dispatch(aMarkedBoard(), claimControl('BEA', '2')).lastMove).not.toBe(null);
	});

	test('goes the moment a piece actually moves', () => {
		const moved = dispatch(aMarkedBoard(), togglePiece('1-N'), movePiece('1-N', [5, 2]));

		expect(moved.lastMove).toBe(null);
	});

	// The one turn with no move in it: a sniper turned where it stands. The drop is what commits it,
	// so the drop is what the mark waits for.
	test('goes on the drop that leaves a piece facing somewhere new', () => {
		const turned = hover(dispatch(aMarkedBoard(), togglePiece('1-N')), '1-N', [4, 3]);

		expect(turned.lastMove).not.toBe(null);
		expect(dispatch(turned, togglePiece('1-N')).lastMove).toBe(null);
	});

	// Both cost their player something real and neither can be taken back, but the pieces stand
	// exactly where the last move left them — and this mark is about the board.
	test('survives revealing an alignment', () => {
		expect(dispatch(aMarkedBoard(), revealFriend()).lastMove).not.toBe(null);
		expect(dispatch(aMarkedBoard(), revealFoe()).lastMove).not.toBe(null);
	});

	test('survives an accusation, right or wrong', () => {
		const guess = accuse({ accuser: 'BEA', accusee: 'ANA', alignment: 'friend', team: '0' });

		expect(dispatch(aMarkedBoard(), guess).lastMove).not.toBe(null);
	});
});
