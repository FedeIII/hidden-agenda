import {combineReducers} from 'redux';
import {TOGGLE_PIECE, MOVE_PIECE} from './actions';

function createPiece (id) {
    return {
        id,
        position: null,
        direction: null,
        selected: false
    }
}

const pieceIds = [
    '0-A1', '0-A2', '0-A3', '0-A4', '0-A5',
    '1-A1', '1-A2', '1-A3', '1-A4', '1-A5',
    '2-A1', '2-A2', '2-A3', '2-A4', '2-A5',
    '3-A1', '3-A2', '3-A3', '3-A4', '3-A5'
];

const initialState = pieceIds.map(id => createPiece(id));

function toggledPieceState (state, pieceId) {
    return state.map(piece => {
        if (piece.id === pieceId) {
            piece.selected = !piece.selected;
        } else {
            piece.selected = false;
        }

        return piece;
    });
}

function movedPieceState (state, {pieceId, coords}) {
    return state.map(piece => {
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

export default function gameReducer (state = initialState, action = {}) {
    switch (action.type) {
        case TOGGLE_PIECE:
            return [].concat(
                toggledPieceState(state, action.payload.pieceId)
            );
        case MOVE_PIECE:
            return [].concat(
                movedPieceState(state, action.payload)
            );
        default:
            return state;
    }
}
