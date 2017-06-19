import {START_GAME, END_TURN} from 'client/actions';

function endedTurnState ({players, turn}) {
    const currentIndex = players.findIndex(player => player === turn);
    const nextIndex = (currentIndex + 1 >= players.length) ? 0 : currentIndex + 1;
    return players[nextIndex];
}

export default function playersReducer (state, action) {
    switch (action.type) {
        case END_TURN:
            return endedTurnState(state);
        case START_GAME:
            return action.payload[0];
        default:
            return state.turn;
    }
}
