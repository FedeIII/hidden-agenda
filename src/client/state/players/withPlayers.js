import React, { useReducer } from 'react';
import playersReducer from './playersReducer';
import { Players, PlayersDispatch } from './playersProviders';
import getWrapperName from '../getWrapperName';

function withPlayersState(WrappedComponent) {
  function WithPlayersState(props) {
    const [players, dispatch] = useReducer(playersReducer, []);

    return (
      <Players.Provider value={players}>
        <PlayersDispatch.Provider value={dispatch}>
          <WrappedComponent {...props} />
        </PlayersDispatch.Provider>
      </Players.Provider>
    );
  }

  WithPlayersState.displayName = getWrapperName(WrappedComponent);

  return WithPlayersState;
}

export default withPlayersState;
