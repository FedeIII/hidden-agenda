import pz from 'Shared/pz';
import { SPY } from 'Shared/pieceTypes';
import { TOGGLE_PIECE, MOVE_PIECE } from 'Client/actions';
import {
  SELECTION,
  DESELECTION,
  PLACEMENT,
  MOVEMENT,
  MOVEMENT2,
  COLLOCATION,
} from 'Client/pieceStates';

function toggledPieceState(pieceId, { pieces, followMouse }) {
  const { selected } = pz.getPieceById(pieceId, pieces);
  if (followMouse) {
    return COLLOCATION;
  }

  if (selected) {
    return SELECTION;
  }

  return DESELECTION;
}

function movedPieceState(pieceId, { pieces, pieceState }) {
  const movedPiece = pz.getPieceById(pieceId, pieces);
  if (!movedPiece.direction) {
    return PLACEMENT;
  }

  switch (pz.getType(movedPiece.id)) {
    case SPY:
      return pieceState === MOVEMENT ? MOVEMENT2 : MOVEMENT;
    default:
      return MOVEMENT;
  }
}

export default function pieceStateReducer(state, action) {
  if (!state.hasTurnEnded) {
    switch (action.type) {
      case TOGGLE_PIECE:
        return toggledPieceState(action.payload.pieceId, state);
      case MOVE_PIECE:
        return movedPieceState(action.payload.pieceId, state);
      default:
        return state.pieceState;
    }
  }

  return state.pieceState;
}
