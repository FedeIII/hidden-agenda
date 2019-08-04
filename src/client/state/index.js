import React, { createContext, useReducer } from 'react';
// import pz from 'Shared/pz';
import getWrapperName from './getWrapperName';

import players from './reducers/playersReducer';
import hasTurnEnded from './reducers/hasTurnEndedReducer';
// import pieces from './reducers/piecesReducer';

const reducers = {
  players,
  hasTurnEnded,
  // pieces,
};

function gameReducer(state, action) {
  return Object.entries(reducers).reduce(
    (newState, [stateVar, reducer]) => ({
      ...newState,
      [stateVar]: reducer(state, action),
    }),
    {},
  );
}

const initialState = {
  players: [],
  hasTurnEnded: false,
  // Pieces: [],
  // Pieces: pz.init(),
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