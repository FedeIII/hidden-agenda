import { pz } from 'Domain/pieces';
import { TOGGLE_PIECE, MOVE_PIECE, CLAIM_CONTROL, CANCEL_CONTROL } from 'Client/actions';

/**
 * undefined === in HQ
 *
 * AGENT: SELECTION => DESELECTION
 *                  => PLACEMENT => COLLOCATION
 *                  => MOVEMENT => COLLOCATION
 *
 * SPY: SELECTION => DESELECTION
 *                => PLACEMENT => COLLOCATION
 *                => MOVEMENT => MOVEMENT2 => COLLOCATION
 *                                (buffed) => MOVEMENT3 => COLLOCATION
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
