export const START_GAME = 'START_GAME';
export function startGame(players) {
  return {
    type: START_GAME,
    payload: players,
  };
}

export const SET_ALIGNMENT = 'SET_ALIGNMENT';
export function setAlignment({ name, friend, foe }) {
  return {
    type: SET_ALIGNMENT,
    payload: { name, friend, foe },
  };
}

export const NEXT_TURN = 'NEXT_TURN';
export function nextTurn() {
  return {
    type: NEXT_TURN,
  };
}

export const TOGGLE_PIECE = 'TOGGLE_PIECE';
export function togglePiece(pieceId) {
  return {
    type: TOGGLE_PIECE,
    payload: { pieceId },
  };
}

export const MOVE_PIECE = 'MOVE_PIECE';
export function movePiece(pieceId, coords) {
  return {
    type: MOVE_PIECE,
    payload: { pieceId, coords },
  };
}

export const DIRECT_PIECE = 'DIRECT_PIECE';
export function directPiece(direction) {
  return {
    type: DIRECT_PIECE,
    payload: direction,
  };
}

export const SNIPE = 'SNIPE';
export function snipe() {
  return {
    type: SNIPE,
  };
}
