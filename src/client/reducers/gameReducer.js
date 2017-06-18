import {combineReducers} from 'redux';
import pieces from 'shared/pieces';
import {TOGGLE_PIECE, MOVE_PIECE} from 'client/actions';
import piecesReducer from 'reducers/piecesReducer';
import followMouseReducer from 'reducers/followMouseReducer';
import showMoveCellsReducer from 'reducers/showMoveCellsReducer';

const initialState = {
    pieces: pieces.init(),
    followMouse: false,
    showMoveCells: false
};

export default function gameReducer (state = initialState, action = {}) {
    return {
        pieces: piecesReducer(state, action),
        followMouse: followMouseReducer(state, action),
        showMoveCells: showMoveCellsReducer(state, action)
    };
}
