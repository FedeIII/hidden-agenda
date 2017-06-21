import {START_GAME, NEXT_TURN, TOGGLE_PIECE} from 'client/actions';

function isPieceBeingDropped ({hasTurnEnded, followMouse}) {
    return hasTurnEnded || followMouse;
}

export default function hasTurnEndedReducer (state, action) {
    switch (action.type) {
        case NEXT_TURN:
            return false;
        case START_GAME:
            return false;
        case TOGGLE_PIECE:
            return isPieceBeingDropped(state);
        default:
            return state.hasTurnEnded;
    }
}
