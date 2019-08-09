import pz from 'Domain/pz';
import {
  TOGGLE_PIECE,
  MOVE_PIECE,
  DIRECT_PIECE,
  NEXT_TURN,
  SNIPE,
} from 'Client/actions';

function hasToToggle(selectedPiece, pieceId) {
  return !selectedPiece || (selectedPiece && selectedPiece.id === pieceId);
}

function toggledPieceState({ pieces, hasTurnEnded }, pieceId) {
  if (hasTurnEnded) {
    return pieces;
  }

  const selectedPiece = pz.getSelectedPiece(pieces);

  if (hasToToggle(selectedPiece, pieceId)) {
    return pz.toggle(pieces, pieceId);
  }

  return pieces;
}

function movedPieceState({ pieces, pieceState }, { pieceId, coords }) {
  return pz.move(pieces, pieceId, coords, pieceState);
}

function directedPieceState(pieces, direction) {
  return pz.changeSelectedPieceDirection(pieces, direction);
}

function nextTurnState(pieces) {
  return pz.removeIsThroughSniperLine(pieces).map(pz.setCeoBuffs);
}

function snipeState(pieces) {
  return pz.killSnipedPiece(pieces);
}

function piecesReducer(state, action) {
  switch (action.type) {
    case TOGGLE_PIECE:
      return [...toggledPieceState(state, action.payload.pieceId)];
    case MOVE_PIECE:
      return [...movedPieceState(state, action.payload)];
    case DIRECT_PIECE:
      return [...directedPieceState(state.pieces, action.payload)];
    case NEXT_TURN:
      return [...nextTurnState(state.pieces)];
    case SNIPE:
      return [...snipeState(state.pieces)];
    default:
      return [...state.pieces];
  }
}

export default piecesReducer;
