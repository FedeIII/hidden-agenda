import React, { createContext, useReducer } from 'react';
import pz from 'Domain/pz';
import getWrapperName from './getWrapperName';

import players from './reducers/playersReducer';
import hasTurnEnded from './reducers/hasTurnEndedReducer';
import pieces from './reducers/piecesReducer';
import pieceState from './reducers/pieceStateReducer';
import followMouse from './reducers/followMouseReducer';
import snipe from './reducers/snipeReducer';

const reducers = {
  players,
  hasTurnEnded,
  pieces,
  pieceState,
  followMouse,
  snipe,
};

function gameReducer(state, action) {
  const newState = Object.entries(reducers).reduce(
    (newState, [stateVar, reducer]) => ({
      ...newState,
      [stateVar]: reducer(state, action),
    }),
    {},
  );

  console.log(action, '=>', newState);

  return newState;
}

const initialState = {
  players: [],
  hasTurnEnded: false,
  pieces: pz.init(),
  pieceState: undefined,
  followMouse: false,
  snipe: false,
};

const urlParams = new URLSearchParams(window.location.search);
const test = urlParams.get('test');

if (test) {
  initialState.players = [{
    name: 'fede',
    turn: true,
    friend: '0',
    foe: '1',
  }, {
    name: 'sara',
    turn: false,
    friend: '2',
    foe: '3',
  }];

  initialState.pieces = [{"id":"0-A1","position":[-1,-1],"direction":[-1,0],"selectedDirection":[-1,0],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"2-A1","moved":false},{"id":"0-A2","selected":false,"killed":false,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"moved":false},{"id":"0-A3","selected":false,"killed":false,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"moved":false},{"id":"0-A4","selected":true,"killed":false,"showMoveCells":true,"throughSniperLineOf":[],"buffed":false,"highlight":false,"moved":true,"position":[1,1],"direction":[0,0],"selectedDirection":[0,0]},{"id":"0-A5","position":[3,3],"direction":[1,0],"selectedDirection":[1,0],"selected":false,"killed":false,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"moved":false},{"id":"0-C","selected":false,"killed":false,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"moved":false},{"id":"0-S","position":[-1,-1],"direction":[1,1],"selectedDirection":[1,1],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"2-A1","moved":false},{"id":"0-N","position":[-1,-1],"direction":[1,0],"selectedDirection":[1,0],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"2-A1","moved":false},{"id":"1-A1","position":[-1,-1],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"0-A5","moved":false},{"id":"1-A2","position":[-1,-1],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"0-A5","moved":false},{"id":"1-A3","position":[-1,-1],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"0-A5","moved":false},{"id":"1-A4","position":[-1,-1],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"0-A5","moved":false},{"id":"1-A5","position":[3,5],"direction":[0,0],"selectedDirection":[0,0],"selected":false,"killed":false,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"moved":false},{"id":"1-C","position":[-1,-1],"direction":[0,0],"selectedDirection":[0,0],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"0-A5","moved":false},{"id":"1-S","position":[-1,-1],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"0-A5","moved":false},{"id":"1-N","position":[-1,-1],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"0-A5","moved":false},{"id":"2-A1","position":[-1,-1],"direction":[0,1],"selectedDirection":[0,1],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"1-A5","moved":false},{"id":"2-A2","selected":false,"killed":false,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"moved":false,"position":[6,2],"direction":[1,0],"selectedDirection":[1,0]},{"id":"2-A3","selected":false,"killed":false,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"moved":false,"position":[6,0],"direction":[1,1],"selectedDirection":[1,1]},{"id":"2-A4","selected":false,"killed":false,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"moved":false,"position":[6,1],"direction":[0,0],"selectedDirection":[0,0]},{"id":"2-A5","selected":false,"killed":false,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"moved":false,"position":[5,0],"direction":[1,1],"selectedDirection":[1,1]},{"id":"2-C","position":[1,3],"direction":[0,0],"selectedDirection":[0,0],"selected":false,"killed":false,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"moved":false},{"id":"2-S","position":[-1,-1],"direction":[0,0],"selectedDirection":[0,0],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"1-A5","moved":false},{"id":"2-N","selected":false,"killed":false,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"moved":false,"position":[5,1],"direction":[0,0],"selectedDirection":[0,0]},{"id":"3-A1","position":[-1,-1],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"0-A1","moved":false},{"id":"3-A2","position":[-1,-1],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"0-A1","moved":false},{"id":"3-A3","position":[-1,-1],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"0-A1","moved":false},{"id":"3-A4","position":[-1,-1],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"0-A1","moved":false},{"id":"3-A5","position":[-1,-1],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"0-A1","moved":false},{"id":"3-C","position":[-1,-1],"direction":[0,0],"selectedDirection":[0,0],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"0-A1","moved":false},{"id":"3-S","position":[-1,-1],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"0-A1","moved":false},{"id":"3-N","position":[-1,-1],"selected":false,"killed":true,"showMoveCells":false,"throughSniperLineOf":[],"buffed":false,"highlight":false,"killedById":"0-A1","moved":false}];

  initialState.test = true;
}

export const StateContext = createContext(null);

export function withState(WrappedComponent) {
  function WithState(props) {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    return (
      <StateContext.Provider value={[state, dispatch]}>
        <WrappedComponent {...props} />
      </StateContext.Provider>
    );
  }

  WithState.displayName = getWrapperName('WithState', WrappedComponent);

  return WithState;
}
