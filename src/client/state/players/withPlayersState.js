import React, { useReducer } from 'react';
import playersReducer from './playersReducer';
import PlayersState from './playersState';
import getWrapperName from '../getWrapperName';

function withPlayersState(WrappedComponent) {
  function WithPlayersState(props) {
    const [players, dispatch] = useReducer(playersReducer, []);

    return (
      <PlayersState.Provider value={[players, dispatch]}>
        <WrappedComponent {...props} />
      </PlayersState.Provider>
    );
  }

  WithPlayersState.displayName = getWrapperName(WrappedComponent);

  return WithPlayersState;
}

export default withPlayersState;
