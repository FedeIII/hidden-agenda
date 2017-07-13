import pieces from 'shared/pieces';
import {AGENT, CEO, SPY} from 'shared/pieceTypes';
import {TOGGLE_PIECE, MOVE_PIECE} from 'client/actions';
import {PLACEMENT, SELECTION} from 'client/pieceStates';

function toggledPieceState (selectedPiece) {
    switch (pieces.getType(selectedPiece.id)) {
        case AGENT:
            return true;
        case CEO:
            return true;
        case SPY:
            return true;
        default:
            return false;
    }

}

function movedPieceState (selectedPiece, pieceState) {
    switch (pieces.getType(selectedPiece.id)) {
        case SPY:
            return (pieceState === PLACEMENT) || ((pieceState === SELECTION) && selectedPiece.direction);
        default:
            return false;
    }
}

export default function showMoveCellsReducer (state, action) {
    const selectedPiece = pieces.getSelectedPiece(state.pieces);

    if (selectedPiece) {
        switch (action.type) {
            case TOGGLE_PIECE:
                return toggledPieceState(selectedPiece);
            case MOVE_PIECE:
                return movedPieceState(selectedPiece, state.pieceState);
            default:
                return false;
        }
    }
}
