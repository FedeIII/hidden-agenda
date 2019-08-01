import React, { useContext } from 'react';

import State from './';

import { PlayersDispatch } from './players/playersProviders';
import { HasTurnEndedDispatch } from './hasTurnEnded/hasTurnEndedProviders';

import withPlayers from './players/withPlayers';
import withHasTurnEnded from './hasTurnEnded/withHasTurnEnded';

import getWrapperName from './getWrapperName';

function withState(WrappedComponent) {
  function WithState(props) {
    const playersDispatch = useContext(PlayersDispatch);
    const hasTurnEndedDispatch = useContext(HasTurnEndedDispatch);

    function dispatch(action) {
      playersDispatch(action);
      hasTurnEndedDispatch(action);
    }

    return (
      <State.Provider value={dispatch}>
        <WrappedComponent {...props}>{props.children}</WrappedComponent>
      </State.Provider>
    );
  }

  WithState.displayName = getWrapperName(WrappedComponent);

  return withPlayers(withHasTurnEnded(WithState));
}

export default withState;
