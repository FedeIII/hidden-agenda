import {START_GAME, NEXT_TURN} from 'client/actions';

function startedGameState (playerNames) {
    return playerNames.map((name, i) => ({
        name,
        turn: i === 0
    }));
}

function nextTurnState ({players}) {
    const currentIndex = players.findIndex(player => player.turn);
    const nextIndex = (currentIndex + 1 >= players.length) ? 0 : currentIndex + 1;
    return players.map(({name}, i) => ({
        name,
        turn: i === nextIndex
    }));
}

export default function playersReducer (state, action) {
    switch (action.type) {
        case START_GAME:
            return [].concat(startedGameState(action.payload));
        case NEXT_TURN:
            return [].concat(nextTurnState(state));
        default:
            return [].concat(state.players);
    }
}
