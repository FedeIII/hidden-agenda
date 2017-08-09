import {combineReducers} from 'redux';
import pz from 'shared/pz';
import {TOGGLE_PIECE, MOVE_PIECE} from 'client/actions';
import phaseReducer from 'reducers/phaseReducer';
import playersReducer from 'reducers/playersReducer';
import hasTurnEndedReducer from 'reducers/hasTurnEndedReducer';
import piecesReducer from 'reducers/piecesReducer';
import pieceStateReducer from 'reducers/pieceStateReducer';
import followMouseReducer from 'reducers/followMouseReducer';
import snipeReducer from 'reducers/snipeReducer';

const initialState = {
    phase: 'start',
    players: [],
    hasTurnEnded: undefined,
    pieces: pz.init(),
    pieceState: undefined,
    followMouse: false,
    snipe: false
};

export default function gameReducer (state = initialState, action = {}) {
    return {
        phase: phaseReducer(state, action),
        players: playersReducer(state, action),
        hasTurnEnded: hasTurnEndedReducer(state, action),
        pieces: piecesReducer(state, action),
        pieceState: pieceStateReducer(state, action),
        followMouse: followMouseReducer(state, action),
        snipe: snipeReducer(state, action)
    };
}
