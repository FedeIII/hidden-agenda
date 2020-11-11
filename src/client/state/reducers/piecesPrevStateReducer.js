import { NEXT_TURN } from 'Client/actions';

function piecesPrevStateReducer(state, action) {
	switch (action.type) {
		case NEXT_TURN:
			return [...state.pieces];
		default:
			return state.piecesPrevState;
	}
}

export default piecesPrevStateReducer;
