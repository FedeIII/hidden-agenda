import { SNIPE, NEXT_TURN } from 'Game/actions';
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
		case NEXT_TURN:
			return false;
		default:
			return state.snipe;
	}
}
