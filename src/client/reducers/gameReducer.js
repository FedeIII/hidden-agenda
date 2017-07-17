import {combineReducers} from 'redux';
import pieces from 'shared/pieces';
import {TOGGLE_PIECE, MOVE_PIECE} from 'client/actions';
import phaseReducer from 'reducers/phaseReducer';
import playersReducer from 'reducers/playersReducer';
import hasTurnEndedReducer from 'reducers/hasTurnEndedReducer';
import piecesReducer from 'reducers/piecesReducer';
import pieceStateReducer from 'reducers/pieceStateReducer';
import followMouseReducer from 'reducers/followMouseReducer';

const initialState = {
    phase: 'start',
    players: [],
    hasTurnEnded: undefined,
    pieces: pieces.init(),
    pieceState: undefined,
    followMouse: false
};

export default function gameReducer (state = initialState, action = {}) {
    return {
        phase: phaseReducer(state, action),
        players: playersReducer(state, action),
        hasTurnEnded: hasTurnEndedReducer(state, action),
        pieces: piecesReducer(state, action),
        pieceState: pieceStateReducer(state, action),
        followMouse: followMouseReducer(state, action)
    };
}
