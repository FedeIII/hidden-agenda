import {combineReducers} from 'redux';
import pieces from 'shared/pieces';
import {TOGGLE_PIECE, MOVE_PIECE} from 'client/actions';
import phaseReducer from 'reducers/phaseReducer';
import playersReducer from 'reducers/playersReducer';
import turnEndedReducer from 'reducers/turnEndedReducer';
import piecesReducer from 'reducers/piecesReducer';
import followMouseReducer from 'reducers/followMouseReducer';
import showMoveCellsReducer from 'reducers/showMoveCellsReducer';

const initialState = {
    phase: 'start',
    players: [],
    turnEnded: undefined,
    pieces: pieces.init(),
    followMouse: false,
    showMoveCells: false
};

export default function gameReducer (state = initialState, action = {}) {
    return {
        phase: phaseReducer(state, action),
        players: playersReducer(state, action),
        turnEnded: turnEndedReducer(state, action),
        pieces: piecesReducer(state, action),
        followMouse: followMouseReducer(state, action),
        showMoveCells: showMoveCellsReducer(state, action)
    };
}
