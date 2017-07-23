import piecesHelper from 'shared/pieces';
import {MOVE_PIECE, DIRECT_PIECE} from 'client/actions';
import {AGENT, CEO, SPY, SNIPER} from 'shared/pieceTypes';
import {MOVEMENT, COLLOCATION} from 'client/pieceStates';

function movedPieceState ({pieces, followMouse, pieceState}) {
    const selectedPiece = piecesHelper.getSelectedPiece(pieces);

    switch (piecesHelper.getType(selectedPiece.id)) {
        case AGENT:
            return true;
        case CEO:
            return pieceState === COLLOCATION;
        case SPY:
            return pieceState === MOVEMENT;
        case SNIPER:
            return true;
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
