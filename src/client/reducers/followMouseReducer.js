import piecesHelper from 'shared/pieces';
import {MOVE_PIECE, DIRECT_PIECE} from 'client/actions';
import {AGENT, CEO, SPY} from 'shared/pieceTypes';
import {MOVEMENT} from 'client/pieceStates';

function movedPieceState ({pieces, followMouse, pieceState}) {
    const selectedPiece = piecesHelper.getSelectedPiece(pieces);

    switch (piecesHelper.getType(selectedPiece.id)) {
        case AGENT:
            return true;
        case CEO:
            return true;
        case SPY:
            return pieceState === MOVEMENT;
        default:
            return followMouse;
    }
}

export default function followMouseReducer (state, action) {
    switch (action.type) {
        case MOVE_PIECE:
            return movedPieceState(state);
        case DIRECT_PIECE:
            return true;
        default:
            return false;
    }
}
