import React, { useReducer } from 'react';
import hasTurnEndedReducer from './hasTurnEndedReducer';
import { HasTurnEnded, HasTurnEndedDispatch } from './hasTurnEndedProviders';
import getWrapperName from '../getWrapperName';

function withHasTurnEndedState(WrappedComponent) {
  function WithHasTurnEndedState(props) {
    const [hasTurnEnded, dispatch] = useReducer(hasTurnEndedReducer, []);

    return (
      <HasTurnEnded.Provider value={hasTurnEnded}>
        <HasTurnEndedDispatch.Provider value={dispatch}>
          <WrappedComponent {...props} />
        </HasTurnEndedDispatch.Provider>
      </HasTurnEnded.Provider>
    );
  }

  WithHasTurnEndedState.displayName = getWrapperName(WrappedComponent);

  return WithHasTurnEndedState;
}

export default withHasTurnEndedState;
