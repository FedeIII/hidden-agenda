import cells from 'Domain/cells';
import { areCoordsEqual, areCoordsInList, directions } from 'Domain/utils';
import { SELECTION, MOVEMENT } from 'Client/pieceStates';
import { AGENT, CEO, SPY, SNIPER } from 'Domain/pieceTypes';

// direction:
//  [0] vertical:
//      1: up
//      0: horizontal
//      -1: down
//  [1] horizontal:
//      1: left
//      0: right

const pieceIds = [
  `0-${AGENT}1`,
  `0-${AGENT}2`,
  `0-${AGENT}3`,
  `0-${AGENT}4`,
  `0-${AGENT}5`,
  `0-${CEO}`,
  `0-${SPY}`,
  `0-${SNIPER}`,

  `1-${AGENT}1`,
  `1-${AGENT}2`,
  `1-${AGENT}3`,
  `1-${AGENT}4`,
  `1-${AGENT}5`,
  `1-${CEO}`,
  `1-${SPY}`,
  `1-${SNIPER}`,

  `2-${AGENT}1`,
  `2-${AGENT}2`,
  `2-${AGENT}3`,
  `2-${AGENT}4`,
  `2-${AGENT}5`,
  `2-${CEO}`,
  `2-${SPY}`,
  `2-${SNIPER}`,

  `3-${AGENT}1`,
  `3-${AGENT}2`,
  `3-${AGENT}3`,
  `3-${AGENT}4`,
  `3-${AGENT}5`,
  `3-${CEO}`,
  `3-${SPY}`,
  `3-${SNIPER}`,
];

function createPiece(id) {
  return {
    id,
    position: undefined,
    direction: undefined,
    selectedDirection: undefined,
    selected: false,
    killed: false,
    showMoveCells: false,
  };
}

function getSnipedPiece(piece) {
  return {
    ...piece,
    position: [-1, -1],
    selected: false,
    killed: true,
    showMoveCells: false,
  };
}

function getSnipers(pieces) {
  return pieces.filter(piece => isSniper(piece.id));
}

function isPositionInEnemySniperLine(position, pieces) {
  return getSnipers(pieces)
    .filter(sniper => !isSameTeam(sniper, getSelectedPiece(pieces)))
    .reduce((isInSniperLine, sniper) => {
      return (
        isInSniperLine ||
        areCoordsInList(position, getSnipedPositionsBy(sniper))
      );
    }, false);
}

function getInitialLocationCells(pieces) {
  return cells
    .getAllAvailablePositions()
    .filter(position => !hasPiece(position, pieces))
    .filter(position => !isPositionInEnemySniperLine(position, pieces));
}

function isPieceBlocked(
  selectedPiece,
  pieces,
  position1CellAhead,
  position2CellsAhead,
) {
  return (
    pieces.filter(
      piece =>
        isPieceAtPosistion(piece, position1CellAhead) ||
        isFriendlyAtPosition(piece, position2CellsAhead, selectedPiece),
    ).length !== 0
  );
}

function isPieceAtPosistion(piece, position) {
  return areCoordsEqual(piece.position, position);
}

function isFriendlyAtPosition(piece, position, selectedPiece) {
  return (
    piece &&
    areCoordsEqual(piece.position, position) &&
    getTeam(piece.id) === getTeam(selectedPiece.id)
  );
}

function isPieceInPosition(position, pieces) {
  return areCoordsInList(
    position,
    pieces.reduce(
      (acc, { position }) => (position ? acc.concat([position]) : acc),
      [],
    ),
  );
}

function getThreeFrontDirections(direction) {
  const index = directions.findIndex(direction);

  return [
    directions.getPrevious(index),
    directions.get(index),
    directions.getFollowing(index),
  ];
}

function getAgentDirections(agent, pieces, pieceState) {
  if (!agent.direction) {
    return directions.getAll();
  }

  if (pieceState !== SELECTION) {
    return getThreeFrontDirections(agent.direction);
  }

  return [];
}

function getCeoDirections(ceo, pieces) {
  if (!ceo.direction) {
    return directions.getAll();
  }

  return [ceo.direction];
}

function getSpyDirections(spy, pieces) {
  if (!spy.direction) {
    return directions.getAll();
  }

  return [spy.direction];
}

function isPieceInList(piece = {}, pieceList) {
  return Boolean(
    piece.id && pieceList.find(pieceItem => pieceItem.id === piece.id),
  );
}

function isPieceInDirection(position, direction, pieces, exceptionPieces) {
  return cells
    .get(position)
    .getPositionsInDirection(direction)
    .reduce((isPieceInPastPositions, nextPosition) => {
      return (
        isPieceInPastPositions ||
        (isPieceInPosition(nextPosition, pieces) &&
          !isPieceInList(
            getPieceInPosition(nextPosition, pieces),
            exceptionPieces,
          ))
      );
    }, false);
}

function isSameTeam(piece1, piece2) {
  return getTeam(piece1.id) === getTeam(piece2.id);
}

function getEnemyPieces(piece, pieces) {
  return pieces.filter(eachPiece => !isSameTeam(eachPiece, piece));
}

function getSameTeamPieces(piece, pieces) {
  return pieces.filter(eachPiece => isSameTeam(eachPiece, piece));
}

function getSniperDirections(sniper, pieces, pieceState) {
  const allDirections = directions.getAll();
  const teamPieces = getSameTeamPieces(sniper, pieces);

  return allDirections.filter(
    direction =>
      !isPieceInDirection(
        sniper.position,
        direction,
        pieces,
        teamPieces,
        pieceState,
      ) || pieceState === MOVEMENT,
  );
}

function isDifferentPiece(piece1, piece2) {
  return piece1.id !== piece2.id;
}

function isSamePosition(piece1, piece2) {
  if (isDifferentPiece(piece1, piece2)) {
    return areCoordsEqual(piece1.position, piece2.position);
  }
}

function move(pieces, id, toPosition) {
  let movedPieces = movePieces(pieces, id, toPosition);
  movedPieces = killPieces(movedPieces, id);

  return movedPieces;
}

function movePieces(pieces, id, toPosition) {
  return pieces.map(piece => {
    if (piece.id === id) {
      return getMovedPiece(pieces, piece, toPosition);
    }

    return getNotMovedPiece(piece);
  });
}

function getMovedPiece(pieces, piece, toPosition) {
  piece.moved = true;

  const isThroughSniperLine = isPieceThroughSniperLine(
    piece,
    toPosition,
    pieces,
  );

  switch (getType(piece.id)) {
    case AGENT:
      return moveAgent(piece, toPosition, isThroughSniperLine);
    case CEO:
      return moveCeo(piece, toPosition, isThroughSniperLine);
    case SPY:
      return moveSpy(piece, toPosition, isThroughSniperLine);
    case SNIPER:
      return moveSniper(piece, toPosition, isThroughSniperLine);
    default:
      return;
  }
}

function getNotMovedPiece(piece) {
  piece.moved = false;
  return piece;
}

function moveAgent(agent, toPosition, isThroughSniperLine) {
  const agentSelectedDirection = agent.position
    ? agent.selectedDirection
    : [1, 0];
  const agentDirection = willAgentSlide(agent) ? agent.direction : undefined;

  return {
    ...agent,
    position: toPosition,
    direction: agentDirection,
    selectedDirection: agentSelectedDirection,
    showMoveCells: false,
    isThroughSniperLine,
  };
}

function moveCeo(ceo, toPosition, isThroughSniperLine) {
  const ceoDirection = ceo.position
    ? cells.getDirection(ceo.position, toPosition)
    : undefined;
  const ceoSelectedDirection = ceo.position ? ceoDirection : [1, 0];

  return {
    ...ceo,
    position: toPosition,
    direction: ceoDirection,
    selectedDirection: ceoSelectedDirection,
    showMoveCells: false,
    isThroughSniperLine,
  };
}

function moveSpy(spy, toPosition, isThroughSniperLine) {
  const spyDirection = spy.position
    ? cells.getDirection(spy.position, toPosition)
    : undefined;
  const spySelectedDirection = spy.position ? spyDirection : [1, 0];

  return {
    ...spy,
    position: toPosition,
    direction: spyDirection,
    selectedDirection: spySelectedDirection,
    showMoveCells: spy.moving ? true : false,
    moving: !spy.moving,
    isThroughSniperLine,
  };
}

function moveSniper(sniper, toPosition, isThroughSniperLine) {
  const sniperDirection = sniper.position
    ? cells.getDirection(sniper.position, toPosition)
    : undefined;
  const sniperSelectedDirection = sniper.position ? sniperDirection : [1, 0];

  return {
    ...sniper,
    position: toPosition,
    direction: sniperDirection,
    selectedDirection: sniperSelectedDirection,
    showMoveCells: false,
    isThroughSniperLine,
  };
}

function killPieces(pieces, movedId) {
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

function willAgentSlide({ position, direction }) {
  return cells.inBoard(
    cells.get(position).getPositionAfterDirections(direction, direction),
  );
}

function killPiece(piece) {
  return {
    ...piece,
    killed: true,
    position: [-1, -1],
  };
}

function isPieceThroughSniperLine(piece, toPosition, pieces) {
  if (piece.position) {
    const snipedPositions = getSnipedPositions(pieces, piece);
    const movementPositions = cells.getMovementPositions(
      piece.position,
      toPosition,
    );

    return movementPositions.reduce(
      (acc, cell) => acc || areCoordsInList(cell, snipedPositions),
      false,
    );
  }

  return false;
}

function removeIsThroughSniperLine(pieces) {
  return pieces.map(piece => ({ ...piece, isThroughSniperLine: false }));
}

function killSnipedPiece(pieces) {
  return pieces.map(piece => {
    if (piece.isThroughSniperLine) {
      return killPiece(piece);
    }

    return piece;
  });
}

function getSnipedPositions(pieces, piece) {
  return pieces
    .filter(
      eachPiece => isSniper(eachPiece.id) && !isSameTeam(piece, eachPiece),
    )
    .map(sniper => getSnipedPositionsBy(sniper))
    .reduce((acc, snipedPositions) => acc.concat(snipedPositions), [])
    .filter(cell => !areCoordsEqual(cell, [-1, -1]));
}

function getSnipedPositionsBy(piece) {
  return cells.get(piece.position).getPositionsInDirection(piece.direction);
}

function togglePiece(piece) {
  if (piece.selected) {
    piece.selected = false;
    piece.showMoveCells = false;
    piece.direction = piece.selectedDirection;
  } else {
    piece.selected = true;
    piece.showMoveCells = true;
  }
}

function init() {
  return pieceIds.map(id => createPiece(id));
}

function toggle(pieces, id) {
  return pieces.map(piece => {
    if (piece.id === id) {
      togglePiece(piece);
    }

    return piece;
  });
}

function getHighlightedCells(pieces) {
  return pieces.reduce(
    (acc, piece) =>
      piece.showMoveCells
        ? acc.concat(getHighlightedCellsFor(piece, pieces))
        : acc,
    [],
  );
}

function getHighlightedCellsFor(piece, pieces) {
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

function getAgentCells(agent, pieces) {
  if (!agent.position) {
    return getInitialLocationCells(pieces);
  }

  const position2CellsAhead = cells
    .get(agent.position)
    .getPositionAfterDirections(agent.direction, agent.direction);
  const position1CellAhead = cells
    .get(agent.position)
    .getPositionInDirection(agent.direction);

  if (!isPieceBlocked(agent, pieces, position1CellAhead, position2CellsAhead)) {
    if (position2CellsAhead) {
      return [position2CellsAhead];
    }

    return getInitialLocationCells(pieces);
  }

  return [];
}

function getCeoCells(ceo, pieces) {
  if (!ceo.position) {
    return getInitialLocationCells(pieces);
  }

  return directions
    .getAll()
    .reduce(
      (acc, direction) =>
        acc.concat(
          truncatePositions(
            cells.get(ceo.position).getPositionsInDirection(direction),
            pieces,
          ),
        ),
      [],
    );
}

function getSpyCells(spy, pieces) {
  if (!spy.position) {
    return getInitialLocationCells(pieces);
  }

  return directions
    .getAll()
    .map(direction => cells.get(spy.position).getPositionInDirection(direction))
    .filter(position => cells.inBoard(position))
    .filter(
      position =>
        !isFriendlyAtPosition(
          getPieceInPosition(position, pieces),
          position,
          spy,
        ),
    )
    .filter(
      position =>
        !hasPiece(position, pieces) ||
        hasPieceBackwards(position, pieces, spy.position),
    );
}

function getSniperCells(sniper, pieces) {
  if (!sniper.position) {
    return getInitialLocationCells(pieces).filter(position =>
      hasAvailableDirectionsForSniper(position, sniper, pieces),
    );
  }

  return [];
}

function isDirectionAvailableForSniper(position, direction, sniper, pieces) {
  return cells
    .get(position)
    .getPositionsInDirection(direction)
    .reduce((noPiecesInAnyPosition, position) => {
      const pieceInPosition = getPieceInPosition(position, pieces);
      return (
        noPiecesInAnyPosition &&
        (!pieceInPosition || isSameTeam(pieceInPosition, sniper))
      );
    }, true);
}

function hasAvailableDirectionsForSniper(position, sniper, pieces) {
  return directions
    .getAll()
    .reduce(
      (hasAvailableDirections, direction) =>
        hasAvailableDirections ||
        isDirectionAvailableForSniper(position, direction, sniper, pieces),
      false,
    );
}

function getPieceInPosition(position, pieces) {
  return pieces.find(piece => areCoordsEqual(piece.position, position));
}

function hasPiece(position, pieces) {
  return !!getPieceInPosition(position, pieces);
}

function hasPieceBackwards(position, pieces, spyPosition) {
  return !!(
    hasPiece(position, pieces) &&
    pieces.find(piece => isPieceBackwards(piece, spyPosition))
  );
}

function isPieceBackwards(piece, from) {
  return areCoordsInList(from, getThreeBackPositions(piece));
}

function getThreeBackPositions(piece) {
  return getThreeFrontDirections(
    directions.getOpposite(directions.findIndex(piece.direction)),
  ).map(direction =>
    cells.get(piece.position).getPositionInDirection(direction),
  );
}

function truncatePositions(positions, pieces) {
  if (positions.length && !isPieceInPosition(positions[0], pieces)) {
    return [positions[0]].concat(truncatePositions(positions.slice(1), pieces));
  }

  return [];
}

function getSelectedPiece(pieces) {
  return pieces.find(piece => piece.selected);
}

function getDirectedPiece(piece, direction, pieces) {
  const isThroughSniperLine = isPieceThroughSniperLine(
    piece,
    piece.position,
    pieces,
  );

  return {
    ...piece,
    selectedDirection: direction,
    isThroughSniperLine,
  };
}

function changeSelectedPieceDirection(pieces, direction) {
  const selectedPiece = getSelectedPiece(pieces);

  return pieces.map(piece => {
    if (piece.id === selectedPiece.id) {
      return getDirectedPiece(piece, direction, pieces);
    }

    return piece;
  });
}

function getPossibleDirections(piece, pieces, pieceState) {
  switch (getType(piece.id)) {
    case AGENT:
      return getAgentDirections(piece, pieces, pieceState);
    case CEO:
      return getCeoDirections(piece, pieces);
    case SPY:
      return getSpyDirections(piece, pieces);
    case SNIPER:
      return getSniperDirections(piece, pieces, pieceState);
    default:
      return [];
  }
}

function getAllTeamPieces(team, pieces) {
  return pieces.filter(piece => getTeam(piece.id) === team);
}

function getTeam(id) {
  return id.charAt(0);
}

function getType(id) {
  return id.charAt(2);
}

function getNumber(id) {
  return id.charAt(3) || '';
}

function getPieceById(id, pieces) {
  return pieces.find(piece => piece.id === id);
}

function isAgent(id) {
  return getType(id) === AGENT;
}

function isSpy(id) {
  return getType(id) === SPY;
}

function isCeo(id) {
  return getType(id) === CEO;
}

function isSniper(id) {
  return getType(id) === SNIPER;
}

function isSniperOnBoard(pieces) {
  return !!pieces.find(
    piece => getType(piece.id) === SNIPER && cells.inBoard(piece.position),
  );
}

export default {
  init,
  toggle,
  move,
  getHighlightedCells,
  getSelectedPiece,
  changeSelectedPieceDirection,
  getPossibleDirections,
  getAllTeamPieces,
  getTeam,
  getType,
  getNumber,
  getPieceById,
  isPieceThroughSniperLine,
  removeIsThroughSniperLine,
  killSnipedPiece,
  isAgent,
  isSpy,
  isCeo,
  isSniper,
  isSniperOnBoard,
};
