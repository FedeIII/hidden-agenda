import { START_GAME, NEXT_TURN, TOGGLE_PIECE, MOVE_PIECE, SNIPE } from 'Game/actions';
import { pz, TYPES, STATES } from 'Domain/pieces';
import { isAnsweringTurnHolder } from 'Domain/snipeWindow';

const { AGENT, CEO, SPY, SNIPER } = TYPES;
const { MOVEMENT, PLACEMENT } = STATES;

function hasPieceEndedTurn(pieces, pieceState, toggledPieceId) {
	const selectedPiece = pz.getSelectedPiece(pieces);

	if (selectedPiece && selectedPiece.id === toggledPieceId) {
		switch (pz.getType(selectedPiece.id)) {
			case AGENT:
				return pieceState === PLACEMENT || pieceState === MOVEMENT;
			// Placement only, for the CEO and the spy alike. Both take their facing from the move
			// they just made, so neither is ever in hand afterwards to be dropped — a CEO settles on
			// its move and a spy on the last step of its walk, see isPieceSettledByMove. Either is
			// only ever put down by hand coming out of an HQ, where it lands with no facing of its
			// own and has to be pointed like everything else.
			case CEO:
			case SPY:
				return pieceState === PLACEMENT;
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

// The other way a turn ends, and the reason the rule above is stated once rather than twice: a spy
// and a CEO have no turning step, so the move both points the piece and puts it down, and there is
// no drop left to end the turn on. The board still has to have changed — a spy that walks out and
// back onto the facing it left with has spent its steps and settled exactly where it started, so it
// is simply back on the board unselected and can be picked up and walked again.
function isPieceSettledByMove(state, { pieceId, coords }) {
	if (!pz.isSettledByMove(pz.getPieceById(pieceId, state.pieces), state.pieceState)) {
		return false;
	}

	// The very move piecesReducer is about to apply, for the same reason the drop is toggled
	// first: it is the move that commits the facing, so the board this turn leaves behind does
	// not exist until it has run.
	return pz.hasBoardChanged(pz.move(state.pieces, pieceId, coords, state.pieceState), state.piecesPrevState);
}

// Firing spends the turn the move was made in: that move is undone and play moves on.
//
// A shot taken after the mover has already passed the turn on spends nothing. Whoever is holding it
// now has not moved yet, and ending their turn for answering somebody else's move would charge them
// a turn for pressing the button — see Domain/snipeWindow.
function isSniperSelectedForSnipe(state, pieceId) {
	return pz.isSnipeShot(state, pieceId) && isAnsweringTurnHolder(state);
}

function togglePieceState(state, pieceId) {
	return isPieceBeingDropped(state, pieceId) || isSniperSelectedForSnipe(state, pieceId);
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
			return isPieceSettledByMove(state, action.payload);
		case SNIPE:
			return snipeState(state);
		default:
			return state.hasTurnEnded;
	}
}

export default hasTurnEndedReducer;
