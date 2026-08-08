import { pz } from 'Domain/pieces';
import { TOGGLE_PIECE, MOVE_PIECE, CLAIM_CONTROL, CANCEL_CONTROL } from 'Game/actions';

/**
 * undefined === in HQ
 *
 * AGENT: SELECTION => DESELECTION
 *                  => PLACEMENT => COLLOCATION
 *                  => MOVEMENT => COLLOCATION
 *
 * SPY: SELECTION => DESELECTION
 *                => PLACEMENT => COLLOCATION
 *                => MOVEMENT => MOVEMENT2
 *                                (buffed) => MOVEMENT3
 *
 * CEO: SELECTION => DESELECTION
 *                => PLACEMENT => COLLOCATION
 *                => MOVEMENT
 *
 * The spy and the CEO are the two pieces whose move does not end in a COLLOCATION. The step sets the
 * facing, so there is nothing left to point and the piece puts itself down — pz.isSettledByMove.
 * Coming out of an HQ both go through PLACEMENT like everything else, because a piece lands there
 * with no facing at all.
 *
 * SNIPER: SELECTION => DESELECTION
 *                   => PLACEMENT => COLLOCATION
 *                   => MOVEMENT => COLLOCATION
 */

export default function pieceStateReducer(state, action) {
	let result;
	if (!state.hasTurnEnded) {
		switch (action.type) {
			case TOGGLE_PIECE:
				result = pz.togglePieceState(action.payload.pieceId, state);
				break;
			case MOVE_PIECE:
				result = pz.movedPieceState(action.payload.pieceId, state);
				break;
			case CLAIM_CONTROL:
				result = pz.claimControlPieceState(action.payload.team, state);
				break;
			case CANCEL_CONTROL:
				result = pz.cancelControlPieceState();
				break;
			default:
				result = state.pieceState;
				break;
		}
	} else {
		result = state.pieceState;
	}

	return result;
}
