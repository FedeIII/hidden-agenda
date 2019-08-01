function startGamePlayers(playerNames) {
  return playerNames.map((name, i) => ({
    name,
    turn: i === 0,
  }));
}

function nextTurnPlayers(players) {
  const currentIndex = players.findIndex(player => player.turn);
  const nextIndex = currentIndex + 1 >= players.length ? 0 : currentIndex + 1;
  return players.map(({ name }, i) => ({
    name,
    turn: i === nextIndex,
  }));
}

function playersReducer(state, action) {
  switch (action.type) {
    case 'create players':
      return startGamePlayers(action.payload);
    case 'next turn':
      return nextTurnPlayers(state);
    default:
      throw state;
  }
}

export default playersReducer;
