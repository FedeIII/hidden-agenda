import {
  START_GAME,
  NEXT_TURN,
  TOGGLE_PIECE,
  MOVE_PIECE,
  SNIPE,
} from 'Client/actions';
import { pz, TYPES, STATES } from 'Domain/pieces';

const { AGENT, CEO, SPY, SNIPER } = TYPES;
const { MOVEMENT, MOVEMENT2, MOVEMENT3, PLACEMENT } = STATES;

function hasPieceEndedTurn(pieces, pieceState, toggledPieceId) {
  const selectedPiece = pz.getSelectedPiece(pieces);

  if (selectedPiece && selectedPiece.id === toggledPieceId) {
    switch (pz.getType(selectedPiece.id)) {
      case AGENT:
        return pieceState === PLACEMENT || pieceState === MOVEMENT;
      case CEO:
        return pieceState === PLACEMENT || pieceState === MOVEMENT;
      case SPY:
        return selectedPiece.buffed
          ? pieceState === PLACEMENT || pieceState === MOVEMENT3
          : pieceState === PLACEMENT || pieceState === MOVEMENT2;
      case SNIPER:
        return pieceState === PLACEMENT || pieceState === MOVEMENT;
      default:
        return false;
    }
  }

  return false;
}

function isPieceBeingDropped(
  { hasTurnEnded, pieces, pieceState },
  toggledPieceId,
) {
  return hasTurnEnded || hasPieceEndedTurn(pieces, pieceState, toggledPieceId);
}

function isSniperSelectedForSnipe(snipe, pieceId) {
  return snipe && pz.isSniper(pieceId);
}

function togglePieceState(state, pieceId) {
  return (
    isPieceBeingDropped(state, pieceId) ||
    isSniperSelectedForSnipe(state.snipe, pieceId)
  );
}

function snipeState(state) {
  if (pz.isAnyPieceThroughSniperLine(state.pieces)){
    return false;
  }

  return state.hasTurnEnded;
}

function hasTurnEndedReducer(state, action) {
  switch (action.type) {
    case NEXT_TURN:
      return false;
    case START_GAME:
      return false;
    case TOGGLE_PIECE:
      return togglePieceState(state, action.payload.pieceId);
    case MOVE_PIECE:
      return false;
    case SNIPE:
      return snipeState(state);
    default:
      return state.hasTurnEnded;
  }
}

export default hasTurnEndedReducer;
