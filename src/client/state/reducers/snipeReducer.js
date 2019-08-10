import { SNIPE, NEXT_TURN } from 'Client/actions';
import pz from 'Domain/pz';

function snipeState(pieces) {
  return pieces.some(piece => pz.isInSniperSight(piece));
}

export default function snipeReducer(state, action) {
  switch (action.type) {
    case SNIPE:
      return snipeState(state.pieces);
    case NEXT_TURN:
      return false;
    default:
      return state.snipe;
  }
}
