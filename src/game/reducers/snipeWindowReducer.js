import { START_GAME, NEXT_TURN, MOVE_PIECE, TOGGLE_PIECE } from 'Game/actions';
import { pz } from 'Domain/pieces';
import { open, isAnsweringTurnHolder } from 'Domain/snipeWindow';

// What is on the table for the rest of the players to answer. See Domain/snipeWindow for what the
// slice holds and why the two facts in it cannot be read off the board.
function snipeWindowReducer(state, action) {
	switch (action.type) {
		case START_GAME:
			return null;

		case MOVE_PIECE: {
			// The very move piecesReducer is about to apply, for the same reason hasTurnEndedReducer
			// re-runs it: the marks a shot is read from do not exist until it has. Moving is also what
			// shuts a shot the previous turn left — pz.move wipes the marks it did not make, so one
			// reading answers both halves of the rule.
			const moved = pz.move(state.pieces, action.payload.pieceId, action.payload.coords, state.pieceState);

			return pz.isAnyPieceThroughSniperLine(moved) ? open(state) : null;
		}

		case TOGGLE_PIECE:
			// Taken. Selecting and deselecting are deliberately not in here: they change nothing on
			// the board, so they are not the move that closes the window.
			return pz.isSnipeShot(state, action.payload.pieceId) ? null : state.snipeWindow;

		case NEXT_TURN:
			return isAnsweringTurnHolder(state) ? state.snipeWindow : null;

		default:
			return state.snipeWindow;
	}
}

export default snipeWindowReducer;
