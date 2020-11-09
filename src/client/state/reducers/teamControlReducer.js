import { CLAIM_CONTROL, CANCEL_CONTROL, MOVE_PIECE, TOGGLE_PIECE } from 'Client/actions';
import teams from 'Domain/teams';

function piecesPrevState(state, action) {
	switch (action.type) {
		case CLAIM_CONTROL:
			return teams.claimControl(action.payload.playerName, action.payload.team, state);
		case CANCEL_CONTROL:
			return teams.cancelControl(action.payload.team, state);
		case MOVE_PIECE:
			return teams.movePieceForControl(action.payload.pieceId, state);
		case TOGGLE_PIECE:
			return teams.togglePieceForControl(action.payload.pieceId, state);
		default:
			return [...state.teamControl];
	}
}

export default piecesPrevState;
