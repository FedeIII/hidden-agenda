export const START_GAME = 'START_GAME';
export function startGame (players) {
    return {
        type: START_GAME,
        payload: players
    };
};

export const NEXT_TURN = 'NEXT_TURN';
export function nextTurn () {
    return {
        type: NEXT_TURN
    };
};

export const TOGGLE_PIECE = 'TOGGLE_PIECE';
export function togglePiece (pieceId) {
    return {
        type: TOGGLE_PIECE,
        payload: {pieceId}
    };
};

export const MOVE_PIECE = 'MOVE_PIECE';
export function movePiece (pieceId, coords) {
    return {
        type: MOVE_PIECE,
        payload: {pieceId, coords}
    };
};

export const DIRECT_PIECE = 'DIRECT_PIECE';
export function directPiece (cell) {
    return {
        type: DIRECT_PIECE,
        payload: cell
    };
};
