import cells from 'shared/cells';
import pz from 'shared/pz';
import {TOGGLE_PIECE, MOVE_PIECE, DIRECT_PIECE} from 'client/actions';

function hasToToggle (selectedPiece, pieceId) {
    return !selectedPiece ||
            (selectedPiece && selectedPiece.id === pieceId);
}

function toggledPieceState (pieces, pieceId) {
    const selectedPiece = pz.getSelectedPiece(pieces);
    if (hasToToggle(selectedPiece, pieceId)) {
        return pz.toggle(pieces, pieceId);
    } else {
        return pieces;
    }
}

function movedPieceState (state, {pieceId, coords}) {
    return pz.move(state.pieces, pieceId, coords, state.snipe);
}

function directedPieceState (pieces, direction) {
    return pz.changeSelectedPieceDirection(pieces, direction);
}

export default function piecesReducer (state, action) {
    if (!state.hasTurnEnded) {
        switch (action.type) {
            case TOGGLE_PIECE:
                return [].concat(
                    toggledPieceState(state.pieces, action.payload.pieceId)
                );
            case MOVE_PIECE:
                return [].concat(
                    movedPieceState(state, action.payload)
                );
            case DIRECT_PIECE:
                return [].concat(
                    directedPieceState(state.pieces, action.payload)
                );
            default:
                return [].concat(state.pieces);
        }
    }

    return [].concat(state.pieces);
}
