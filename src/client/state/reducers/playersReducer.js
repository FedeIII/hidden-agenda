import { START_GAME, NEXT_TURN, SET_ALIGNMENT } from 'Client/actions';

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

function setAlignmentPlayers(players, { name, friend, foe }) {
  return players.map(player => {
    if (player.name === name) {
      return {
        ...player,
        friend: typeof friend === 'undefined' ? player.friend : friend,
        foe: typeof foe === 'undefined' ? player.foe : foe,
      };
    }

    return player;
  });
}

function playersReducer({ players }, action) {
  switch (action.type) {
    case START_GAME:
      return startGamePlayers(action.payload);
    case NEXT_TURN:
      return nextTurnPlayers(players);
    case SET_ALIGNMENT:
      return setAlignmentPlayers(players, action.payload);
    default:
      return players;
  }
}

export default playersReducer;
