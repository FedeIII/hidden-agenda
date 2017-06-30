import {MOVE_PIECE, DIRECT_PIECE} from 'client/actions';
import pieces from 'shared/pieces';

export default function followMouseReducer (state, action) {
    switch (action.type) {
        case MOVE_PIECE:
            return true;
        case DIRECT_PIECE:
            return true;
        default:
            return false;
    }
}
