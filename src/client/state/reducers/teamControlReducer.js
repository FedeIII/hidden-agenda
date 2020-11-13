import { CLAIM_CONTROL, CANCEL_CONTROL, MOVE_PIECE, TOGGLE_PIECE, REVEAL_FRIEND, REVEAL_FOE } from 'Client/actions';
import teams from 'Domain/teams';

function teamControlReducer(state, action) {
	switch (action.type) {
		case CLAIM_CONTROL:
			return teams.claimControl(action.payload.playerName, action.payload.team, state);
		case CANCEL_CONTROL:
			return teams.cancelControl(action.payload.team, state);
		case MOVE_PIECE:
			return teams.movePieceForControl(action.payload.pieceId, state);
		// case TOGGLE_PIECE:
		// 	return teams.togglePieceForControl(action.payload.pieceId, state);
		case REVEAL_FRIEND:
			return teams.revealFriend(action.payload.players, state);
		case REVEAL_FOE:
		return teams.revealFoe(action.payload.players, state);
		default:
			return state.teamControl;
	}
}

export default teamControlReducer;
