import {TOGGLE_PIECE, MOVE_PIECE, DIRECT_PIECE} from 'client/actions';
import piecesHelper from 'shared/pieces';
import {
    SELECTION, DESELECTION, PLACEMENT, MOVEMENT, DIRECTION, COLLOCATION
} from 'client/pieceStates';

function toggledPieceState (pieceId, {pieces, followMouse}) {
    const {selected} = piecesHelper.getPieceById(pieceId, pieces);
    if (followMouse) {
        return COLLOCATION;
    }

    if (selected) {
        return SELECTION;
    }

    return DESELECTION;
}

function movedPieceState (pieceId, statePieces) {
    const {position} = piecesHelper.getPieceById(pieceId, statePieces);
    if (position) {
        return PLACEMENT;
    }

    return MOVEMENT;
}

export default function pieceStateReducer (state, action) {
    if (!state.hasTurnEnded) {
        switch (action.type) {
            case TOGGLE_PIECE:
                return toggledPieceState(action.payload.pieceId, state);
            case MOVE_PIECE:
                return movedPieceState(action.payload.pieceId, state.pieces);
            case DIRECT_PIECE:
                return DIRECTION;
            default:
                return state.pieceState;
        }
    }

    return state.pieceState;
}
