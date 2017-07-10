import cells from 'shared/cells';
import {areCoordsEqual} from 'shared/utils';
import {areCoordsInList, directions} from 'shared/utils';
import {SELECTION} from 'client/pieceStates';
import {AGENT, CEO} from 'shared/pieceTypes';

// direction:
//  [0] vertical:
//      1: up
//      0: horizontal
//      -1: down
//  [1] horizontal:
//      1: left
//      0: right

const pieceIds = [
    `0-${AGENT}1`, `0-${AGENT}2`, `0-${AGENT}3`, `0-${AGENT}4`, `0-${AGENT}5`,
    `0-${CEO}`,

    `1-${AGENT}1`, `1-${AGENT}2`, `1-${AGENT}3`, `1-${AGENT}4`, `1-${AGENT}5`,
    `1-${CEO}`,

    `2-${AGENT}1`, `2-${AGENT}2`, `2-${AGENT}3`, `2-${AGENT}4`, `2-${AGENT}5`,
    `2-${CEO}`,

    `3-${AGENT}1`, `3-${AGENT}2`, `3-${AGENT}3`, `3-${AGENT}4`, `3-${AGENT}5`,
    `3-${CEO}`
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

function getCeoInitialLocationCells () {
    return cells.getAllAvailableCells();
}

function isPieceBlocked ({position, direction}, pieces) {
    const piecePointingAt = cells.get(position).getPositionInDirection(direction);
    return !!pieces.find(piece => areCoordsEqual(piece.position, piecePointingAt))
}

function getAgentCells (agent, pieces) {
    if (!agent.position) {
        return getAgentInitialLocationCells();
    }

    if (!isPieceBlocked(agent, pieces)) {
        const position = cells.get(agent.position)
            .getPositionAfterDirections(agent.direction, agent.direction);
        if (position) {
            return [position];
        }

        return getAgentInitialLocationCells();
    }

    return [];
}

function getCeoCells (ceo, pieces) {
    if (!ceo.position) {
        return getCeoInitialLocationCells();
    }

    if (!isPieceBlocked(ceo, pieces)) {
        return directions.getAll().reduce((acc, direction) => {
            return acc.concat(cells.get(ceo.position).getPositionsInDirection(direction))
        }, []);
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

function getAgentDirections (agent, pieces, pieceState) {
    if (!agent.direction) {
        return directions.getAll();
    }

    if (pieceState !== SELECTION) {
        return getThreeFrontDirections(agent.direction);
    }

    return [];
}

function getCeoDirections (ceo, pieces, pieceState) {
    if (!ceo.direction) {
        return directions.getAll();
    }

    return [ceo.direction];
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
            switch (API.getType(id)) {
                case AGENT:
                    return moveAgent(piece, cell);
                case CEO:
                    return moveCeo(piece, cell);
                default:
                    return;
            }
        }

        return piece;
    });
}

function moveAgent (agent, cell) {
    const agentDirection = agent.position ? agent.selectedDirection : [1, 0];

    return Object.assign({}, agent, {
        position: cell,
        selectedDirection: agentDirection
    });
}

function moveCeo (ceo, cell) {
    const ceoDirection = ceo.position ? cells.getDirection(ceo.position, cell) : undefined;
    const ceoSelectedDirection = ceo.position ? ceoDirection : [1, 0];

    return Object.assign({}, ceo, {
        position: cell,
        selectedDirection: ceoSelectedDirection,
        direction: ceoDirection
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
        const selectedPiece = API.getSelectedPiece(pieces) || {id: ''};

        switch (API.getType(selectedPiece.id)) {
            case AGENT:
                return getAgentCells(selectedPiece, pieces);
            case CEO:
                return getCeoCells(selectedPiece, pieces);
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

    getPossibleDirections(piece, pieces, pieceState) {
        switch (API.getType(piece.id)) {
            case AGENT:
                return getAgentDirections(piece, pieces, pieceState);
            case CEO:
                return getCeoDirections(piece, pieces, pieceState);
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

    getType(id) {
        return id.charAt(2);
    },

    getNumber(id) {
        return id.charAt(3) || '';
    },

    getPieceById(id, pieces) {
        return pieces.find(piece => piece.id === id);
    }
};

export default API;
