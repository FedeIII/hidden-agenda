import { START_GAME, NEXT_TURN, TOGGLE_PIECE, MOVE_PIECE, SNIPE } from 'Game/actions';
import { pz, TYPES, STATES } from 'Domain/pieces';

const { AGENT, CEO, SPY, SNIPER } = TYPES;
const { MOVEMENT, MOVEMENT2, MOVEMENT3, PLACEMENT } = STATES;

function hasPieceEndedTurn(pieces, pieceState, toggledPieceId) {
	const selectedPiece = pz.getSelectedPiece(pieces);

	if (selectedPiece && selectedPiece.id === toggledPieceId) {
		switch (pz.getType(selectedPiece.id)) {
			case AGENT:
				return pieceState === PLACEMENT || pieceState === MOVEMENT;
			case CEO:
				return pieceState === PLACEMENT || pieceState === MOVEMENT;
			case SPY:
				return selectedPiece.buffed
					? pieceState === PLACEMENT || pieceState === MOVEMENT3
					: pieceState === PLACEMENT || pieceState === MOVEMENT2;
			case SNIPER:
				return pieceState === PLACEMENT || pieceState === MOVEMENT;
			default:
				return false;
		}
	}

	return false;
}

// A turn that leaves the board exactly as it found it is not a turn. Dropping a piece is what
// ends one, and several ways of dropping one changed nothing at all: selecting a deployed sniper
// puts it straight into MOVEMENT, so letting go of it again ended the turn without a shot being
// aimed anywhere new — as did turning it away and back — and a spy walked out of its cell and
// back onto it, arriving on the facing it left with, did the same over two moves.
//
// piecesPrevState is the board as NEXT_TURN found it, so comparing against it states the rule
// once rather than enumerating the ways to waste a turn.
function hasTurnChangedTheBoard(state, toggledPieceId) {
	// The very toggle piecesReducer is about to apply. It has to run first because dropping a
	// piece is what commits its aim (direction = selectedDirection), so the board this turn
	// actually leaves behind does not exist until it has.
	return pz.hasBoardChanged(pz.toggle(state, toggledPieceId), state.piecesPrevState);
}

function isPieceBeingDropped(state, toggledPieceId) {
	if (state.hasTurnEnded) {
		return true;
	}

	return (
		hasPieceEndedTurn(state.pieces, state.pieceState, toggledPieceId) && hasTurnChangedTheBoard(state, toggledPieceId)
	);
}

function isSniperSelectedForSnipe(snipe, pieceId) {
	return snipe && pz.isSniper(pieceId);
}

function togglePieceState(state, pieceId) {
	return isPieceBeingDropped(state, pieceId) || isSniperSelectedForSnipe(state.snipe, pieceId);
}

// Lining a shot up takes the turn back off the player who just moved: they may not pass it on
// until the table has answered. That is the rule, and it is why arming a snipe sets this false.
//
// It is also how the game used to deadlock. There was no way to put an armed snipe away, so a
// player who lined one up and then decided against it — or hit the button by accident — left a
// turn that could not be passed and a board where nothing could be picked up, because a piece
// cannot be toggled while a snipe is armed either. Pressing SNIPE again now stands down, and the
// turn goes back to what it was.
//
// Which is worked out rather than remembered: a turn has ended when the board is not what it was
// at the start of it and no piece is still in hand. Nothing can have moved in between, since an
// armed snipe is exactly the state in which nothing can move.
function snipeState(state) {
	if (state.snipe) {
		return !pz.getSelectedPiece(state.pieces) && pz.hasBoardChanged(state.pieces, state.piecesPrevState);
	}

	if (pz.isAnyPieceThroughSniperLine(state.pieces)) {
		return false;
	}

	return state.hasTurnEnded;
}

function hasTurnEndedReducer(state, action) {
	switch (action.type) {
		case NEXT_TURN:
			return false;
		case START_GAME:
			return false;
		case TOGGLE_PIECE:
			return togglePieceState(state, action.payload.pieceId);
		case MOVE_PIECE:
			return false;
		case SNIPE:
			return snipeState(state);
		default:
			return state.hasTurnEnded;
	}
}

export default hasTurnEndedReducer;
