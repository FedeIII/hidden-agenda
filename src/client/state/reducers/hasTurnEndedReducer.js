import {
  START_GAME,
  NEXT_TURN,
  TOGGLE_PIECE,
  MOVE_PIECE,
} from 'Client/actions';

function hasTurnEndedReducer(state, action) {
  switch (action.type) {
    case NEXT_TURN:
      return false;
    case START_GAME:
      return false;
    default:
      return state;
  }
}

export default hasTurnEndedReducer;
