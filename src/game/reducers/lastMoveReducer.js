import { START_GAME, NEXT_TURN, TOGGLE_PIECE, MOVE_PIECE } from 'Game/actions';
import { pz } from 'Domain/pieces';

/**
 * What the last player did, left on the board for the rest of the table to read.
 *
 * `null` when there is nothing to say. Otherwise `{ id, position, event, victim? }` — the piece that
 * moved, the cell its move ended on, which of MOVES happened there, and, for a kill, what it took.
 *
 * Everybody moves everybody's pieces here, so what the last player did is the one thing a player
 * arriving at their turn cannot work out from the board in front of them: 32 tokens changed by one,
 * and nothing on screen says which or how.
 *
 * It is written when a turn is handed on and it lasts until the board changes irreversibly under it
 * — **not** for the whole of the next turn. Looking is free: picking a piece up, pointing it, arming
 * SNIPE and claiming a team are all things that can be taken back, and none of them answers the
 * mark. Neither does revealing an alignment or accusing somebody: those cost their player something
 * real, but the pieces stand exactly where the last move left them, and this mark is about the
 * board.
 *
 * So there is no list of actions to keep in step with the game. There is one question — has the
 * board stopped being the board this turn found — asked of the very move the click is about to make.
 */

// Told apart by what a click leaves behind rather than by which click it is. A turn that has changed
// the board has committed to something; every click before that could still be undone — see
// hasTurnEndedReducer, which reads the same fact to decide a turn is a turn.
function hasCommitted(state, pieces) {
	return pz.hasBoardChanged(pieces, state.piecesPrevState);
}

function lastMoveReducer(state, action) {
	switch (action.type) {
		case START_GAME:
			return null;

		case NEXT_TURN:
			// The turn that is ending, measured against the board it found. Slices are called with
			// the state before the action, so both of those are still here to compare.
			return pz.getTurnMove(state);

		case MOVE_PIECE: {
			// The very move piecesReducer is about to apply, for the same reason hasTurnEndedReducer
			// re-runs it: what a click commits does not exist until it has.
			const { pieceId, coords } = action.payload;

			return hasCommitted(state, pz.move(state.pieces, pieceId, coords, state.pieceState)) ? null : state.lastMove;
		}

		case TOGGLE_PIECE:
			// A drop that leaves a piece facing somewhere new, and a shot that rolls a move back, both
			// change the board. A plain selection or deselection changes nothing hasBoardChanged reads,
			// so looking at what is on offer keeps the mark.
			return hasCommitted(state, pz.toggle(state, action.payload.pieceId)) ? null : state.lastMove;

		default:
			return state.lastMove;
	}
}

export default lastMoveReducer;
