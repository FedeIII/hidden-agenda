import pz from 'Domain/pz';
import { SPY } from 'Domain/pieceTypes';
import { TOGGLE_PIECE, MOVE_PIECE } from 'Client/actions';
import {
  SELECTION,
  DESELECTION,
  PLACEMENT,
  MOVEMENT,
  MOVEMENT2,
  MOVEMENT3,
  COLLOCATION,
} from 'Client/pieceStates';

function toggledPieceState(pieceId, { pieces, followMouse, pieceState }) {
  const selectedPiece = pz.getSelectedPiece(pieces);

  if (!!selectedPiece && selectedPiece.id !== pieceId) {
    return pieceState;
  }

  if (followMouse) {
    return COLLOCATION;
  }

  const toggledPiece = pz.getPieceById(pieceId, pieces);

  if (toggledPiece.selected) {
    if (pz.isSniper(toggledPiece.id) && !!toggledPiece.position) {
      return MOVEMENT;
    }

    return SELECTION;
  }

  return DESELECTION;
}

function getMovedSpyState(spy, pieceState) {
  if (spy.buffed) {
    return pieceState === MOVEMENT
      ? MOVEMENT2
      : pieceState === MOVEMENT2
      ? MOVEMENT3
      : MOVEMENT;
  }

  return pieceState === MOVEMENT ? MOVEMENT2 : MOVEMENT;
}

function movedPieceState(pieceId, { pieces, pieceState }) {
  const movedPiece = pz.getPieceById(pieceId, pieces);
  if (!movedPiece.direction) {
    return PLACEMENT;
  }

  switch (pz.getType(movedPiece.id)) {
    case SPY:
      return getMovedSpyState(movedPiece, pieceState);
    default:
      return MOVEMENT;
  }
}

/**
 * undefined === in HQ
 *
 * AGENT: SELECTION => DESELECTION
 *                  => PLACEMENT => COLLOCATION
 *                  => MOVEMENT => COLLOCATION
 *
 * SPY: SELECTION => DESELECTION
 *                => PLACEMENT => COLLOCATION
 *                => MOVEMENT => MOVEMENT2 => COLLOCATION
 *                                (buffed) => MOVEMENT3 => COLLOCATION
 *
 * CEO: SELECTION => DESELECTION
 *                => PLACEMENT => COLLOCATION
 *                => MOVEMENT => DESELECTION
 *
 * SNIPER: SELECTION => DESELECTION
 *                   => PLACEMENT => COLLOCATION
 *                   => MOVEMENT => COLLOCATION
 */

export default function pieceStateReducer(state, action) {
  let result;
  if (!state.hasTurnEnded) {
    switch (action.type) {
      case TOGGLE_PIECE:
        result = toggledPieceState(action.payload.pieceId, state);
        break;
      case MOVE_PIECE:
        result = movedPieceState(action.payload.pieceId, state);
        break;
      default:
        result = state.pieceState;
        break;
    }
  } else {
    result = state.pieceState;
  }

  return result;
}
