import { MOVE_PIECE, DIRECT_PIECE } from 'Game/actions';
import { pz, TYPES } from 'Domain/pieces';

const { AGENT, CEO, SPY, SNIPER } = TYPES;

function movedPieceState({ pieces, followMouse }) {
	const selectedPiece = pz.getSelectedPiece(pieces);

	switch (pz.getType(selectedPiece.id)) {
		case AGENT:
			return true;
		// Neither is ever aimed after a move: both face the way they just went and the move puts them
		// down — pz.isSettledByMove. Out of an HQ they land with no facing at all and are pointed by
		// hand, which is a hover, and a hover sets this itself through DIRECT_PIECE.
		case CEO:
		case SPY:
			return false;
		case SNIPER:
			return true;
		default:
			return followMouse;
	}
}

export default function followMouseReducer(state, action) {
	switch (action.type) {
		case MOVE_PIECE:
			return movedPieceState(state);
		case DIRECT_PIECE:
			return true;
		default:
			return false;
	}
}
