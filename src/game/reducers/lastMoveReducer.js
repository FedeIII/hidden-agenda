import { START_GAME, NEXT_TURN, TOGGLE_PIECE } from 'Game/actions';
import { pz } from 'Domain/pieces';

/**
 * What the last player did, left on the board for the rest of the table to read.
 *
 * `null` when there is nothing to say. Otherwise `{ id, position }` — the piece that moved and the
 * cell its move ended on.
 *
 * Everybody moves everybody's pieces here, so which piece just moved is the one thing a player
 * arriving at their turn cannot work out from the board in front of them: 32 tokens changed by one,
 * and nothing on screen says which. It is written when a turn is handed on and replaced when the
 * next one is, because that is the whole of what it claims — the move the table has just been shown.
 *
 * Deliberately not cleared by the new player's own move. The mark answers "what did the last player
 * do", and that question is worth asking right up to the moment you commit your own answer to it.
 */
function lastMoveReducer(state, action) {
	switch (action.type) {
		case START_GAME:
			return null;

		case NEXT_TURN:
			// The turn that is ending, measured against the board it found. Slices are called with
			// the state before the action, so both of those are still here to compare.
			return pz.getTurnMove(state.pieces, state.piecesPrevState);

		case TOGGLE_PIECE:
			// A shot undoes the move it answers, so the mark naming that move goes with it. Every
			// other toggle is a selection or a drop inside the current turn, which this slice is
			// not about.
			return pz.isSnipeShot(state, action.payload.pieceId) ? null : state.lastMove;

		default:
			return state.lastMove;
	}
}

export default lastMoveReducer;
