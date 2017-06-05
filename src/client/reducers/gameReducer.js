import {combineReducers} from 'redux';

import {TOGGLE_PIECE, MOVE_PIECE} from 'client/actions';
import piecesReducer from 'reducers/piecesReducer';
import followMouseReducer from 'reducers/followMouseReducer';
import showMoveCellsReducer from 'reducers/showMoveCellsReducer';
import mousePositionReducer from 'reducers/mousePositionReducer';

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

const initialState = {
    pieces: pieceIds.map(id => createPiece(id)),
    followMouse: false,
    showMoveCells: false,
    mousePosition: null
};

export default function gameReducer (state = initialState, action = {}) {
    return {
        pieces: piecesReducer(state, action),
        followMouse: followMouseReducer(state, action),
        showMoveCells: showMoveCellsReducer(state, action),
        mousePosition: mousePositionReducer(state, action)
    };
}
