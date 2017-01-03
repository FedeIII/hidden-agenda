import {TOGGLE_PIECE, MOVE_PIECE} from 'client/actions';

export default function followMouseReducer (state, action) {
    switch (action.type) {
        case TOGGLE_PIECE:
            return false;
        case MOVE_PIECE:
            return true;
        default:
            return false;
    }
}
