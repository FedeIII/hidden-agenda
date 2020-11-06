import { pz } from 'Domain/pieces';
import { TOGGLE_PIECE, MOVE_PIECE } from 'Client/actions';

function toggledPieceState(pieceId, state) {
	return pz.togglePieceState(pieceId, state);
}

function movedPieceState(pieceId, state) {
  return pz.movedPieceState(pieceId, state);
}

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
				result = toggledPieceState(action.payload.pieceId, state);
				break;
			case MOVE_PIECE:
				result = movedPieceState(action.payload.pieceId, state);
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
