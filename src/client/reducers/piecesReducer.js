import {TOGGLE_PIECE, MOVE_PIECE} from 'client/actions';

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
            piece.selected = false;
        }

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
        default:
            return state.pieces;
    }
}
