import { test, expect } from '@playwright/test';
import { createInitialState, gameReducer } from 'Game/reducer';
import { startGame, movePiece, togglePiece, snipe, nextTurn } from 'Game/actions';
import { pz } from 'Domain/pieces';
import { getMover, isAnsweringTurnHolder } from 'Domain/snipeWindow';

// Two things about the snipe that the board alone cannot say, and that a browser is a slow way to
// ask: a sniper killed by the very move it saw still has its shot, and the shot outlives the turn
// it answers. Both are played here through the real reducer, so nothing is asserted about a state
// the game could not reach.

const RIGHT = [0, 0];
const LEFT = [0, 1];

function place(state, board) {
	const pieces = state.pieces.map(piece => {
		const spot = board[piece.id];

		return spot ? { ...piece, position: spot.at, direction: spot.facing, selectedDirection: spot.facing } : piece;
	});

	// The board as this turn found it, which is what the game's own NEXT_TURN would have left.
	return { ...state, pieces, piecesPrevState: [...pieces] };
}

function tableWith(board, names = ['ANA', 'BEA', 'CAT']) {
	return place(gameReducer(createInitialState(), startGame(names)), board);
}

function play(state, ...actions) {
	return actions.reduce(gameReducer, state);
}

const pieceOf = (state, id) => pz.getPieceById(id, state.pieces);

// Which snipers saw a piece. A whole path is checked rather than its endpoints, so a sniper whose
// line the path ran along for two cells is named once per cell — the marks are a set, not a tally.
const marksOn = (state, id) => [...new Set(pieceOf(state, id).throughSniperLineOf)];

/**
 * ANA walks an agent onto the sniper that is watching it.
 *
 * 1-N stands on [3, 3] looking left, so it watches [3, 2], [3, 1] and [3, 0]. 0-A1 stands on [3, 1]
 * and moves the two cells an agent moves: it crosses [3, 2], which marks it, and lands on the
 * sniper's own cell, which kills it. The shot is now owed to a piece that is no longer there.
 */
function aSniperKilledByWhatItSaw() {
	const state = tableWith({ '1-N': { at: [3, 3], facing: LEFT }, '0-A1': { at: [3, 1], facing: RIGHT } });

	return play(state, togglePiece('0-A1'), movePiece('0-A1', [3, 3]), togglePiece('0-A1'));
}

test.describe('a sniper killed by the move it saw', () => {
	test('is dead, and the move that killed it is marked', () => {
		const state = aSniperKilledByWhatItSaw();

		expect(pieceOf(state, '1-N').killed).toBe(true);
		expect(marksOn(state, '0-A1')).toEqual(['1-N']);
	});

	test('still lights up, and SNIPE is still worth pressing with no sniper left on the board', () => {
		const state = play(aSniperKilledByWhatItSaw(), snipe());

		expect(pz.isSniperOnBoard(state.pieces)).toBe(false);
		expect(pz.isSnipeAvailable(state.pieces)).toBe(true);
		expect(state.snipe).toBe(true);
		expect(pieceOf(state, '1-N').highlight).toBe(true);
	});

	test('names the cell it stood in, which is what there is left to click', () => {
		const state = play(aSniperKilledByWhatItSaw(), snipe());

		expect(pz.getFallenSnipers(state.pieces, state.snipeWindow.pieces)).toEqual([{ id: '1-N', position: [3, 3] }]);
		expect(pz.getFallenSniperAt([3, 3], state.pieces, state.snipeWindow.pieces)).toEqual('1-N');
		expect(pz.getFallenSniperAt([3, 2], state.pieces, state.snipeWindow.pieces)).toBeFalsy();
	});

	test('comes back to life when it fires, and takes the piece that killed it with it', () => {
		const state = play(aSniperKilledByWhatItSaw(), snipe(), togglePiece('1-N'));

		expect(pieceOf(state, '1-N').killed).toBe(false);
		expect(pieceOf(state, '1-N').position).toEqual([3, 3]);
		expect(pieceOf(state, '1-N').highlight).toBe(false);

		expect(pieceOf(state, '0-A1').killed).toBe(true);
		expect(pieceOf(state, '0-A1').killedById).toEqual('1-N');
		expect(pz.getKilledPiecesByTeam('1', state.pieces).A).toEqual(1);
	});

	test('puts the snipe away with it, so the board is not left frozen', () => {
		const state = play(aSniperKilledByWhatItSaw(), snipe(), togglePiece('1-N'));

		expect(state.snipe).toBe(false);
		expect(state.snipeWindow).toBe(null);
		// The mover's turn is spent: their move was undone and play moves on.
		expect(state.hasTurnEnded).toBe(true);
	});

	// A shot is spent once it is taken. A corpse still carrying the mark that killed it reads as a
	// shot nobody has answered, and SNIPE would arm on it all over again.
	test('takes the mark with it, so the same shot cannot be armed twice', () => {
		const state = play(aSniperKilledByWhatItSaw(), snipe(), togglePiece('1-N'));

		expect(pz.isAnyPieceThroughSniperLine(state.pieces)).toBe(false);
		expect(play(state, snipe()).snipe).toBe(false);
	});

	// A lit sniper with no shot behind it is left-over paint, and the domain refuses to fire on it.
	test('is not fired by a stray click on a lit sniper with no shot on the table', () => {
		const armed = play(aSniperKilledByWhatItSaw(), snipe());
		const stray = gameReducer({ ...armed, snipeWindow: null }, togglePiece('1-N'));

		expect(pieceOf(stray, '1-N').killed).toBe(true);
		expect(pieceOf(stray, '0-A1').killed).toBe(false);
	});
});

// The window a shot is taken in used to be the turn it was provoked in, and NEXT TURN closed it
// whether anybody had looked at the board or not. It now runs until the next player moves.
test.describe('a shot outlives the turn it answers', () => {
	function passedOn() {
		return play(aSniperKilledByWhatItSaw(), nextTurn());
	}

	test('survives the turn change, marks and all', () => {
		const state = passedOn();

		expect(state.players.find(player => player.turn).name).toEqual('BEA');
		expect(marksOn(state, '0-A1')).toEqual(['1-N']);
		expect(state.snipeWindow.player).toEqual('ANA');
		expect(getMover(state)).toEqual('ANA');
		expect(isAnsweringTurnHolder(state)).toBe(false);
	});

	test('can still be lined up and taken on the next player’s turn', () => {
		const state = play(passedOn(), snipe(), togglePiece('1-N'));

		expect(pieceOf(state, '1-N').killed).toBe(false);
		expect(pieceOf(state, '0-A1').killed).toBe(true);
	});

	test('does not cost the next player the turn they have not used', () => {
		const state = play(passedOn(), snipe(), togglePiece('1-N'));

		expect(state.hasTurnEnded).toBe(false);
		expect(state.players.find(player => player.turn).name).toEqual('BEA');

		// And the board is theirs again: a piece can be picked up and moved.
		const moved = play(state, togglePiece('1-A1'), movePiece('1-A1', [3, 1]));
		expect(pieceOf(moved, '1-A1').position).toEqual([3, 1]);
	});

	test('standing down on the next player’s turn leaves that turn unspent too', () => {
		const state = play(passedOn(), snipe(), snipe());

		expect(state.snipe).toBe(false);
		expect(state.hasTurnEnded).toBe(false);
		expect(pieceOf(state, '1-N').highlight).toBe(false);
	});

	// The line the requirement draws: looking at the board is free, moving on it is not.
	test('survives the next player picking pieces up and putting them down', () => {
		const state = play(passedOn(), togglePiece('1-A1'), togglePiece('1-A1'));

		expect(state.snipeWindow).not.toBe(null);
		expect(pz.isAnyPieceThroughSniperLine(state.pieces)).toBe(true);
	});

	test('is gone the moment the next player moves something', () => {
		const state = play(passedOn(), togglePiece('1-A1'), movePiece('1-A1', [3, 1]));

		expect(state.snipeWindow).toBe(null);
		expect(pz.isAnyPieceThroughSniperLine(state.pieces)).toBe(false);
		expect(play(state, snipe()).snipe).toBe(false);
	});

	// A disconnected seat is passed over by the server rather than moving, so the shot cannot wait
	// on a move that is never coming — it survives exactly one turn change.
	test('is gone after a second turn change, moved or not', () => {
		const state = play(passedOn(), nextTurn());

		expect(state.snipeWindow).toBe(null);
		expect(pz.isAnyPieceThroughSniperLine(state.pieces)).toBe(false);
	});
});

test.describe('the shot inside the turn it answers', () => {
	test('is still the mover’s to lose: firing spends their turn', () => {
		const state = play(aSniperKilledByWhatItSaw(), snipe());

		expect(getMover(state)).toEqual('ANA');
		expect(isAnsweringTurnHolder(state)).toBe(true);
		// Arming takes the turn back off the mover until the table has answered.
		expect(state.hasTurnEnded).toBe(false);
		expect(play(state, togglePiece('1-N')).hasTurnEnded).toBe(true);
	});

	test('with nothing marked, the mover is simply whoever is on turn', () => {
		const state = tableWith({ '1-N': { at: [3, 3], facing: LEFT } });

		expect(state.snipeWindow).toBe(null);
		expect(getMover(state)).toEqual('ANA');
	});
});
