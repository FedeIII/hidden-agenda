import cells from 'shared/cells';
import {areCoordsEqual} from 'shared/utils';
import {areCoordsInList, directions} from 'shared/utils';

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
        position: undefined,
        direction: undefined,
        selectedDirection: undefined,
        selected: false,
        killed: false
    }
}

function getAgentInitialLocationCells () {
    return cells.getAllAvailableCells();
}

function getAgentCells (agent, pieces) {
    if (!agent.position) {
        return getAgentInitialLocationCells();
    }

    const positions = cells.get(agent.position)
        .getPositionsInDirections(agent.direction, agent.direction);
    const isPieceBlocked = !!pieces.find(piece => areCoordsEqual(piece.position, positions[0]))

    if (!API.isPieceBlocked(agent, pieces)) {
        const position = cells.get(agent.position)
            .getPositionAfterDirections(agent.direction, agent.direction);
        if (position) {
            return [position];
        }

        return getAgentInitialLocationCells();
    }

    return [];
}

function getThreeFrontDirections (direction) {
    const index = directions.findIndex(direction);

    return [
        directions.getPrevious(index),
        directions.get(index),
        directions.getFollowing(index)
    ];
}

function getAgentDirections (agent, pieces) {
    if (!agent.direction) {
        return directions.getAll();
    }

    const highlightedCells = API.getHighlightedCells(pieces);
    if (highlightedCells.length) {
        return getThreeFrontDirections(agent.direction);
    }

    return [];
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
                piece.selectedDirection = [1, 0];
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

function getType (piece) {
    return piece && piece.id.charAt(2);
}

function togglePiece (piece) {
    if (piece.selected) {
        piece.selected = false;
        piece.direction = piece.selectedDirection;
    } else {
        piece.selected = true;
    }
}

const API = {
    init() {
        return pieceIds.map(id => createPiece(id));
    },

    toggle(pieces, id) {
        return pieces.map(piece => {
            if (piece.id === id) {
                togglePiece(piece);
            }

            return piece;
        });
    },

    move(pieces, id, cell) {
        let movedPieces = movePieces(pieces, id, cell);
        movedPieces = killPieces(movedPieces, id);

        return movedPieces;
    },

    getHighlightedCells(pieces) {
        const selectedPiece = API.getSelectedPiece(pieces);
        const pieceType = getType(selectedPiece);

        switch (pieceType) {
            case 'A':
                return getAgentCells(selectedPiece, pieces);
            default:
                return [];
        }
    },

    getSelectedPiece(pieces) {
        return pieces.find(piece => piece.selected);
    },

    changeSelectedPieceDirection(pieces, direction) {
        const selectedPiece = API.getSelectedPiece(pieces);
        return pieces.map(piece => {
            if (piece.id === selectedPiece.id) {
                piece.selectedDirection = direction;
            }

            return piece;
        });
    },

    getPossibleDirections(piece, pieces) {
        const pieceType = getType(piece);

        switch (pieceType) {
            case 'A':
                return getAgentDirections(piece, pieces);
            default:
                return [];
        }
    },

    getTeamPieces(pieces, team) {
        return pieces.filter(piece =>
            piece.id.charAt(0) === team && !piece.position
        );
    },

    getTeam(id) {
        return id.charAt(0);
    },

    getPieceById(id, pieces) {
        return pieces.find(piece => piece.id === id);
    },

    isPieceBlocked({position, direction}, pieces) {
        const piecePointingAt = cells.get(position).getPositionInDirection(direction);
        return !!pieces.find(piece => areCoordsEqual(piece.position, piecePointingAt))
    }
};

export default API;
