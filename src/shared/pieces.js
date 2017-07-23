import cells from 'shared/cells';
import {areCoordsEqual, areCoordsInList, directions} from 'shared/utils';
import {SELECTION} from 'client/pieceStates';
import {AGENT, CEO, SPY, SNIPER} from 'shared/pieceTypes';

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
    `0-${CEO}`, `0-${SPY}`, `0-${SNIPER}`,

    `1-${AGENT}1`, `1-${AGENT}2`, `1-${AGENT}3`, `1-${AGENT}4`, `1-${AGENT}5`,
    `1-${CEO}`, `1-${SPY}`, `1-${SNIPER}`,

    `2-${AGENT}1`, `2-${AGENT}2`, `2-${AGENT}3`, `2-${AGENT}4`, `2-${AGENT}5`,
    `2-${CEO}`, `2-${SPY}`, `2-${SNIPER}`,

    `3-${AGENT}1`, `3-${AGENT}2`, `3-${AGENT}3`, `3-${AGENT}4`, `3-${AGENT}5`,
    `3-${CEO}`, `3-${SPY}`, `3-${SNIPER}`
];

function createPiece (id) {
    return {
        id,
        position: undefined,
        direction: undefined,
        selectedDirection: undefined,
        selected: false,
        killed: false,
        showMoveCells: false
    }
}

function getInitialLocationCells (pieces) {
    return cells.getAllAvailableCells()
        .filter(cell => !hasPiece(cell, pieces));
}

function isPieceBlocked (selectedPiece, pieces, position1CellAhead, position2CellsAhead) {
    return pieces.filter(piece =>
        isPieceAtPosistion(piece, position1CellAhead)
        ||
        isFriendlyAtPosition(piece, position2CellsAhead, selectedPiece)
    ).length !== 0;
}

function isPieceAtPosistion (piece, position1CellAhead) {
    return areCoordsEqual(piece.position, position1CellAhead);
}

function isFriendlyAtPosition (piece, position2CellsAhead, selectedPiece) {
    return piece
        && areCoordsEqual(piece.position, position2CellsAhead)
        && (getTeam(piece.id) === getTeam(selectedPiece.id));
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

function getCeoDirections (ceo, pieces) {
    if (!ceo.direction) {
        return directions.getAll();
    }

    return [ceo.direction];
}

function getSpyDirections (spy, pieces) {
    if (!spy.direction) {
        return directions.getAll();
    }

    return [spy.direction];
}

function getSniperDirections (sniper, pieces) {
    return directions.getAll();
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

function move (pieces, id, cell) {
    let movedPieces = movePieces(pieces, id, cell);
    movedPieces = killPieces(movedPieces, id);

    return movedPieces;
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
                case SNIPER:
                    return moveSniper(piece, cell);
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
        selectedDirection: agentSelectedDirection,
        showMoveCells: false
    });
}

function moveCeo (ceo, cell) {
    const ceoDirection = ceo.position ? cells.getDirection(ceo.position, cell) : undefined;
    const ceoSelectedDirection = ceo.position ? ceoDirection : [1, 0];

    return Object.assign({}, ceo, {
        position: cell,
        direction: ceoDirection,
        selectedDirection: ceoSelectedDirection,
        showMoveCells: false
    });
}

function moveSpy (spy, cell) {
    const spyDirection = spy.position ? cells.getDirection(spy.position, cell) : undefined;
    const spySelectedDirection = spy.position ? spyDirection : [1, 0];

    return Object.assign({}, spy, {
        position: cell,
        direction: spyDirection,
        selectedDirection: spySelectedDirection,
        showMoveCells: spy.moving ? true : false,
        moving: !spy.moving
    });
}

function moveSniper (sniper, cell) {
    const sniperDirection = sniper.position ? cells.getDirection(sniper.position, cell) : undefined;
    const sniperSelectedDirection = sniper.position ? sniperDirection : [1, 0];

    return Object.assign({}, sniper, {
        position: cell,
        direction: sniperDirection,
        selectedDirection: sniperSelectedDirection,
        showMoveCells: false
    });
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

function willAgentSlide ({position, direction}) {
    return cells.inBoard(cells.get(position).getPositionAfterDirections(direction, direction));
}

function killPiece (piece) {
    piece.killed = true;
    piece.position = [-1, -1];
}

function togglePiece (piece) {
    if (piece.selected) {
        piece.selected = false;
        piece.showMoveCells = false;
        piece.direction = piece.selectedDirection;
    } else {
        piece.selected = true;
        piece.showMoveCells = true;
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

function getHighlightedCells (pieces) {
    return pieces.reduce((acc, piece) =>
        piece.showMoveCells ? acc.concat(getHighlightedCellsFor(piece, pieces)) : acc,
        []
    );
}

function getHighlightedCellsFor (piece, pieces) {
    switch (getType(piece.id)) {
        case AGENT:
            return getAgentCells(piece, pieces);
        case CEO:
            return getCeoCells(piece, pieces);
        case SPY:
            return getSpyCells(piece, pieces);
        case SNIPER:
            return getSniperCells(piece, pieces);
        default:
            return [];
    }
}

function getAgentCells (agent, pieces) {
    if (!agent.position) {
        return getInitialLocationCells(pieces);
    }

    const position2CellsAhead = cells.get(agent.position)
        .getPositionAfterDirections(agent.direction, agent.direction);
    const position1CellAhead = cells.get(agent.position)
        .getPositionInDirection(agent.direction);

    if (!isPieceBlocked(agent, pieces, position1CellAhead, position2CellsAhead)) {
        if (position2CellsAhead) {
            return [position2CellsAhead];
        }

        return getAgentInitialLocationCells();
    }

    return [];
}

function getCeoCells (ceo, pieces) {
    if (!ceo.position) {
        return getInitialLocationCells(pieces);
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
        return getInitialLocationCells(pieces);
    }

    return directions.getAll()
        .map(direction => cells.get(spy.position).getPositionInDirection(direction))
        .filter(cell => cells.inBoard(cell))
        .filter(cell =>
            !isFriendlyAtPosition(getPieceInPosition(cell, pieces), cell, spy)
        ).filter(cell =>
            !hasPiece(cell, pieces)
            ||
            hasPieceBackwards(cell, pieces, spy.position)
        );
}

function getSniperCells (spy, pieces) {
    if (!spy.position) {
        return getInitialLocationCells(pieces);
    }

    return [];
}

function getPieceInPosition (position, pieces) {
    return pieces.find(piece => areCoordsEqual(piece.position, position));
}

function hasPiece (cell, pieces) {
    return !!getPieceInPosition(cell, pieces);
}

function hasPieceBackwards (cell, pieces, spyPosition) {
    return !!(
        hasPiece(cell, pieces)
        &&
        pieces.find(piece => isPieceBackwards(piece, spyPosition))
    );
}

function isPieceBackwards (piece, from) {
    return areCoordsInList(from, getThreeBackPositions(piece));
}

function getThreeBackPositions (piece) {
    return getThreeFrontDirections(
        directions.getOpposite(
            directions.findIndex(piece.direction)
        )
    ).map(
        direction => cells.get(piece.position).getPositionInDirection(direction)
    );
}

function truncatePositions (positions, pieces) {
    if (positions.length && !isPieceInPosition(positions[0], pieces)) {
        return [positions[0]].concat(
            truncatePositions(positions.slice(1), pieces)
        );
    }

    return [];
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
            return getCeoDirections(piece, pieces);
        case SPY:
            return getSpyDirections(piece, pieces);
        case SNIPER:
            return getSniperDirections(piece, pieces);
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
