import {MOVE_PIECE, DIRECT_PIECE} from 'client/actions';
import pieces from 'shared/pieces';

function directedPieceState (statePieces) {
    const selectedPiece = pieces.getSelectedPiece(statePieces);
    return !pieces.isPieceBlocked(selectedPiece, statePieces);
}

export default function followMouseReducer (state, action) {
    switch (action.type) {
        case MOVE_PIECE:
            return true;
        case DIRECT_PIECE:
            return directedPieceState(state.pieces);
        default:
            return false;
    }
}
