import cells from 'shared/cells';
import pieces from 'shared/pieces';
import {TOGGLE_PIECE, MOVE_PIECE, DIRECT_PIECE} from 'client/actions';

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
    return statePieces.map(piece => {
        if (piece.id === pieceId) {
            if (!piece.position) {
                piece.direction = [1, 0];
            }

            piece.position = coords;
        }

        return piece;
    });
}

function directedPieceState (statePieces, {selectedPiece, cell}) {
    const direction = cells.getDirection(selectedPiece.position, cell);
    return pieces.changeSelectedPieceDirection(statePieces, direction);
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
        default:
            return state.pieces;
    }
}
