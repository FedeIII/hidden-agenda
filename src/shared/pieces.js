import cells from 'shared/cells';

// direction:
//  [0] vertical:
//      1: up
//      0: horizontal
//      -1: down
//  [1] horizontal:
//      1: left
//      0: right

function getAgentCells (selectedPiece) {
    if (selectedPiece.position) {
        const availableCell = cells.get(selectedPiece.position).getCoordsInDirection(selectedPiece.direction);
        if (availableCell) {
            return [
                cells.get(selectedPiece.position).getCoordsInDirection(selectedPiece.direction)
            ];
        }
    }

    return cells.getAllAvailableCells();
}

const pieces = {
    getHighlightedCells(selectedPiece) {
        const pieceType = selectedPiece && selectedPiece.id.charAt(2);

        switch (pieceType) {
            case 'A':
                return getAgentCells(selectedPiece);
            default:
                return [];
        }
    }
};

export default pieces;
