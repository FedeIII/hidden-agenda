import { SNIPE, NEXT_TURN, TOGGLE_PIECE } from 'Game/actions';
import { pz } from 'Domain/pieces';

function snipeState(pieces) {
	return pieces.some(piece => pz.isInSniperSight(piece));
}

export default function snipeReducer(state, action) {
	switch (action.type) {
		case SNIPE:
			// A toggle. Arming it is what stops the turn being passed, so there has to be a way to
			// put it away again that is not "take the shot".
			return state.snipe ? false : snipeState(state.pieces);
		case TOGGLE_PIECE:
			// Fired: there is nothing left armed. This used to stay true until the next NEXT_TURN,
			// which was harmless only for as long as a shot could not outlive the turn it answers —
			// an armed snipe is exactly the state in which nothing can be picked up, so a shot taken
			// during somebody else's turn left that player frozen out of a turn they had not used.
			return pz.isSnipeShot(state, action.payload.pieceId) ? false : state.snipe;
		case NEXT_TURN:
			return false;
		default:
			return state.snipe;
	}
}
