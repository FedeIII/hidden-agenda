import withPlayersState from './players/withPlayersState';

function withState(WrappedComponent) {
  return withPlayersState(WrappedComponent);
}

export default withState;
