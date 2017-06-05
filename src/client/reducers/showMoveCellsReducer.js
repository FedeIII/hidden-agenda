import {TOGGLE_PIECE, MOVE_PIECE, DIRECT_PIECE} from 'client/actions';

export default function showMoveCellsReducer (state, action) {
    switch (action.type) {
        case TOGGLE_PIECE:
            return !!state.pieces.find(piece => !piece.position);
        case MOVE_PIECE:
            return false;
        default:
            return false;
    }
}
