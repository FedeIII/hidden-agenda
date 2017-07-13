import cells from 'shared/cells';
import {areCoordsEqual, areCoordsInList, directions} from 'shared/utils';
import {SELECTION} from 'client/pieceStates';
import {AGENT, CEO, SPY} from 'shared/pieceTypes';

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
    `0-${CEO}`, `0-${SPY}`,

    `1-${AGENT}1`, `1-${AGENT}2`, `1-${AGENT}3`, `1-${AGENT}4`, `1-${AGENT}5`,
    `1-${CEO}`, `1-${SPY}`,

    `2-${AGENT}1`, `2-${AGENT}2`, `2-${AGENT}3`, `2-${AGENT}4`, `2-${AGENT}5`,
    `2-${CEO}`, `2-${SPY}`,

    `3-${AGENT}1`, `3-${AGENT}2`, `3-${AGENT}3`, `3-${AGENT}4`, `3-${AGENT}5`,
    `3-${CEO}`, `3-${SPY}`
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

function getSpyInitialLocationCells () {
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

    return directions.getAll().reduce(
        (acc, direction) => acc.concat(truncatePositions(
            cells.get(ceo.position).getPositionsInDirection(direction),
            pieces
        )),
        []
    );
}

function getSpyCells (spy, pieces) {
    if (!spy.position) {
        return getSpyInitialLocationCells();
    }

    return directions.getAll().map(direction => cells.get(spy.position).getPositionInDirection(direction));
}

function truncatePositions (positions, pieces) {
    if (positions.length && !isPieceInPosition(positions[0], pieces)) {
        return [positions[0]].concat(
            truncatePositions(positions.slice(1), pieces)
        );
    }

    return [];
}

function isPieceInPosition (position, pieces) {
    return areCoordsInList(position, pieces.reduce(
        (acc, {position}) => position ? acc.concat([position]) : acc,
        []
    ));
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

function getSpyDirections (spy, pieces, pieceState) {
    if (!spy.direction) {
        return directions.getAll();
    }

    return [spy.direction];
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
            switch (getType(id)) {
                case AGENT:
                    return moveAgent(piece, cell);
                case CEO:
                    return moveCeo(piece, cell);
                case SPY:
                    return moveSpy(piece, cell);
                default:
                    return;
            }
        }

        return piece;
    });
}

function moveAgent (agent, cell) {
    const agentSelectedDirection = agent.position ? agent.selectedDirection : [1, 0];
    const agentDirection = willAgentSlide(agent) ? agent.direction : undefined;

    return Object.assign({}, agent, {
        position: cell,
        direction: agentDirection,
        selectedDirection: agentSelectedDirection
    });
}

function moveCeo (ceo, cell) {
    const ceoDirection = ceo.position ? cells.getDirection(ceo.position, cell) : undefined;
    const ceoSelectedDirection = ceo.position ? ceoDirection : [1, 0];

    return Object.assign({}, ceo, {
        position: cell,
        direction: ceoDirection,
        selectedDirection: ceoSelectedDirection
    });
}

function moveSpy (spy, cell) {
    const spyDirection = spy.position ? cells.getDirection(spy.position, cell) : undefined;
    const spySelectedDirection = spy.position ? spyDirection : [1, 0];

    return Object.assign({}, spy, {
        position: cell,
        direction: spyDirection,
        selectedDirection: spySelectedDirection
    });
}

function willAgentSlide ({position, direction}) {
    return cells.inBoard(cells.get(position).getPositionAfterDirections(direction, direction));
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

function init () {
    return pieceIds.map(id => createPiece(id));
}

function toggle (pieces, id) {
    return pieces.map(piece => {
        if (piece.id === id) {
            togglePiece(piece);
        }

        return piece;
    });
}

function move (pieces, id, cell) {
    let movedPieces = movePieces(pieces, id, cell);
    movedPieces = killPieces(movedPieces, id);

    return movedPieces;
}

function getHighlightedCells (pieces) {
    const selectedPiece = getSelectedPiece(pieces) || {id: ''};

    switch (getType(selectedPiece.id)) {
        case AGENT:
            return getAgentCells(selectedPiece, pieces);
        case CEO:
            return getCeoCells(selectedPiece, pieces);
        case SPY:
            return getSpyCells(selectedPiece, pieces);
        default:
            return [];
    }
}

function getSelectedPiece (pieces) {
    return pieces.find(piece => piece.selected);
}

function changeSelectedPieceDirection (pieces, direction) {
    const selectedPiece = getSelectedPiece(pieces);
    return pieces.map(piece => {
        if (piece.id === selectedPiece.id) {
            piece.selectedDirection = direction;
        }

        return piece;
    });
}

function getPossibleDirections (piece, pieces, pieceState) {
    switch (getType(piece.id)) {
        case AGENT:
            return getAgentDirections(piece, pieces, pieceState);
        case CEO:
            return getCeoDirections(piece, pieces, pieceState);
        case SPY:
            return getSpyDirections(piece, pieces, pieceState);
        default:
            return [];
    }
}

function getTeamPieces (pieces, team) {
    return pieces.filter(piece =>
        piece.id.charAt(0) === team && !piece.position
    );
}

function getTeam (id) {
    return id.charAt(0);
}

function getType (id) {
    return id.charAt(2);
}

function getNumber (id) {
    return id.charAt(3) || '';
}

function getPieceById (id, pieces) {
    return pieces.find(piece => piece.id === id);
}

export default {
    init,
    toggle,
    move,
    getHighlightedCells,
    getSelectedPiece,
    changeSelectedPieceDirection,
    getPossibleDirections,
    getTeamPieces,
    getTeam,
    getType,
    getNumber,
    getPieceById
};
