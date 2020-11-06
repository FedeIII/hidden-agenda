import { NEXT_TURN } from 'Client/actions';

function piecesPrevState(state, action) {
	switch (action.type) {
		case NEXT_TURN:
			return [...state.pieces];
		default:
			return [...state.piecesPrevState];
	}
}

export default piecesPrevState;
