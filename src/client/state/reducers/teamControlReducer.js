import { CLAIM_CONTROL } from 'Client/actions';
import teams from 'Domain/teams';

function piecesPrevState(state, action) {
	switch (action.type) {
		case CLAIM_CONTROL:
			const { playerName, team } = action.payload;
			return teams.claimControl(playerName, team, state);
		default:
			return [...state.teamControl];
	}
}

export default piecesPrevState;
