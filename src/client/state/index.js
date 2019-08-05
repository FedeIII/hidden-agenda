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
