import pz from 'Domain/pz';
import { MOVE_PIECE, DIRECT_PIECE } from 'Client/actions';
import { AGENT, CEO, SPY, SNIPER } from 'Domain/pieceTypes';
import { MOVEMENT, COLLOCATION } from 'Client/pieceStates';

function movedPieceState({ pieces, followMouse, pieceState }) {
  const selectedPiece = pz.getSelectedPiece(pieces);

  switch (pz.getType(selectedPiece.id)) {
    case AGENT:
      return true;
    case CEO:
      return pieceState === COLLOCATION;
    case SPY:
      return false;
    case SNIPER:
      return true;
    default:
      return followMouse;
  }
}

export default function followMouseReducer(state, action) {
  switch (action.type) {
    case MOVE_PIECE:
      return movedPieceState(state);
    case DIRECT_PIECE:
      return true;
    default:
      return false;
  }
}
