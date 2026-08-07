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
 * The spy is the one piece whose walk does not end in a COLLOCATION. Its last step sets its facing,
 * so there is nothing left to point and it puts itself down — pz.isSettledByMove. Coming out of an
 * HQ it goes through PLACEMENT like everything else, because it lands there with no facing at all.
 *
 * CEO: SELECTION => DESELECTION
 *                => PLACEMENT => COLLOCATION
 *                => MOVEMENT => DESELECTION
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
