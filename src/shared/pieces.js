import cells from 'shared/cells';

// direction:
//  [0] vertical:
//      1: up
//      0: horizontal
//      -1: down
//  [1] horizontal:
//      1: left
//      0: right

const pieceIds = [
    '0-A1', '0-A2', '0-A3', '0-A4', '0-A5',
    '1-A1', '1-A2', '1-A3', '1-A4', '1-A5',
    '2-A1', '2-A2', '2-A3', '2-A4', '2-A5',
    '3-A1', '3-A2', '3-A3', '3-A4', '3-A5'
];

function createPiece (id) {
    return {
        id,
        position: null,
        direction: null,
        selected: false,
        killed: false
    }
}

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

function isDifferentPiece (piece1, piece2) {
    return piece1.id !== piece2.id;
}

function isSamePosition (piece1, piece2) {
    if (isDifferentPiece(piece1, piece2) && piece1.position && piece2.position) {
        return piece1.position[0] === piece2.position[0]
            && piece1.position[1] === piece2.position[1];
    }
}

function movePieces (pieces, id, cell) {
    return pieces.map(piece => {
        if (piece.id === id) {
            if (!piece.position) {
                piece.direction = [1, 0];
            }

            piece.position = cell;
        }

        return piece;
    });
}

function killPiece (piece) {
    piece.killed = true;
    piece.position = [-1, -1];
}

function killPieces (pieces, movedId) {
    const killedPieces = pieces.slice(0);

    killedPieces.forEach(piece1 => {
        killedPieces.forEach(piece2 => {
            if (isSamePosition(piece1, piece2)) {
                if (piece1.id === movedId) {
                    killPiece(piece2);
                } else {
                    killPiece(piece1);
                }
            }
        });
    });

    return killedPieces;
}

const API = {
    init() {
        return pieceIds.map(id => createPiece(id));
    },

    move(pieces, id, cell) {
        let movedPieces = movePieces(pieces, id, cell);
        movedPieces = killPieces(movedPieces, id);

        return movedPieces;
    },

    getHighlightedCells(pieces) {
        const selectedPiece = API.getSelectedPiece(pieces);
        const pieceType = selectedPiece && selectedPiece.id.charAt(2);

        switch (pieceType) {
            case 'A':
                return getAgentCells(selectedPiece);
            default:
                return [];
        }
    },

    getSelectedPiece(pieces) {
        return pieces.find(piece => piece.selected);
    },

    changeSelectedPieceDirection(pieces, direction) {
        const {id} = API.getSelectedPiece(pieces);
        return pieces.map(piece => {
            if (piece.id === id) {
                piece.direction = direction;
            }

            return piece;
        });
    },

    getTeamPieces(pieces, team) {
        return pieces.filter(piece =>
            piece.id.charAt(0) === team && !piece.position
        );
    }
};

export default API;
