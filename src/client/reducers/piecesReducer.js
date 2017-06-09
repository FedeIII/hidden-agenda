import cells from 'shared/cells';
import pieces from 'shared/pieces';
import {TOGGLE_PIECE, MOVE_PIECE, DIRECT_PIECE, SET_DIRECTION} from 'client/actions';

function toggledPieceState (statePieces, pieceId) {
    return statePieces.map(piece => {
        if (piece.id === pieceId) {
            piece.selected = !piece.selected;
        } else {
            piece.selected = false;
        }

        return piece;
    });
}

function movedPieceState (statePieces, {pieceId, coords}) {
    return pieces.move(statePieces, pieceId, coords);
}

function directedPieceState (statePieces, cell) {
    const selectedPiece = pieces.getSelectedPiece(statePieces);
    const direction = cells.getDirection(selectedPiece.position, cell);
    return pieces.changeSelectedPieceDirection(statePieces, direction);
}

function setDirectionState (statePieces) {
    return statePieces.map(piece => {
        piece.selected = false;
        return piece;
    });
}

export default function piecesReducer (state, action) {
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
        case SET_DIRECTION:
            return [].concat(
                setDirectionState(state.pieces)
            );
        default:
            return state.pieces;
    }
}
