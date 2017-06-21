import cells from 'shared/cells';
import pieces from 'shared/pieces';
import {TOGGLE_PIECE, MOVE_PIECE, DIRECT_PIECE} from 'client/actions';

function hasToToggle (selectedPiece, pieceId) {
    return !selectedPiece ||
            (selectedPiece && selectedPiece.id === pieceId);
}

function toggledPieceState (statePieces, pieceId) {
    const selectedPiece = pieces.getSelectedPiece(statePieces);
    if (hasToToggle(selectedPiece, pieceId)) {
        return pieces.toggle(statePieces, pieceId);
    } else {
        return statePieces;
    }
}

function movedPieceState (statePieces, {pieceId, coords}) {
    return pieces.move(statePieces, pieceId, coords);
}

function directedPieceState (statePieces, cell) {
    const selectedPiece = pieces.getSelectedPiece(statePieces);
    const direction = cells.getDirection(selectedPiece.position, cell);
    return pieces.changeSelectedPieceDirection(statePieces, direction);
}

export default function piecesReducer (state, action) {
    if (!state.turnEnded) {
        switch (action.type) {
            case TOGGLE_PIECE:
                return [].concat(
                    toggledPieceState(state.pieces, action.payload.pieceId)
                );
            case MOVE_PIECE:
                return [].concat(
                    movedPieceState(state.pieces, action.payload)
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
