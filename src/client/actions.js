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
export function directPiece (selectedPiece, cell) {
    return {
        type: DIRECT_PIECE,
        payload: {selectedPiece, cell}
    };
};
