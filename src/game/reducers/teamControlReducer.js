import { CLAIM_CONTROL, CANCEL_CONTROL, MOVE_PIECE, REMOVE_PLAYER, REVEAL_FRIEND, REVEAL_FOE } from 'Game/actions';
import teams from 'Domain/teams';

function teamControlReducer(state, action) {
	switch (action.type) {
		case CLAIM_CONTROL:
			return teams.claimControl(action.payload.playerName, action.payload.team, state);
		case REMOVE_PLAYER:
			return teams.releasePlayer(action.payload.name, state);
		case CANCEL_CONTROL:
			return teams.cancelControl(action.payload.team, state);
		case MOVE_PIECE:
			return teams.movePieceForControl(action.payload.pieceId, state);
		case REVEAL_FRIEND:
			return teams.revealFriend(state.players, state);
		case REVEAL_FOE:
			return teams.revealFoe(state.players, state);
		default:
			return state.teamControl;
	}
}

export default teamControlReducer;
