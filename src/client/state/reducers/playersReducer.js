import { START_GAME, NEXT_TURN, SET_ALIGNMENT, REVEAL_FRIEND, REVEAL_FOE, ACCUSE } from 'Client/actions';
import py from 'Domain/py';

function playersReducer({ players }, action) {
	switch (action.type) {
		case START_GAME:
			return py.init(action.payload);
		case NEXT_TURN:
			return py.nextTurn(players);
		case SET_ALIGNMENT:
			const { name, friend, foe } = action.payload;
			return py.setAlignment(players, name, friend, foe);
		case REVEAL_FRIEND:
			return py.revealFriend(action.payload.players);
		case REVEAL_FOE:
			return py.revealFoe(action.payload.players);
		case ACCUSE:
			return py.accuse(action.payload, players);
		default:
			return players;
	}
}

export default playersReducer;
