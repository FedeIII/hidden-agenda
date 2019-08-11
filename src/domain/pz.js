import cells from 'Domain/cells';
import {
  areCoordsEqual,
  areCoordsInList,
  directions,
  getUniqueValues,
} from 'Domain/utils';
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

const NUMBER_OF_PLAYERS_KILLED_FOR_GAME_END = 3;

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
    throughSniperLineOf: [],
    buffed: false,
    highlight: false,
    killedById: undefined,
    teamKilledBy: undefined,
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
        areCoordsInList(position, getSnipedPositionsBy(sniper, pieces))
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
    isSameTeam(piece, selectedPiece)
  );
}

function isPieceAtPosition(position, pieces) {
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
        (isPieceAtPosition(nextPosition, pieces) &&
          !isPieceInList(
            getPieceAtPosition(nextPosition, pieces),
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
  if (
    isDifferentPiece(piece1, piece2) &&
    cells.inBoard(piece1.position) &&
    cells.inBoard(piece2.position)
  ) {
    return areCoordsEqual(piece1.position, piece2.position);
  }
}

function isCeoInPosition(position, pieces) {
  const pieceAtPosition = getPieceAtPosition(position, pieces);

  if (pieceAtPosition) {
    return isCeo(pieceAtPosition.id);
  }

  return false;
}

function isNextToCeo(piece, pieces) {
  return getSurroundingPositions(piece.position).reduce(
    (isCeoPresent, position) =>
      isCeoPresent || isCeoInPosition(position, pieces),
    false,
  );
}

function setCeoBuffs(piece, index, pieces) {
  return {
    ...piece,
    buffed: isNextToCeo(piece, pieces),
  };
}

function move(pieces, id, toPosition, pieceState) {
  let movedPieces = movePieces(pieces, id, toPosition, pieceState);
  movedPieces = killPieces(movedPieces, id);

  return movedPieces;
}

function movePieces(pieces, id, toPosition, pieceState) {
  return pieces.map(piece => {
    if (piece.id === id) {
      return getMovedPiece(pieces, piece, toPosition, pieceState);
    }

    return getNotMovedPiece(piece);
  });
}

function getMovedPiece(pieces, piece, toPosition, pieceState) {
  piece.moved = true;

  const throughSniperLineOf = getSnipersInSight(piece, toPosition, pieces);

  switch (getType(piece.id)) {
    case AGENT:
      return moveAgent(piece, toPosition, throughSniperLineOf);
    case CEO:
      return moveCeo(piece, toPosition, throughSniperLineOf);
    case SPY:
      return moveSpy(piece, toPosition, throughSniperLineOf, pieceState);
    case SNIPER:
      return moveSniper(piece, toPosition, throughSniperLineOf);
    default:
      return;
  }
}

function getNotMovedPiece(piece) {
  piece.moved = false;
  return piece;
}

function moveAgent(agent, toPosition, throughSniperLineOf) {
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
    throughSniperLineOf,
  };
}

function moveCeo(ceo, toPosition, throughSniperLineOf) {
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
    throughSniperLineOf,
  };
}

function moveSpy(spy, toPosition, throughSniperLineOf, pieceState) {
  const spyDirection = spy.position
    ? cells.getDirection(spy.position, toPosition)
    : undefined;
  const spySelectedDirection = spy.position ? spyDirection : [1, 0];

  return {
    ...spy,
    position: toPosition,
    direction: spyDirection,
    selectedDirection: spySelectedDirection,
    showMoveCells:
      (spy.position && pieceState === SELECTION) ||
      (spy.buffed && pieceState === MOVEMENT)
        ? true
        : false,
    throughSniperLineOf,
  };
}

function moveSniper(sniper, toPosition, throughSniperLineOf) {
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
    throughSniperLineOf,
  };
}

function setTeamKilledBy(piece, killedCeo) {
  if (isSameTeam(piece, killedCeo) && !piece.position) {
    return killPiece({
      killedPiece: piece,
      killedById: killedCeo.teamKilledBy,
    });
  }

  return piece;
}

function killWholeTeam(pieces, killedCeo) {
  const killedPieces = pieces.map(piece => setTeamKilledBy(piece, killedCeo));
  killedCeo.teamKilledBy = undefined;
  return killedPieces;
}

function killPieces(pieces, movedId) {
  const killedPieces = pieces.slice(0);

  killedPieces.forEach(piece1 => {
    killedPieces.forEach(piece2 => {
      if (isSamePosition(piece1, piece2)) {
        if (piece1.id === movedId) {
          killPiece({ killedPiece: piece2, killedById: piece1.id });
        } else {
          killPiece({ killedPiece: piece1, killedById: piece2.id });
        }
      }
    });
  });

  const killedCeo = killedPieces.find(
    piece => isCeo(piece.id) && piece.teamKilledBy,
  );

  if (!killedCeo) {
    return killedPieces;
  }

  return killWholeTeam(killedPieces, killedCeo);
}

function willAgentSlide({ position, direction }) {
  return cells.inBoard(
    cells.get(position).getPositionAfterDirections(direction, direction),
  );
}

function killPiece({ killedPiece, killedById }) {
  killedPiece.killed = true;
  killedPiece.position = [-1, -1];
  killedPiece.killedById = killedById;

  if (isCeo(killedPiece.id)) {
    killedPiece.teamKilledBy = killedById;
  }

  return killedPiece;
}

function getSnipersInSight(piece, toPosition, pieces) {
  if (piece.position) {
    const allSnipedPositions = getSnipedPositions(pieces, piece);
    const movementPositions = cells.getMovementPositions(
      piece.position,
      toPosition,
    );

    return Object.entries(allSnipedPositions).reduce(
      (allSnipersInSight, [sniperId, snipedPositions]) => [
        ...allSnipersInSight,
        ...movementPositions.reduce((snipersInSight, position) => {
          if (areCoordsInList(position, snipedPositions)) {
            return [...snipersInSight, sniperId];
          }

          return snipersInSight;
        }, []),
      ],
      [],
    );
  }

  return [];
}

function removeIsThroughSniperLine(pieces) {
  return pieces.map(piece => ({ ...piece, throughSniperLineOf: [] }));
}

function killSnipedPiece(pieces, sniperId) {
  return pieces.map(piece => {
    if (piece.throughSniperLineOf.length) {
      return killPiece({ killedPiece: piece, killedById: sniperId });
    }

    if (piece.highlight) {
      return {
        ...piece,
        highlight: false,
      };
    }

    return piece;
  });
}

function getSnipedPositions(pieces, piece) {
  return pieces
    .filter(
      eachPiece =>
        isSniper(eachPiece.id) &&
        !isSameTeam(piece, eachPiece) &&
        eachPiece.position,
    )
    .reduce(
      (snipedPositions, sniper) => ({
        ...snipedPositions,
        [sniper.id]: getSnipedPositionsBy(sniper, pieces),
      }),
      {},
    );
}

function getSnipedPositionsBy(sniper, pieces) {
  const buffedSnipedPositions = cells
    .get(sniper.position)
    .getPositionsInDirection(sniper.direction);

  if (sniper.buffed) {
    return buffedSnipedPositions;
  }

  return truncatePositions(buffedSnipedPositions, pieces);
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

function getHighlightedPositions(pieces) {
  return pieces.reduce(
    (acc, piece) =>
      piece.showMoveCells
        ? acc.concat(getHighlightedPositionsFor(piece, pieces))
        : acc,
    [],
  );
}

function getHighlightedPositionsFor(piece, pieces) {
  switch (getType(piece.id)) {
    case AGENT:
      return getAgentPositions(piece, pieces);
    case CEO:
      return getCeoPositions(piece, pieces);
    case SPY:
      return getSpyPositions(piece, pieces);
    case SNIPER:
      return getSniperPositions(piece, pieces);
    default:
      return [];
  }
}

function getFreePositionAt(position, piece, pieces) {
  const pieceAtPosition = getPieceAtPosition(position, pieces);
  if (!pieceAtPosition || !isSameTeam(pieceAtPosition, piece)) {
    return [position];
  }

  return [];
}

function getBuffedAgentPositions(
  agent,
  pieces,
  position1CellAhead,
  position2CellsAhead,
) {
  const pieceAtPosition1 = getPieceAtPosition(position1CellAhead, pieces);

  const agentPositions = pieceAtPosition1
    ? getFreePositionAt(position1CellAhead, agent, pieces)
    : [
        position1CellAhead,
        ...getFreePositionAt(position2CellsAhead, agent, pieces),
      ];

  if (agentPositions.some(position => !position)) {
    return getInitialLocationCells(pieces);
  }

  return agentPositions;
}

function getRegularAgentPositions(
  agent,
  pieces,
  position1CellAhead,
  position2CellsAhead,
) {
  if (!isPieceBlocked(agent, pieces, position1CellAhead, position2CellsAhead)) {
    if (position2CellsAhead) {
      return [position2CellsAhead];
    }

    return getInitialLocationCells(pieces);
  }

  return [];
}

function getAgentPositions(agent, pieces) {
  if (!agent.position) {
    return getInitialLocationCells(pieces);
  }

  const position1CellAhead = cells
    .get(agent.position)
    .getPositionInDirection(agent.direction);

  const position2CellsAhead = cells
    .get(agent.position)
    .getPositionAfterDirections(agent.direction, agent.direction);

  if (agent.buffed) {
    return getBuffedAgentPositions(
      agent,
      pieces,
      position1CellAhead,
      position2CellsAhead,
    );
  }

  return getRegularAgentPositions(
    agent,
    pieces,
    position1CellAhead,
    position2CellsAhead,
  );
}

function getCeoPositions(ceo, pieces) {
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

function getSurroundingPositions(position) {
  return directions
    .getAll()
    .map(direction => cells.get(position).getPositionInDirection(direction));
}

function getSpyPositions(spy, pieces) {
  if (!spy.position) {
    return getInitialLocationCells(pieces);
  }

  return getSurroundingPositions(spy.position)
    .filter(position => cells.inBoard(position))
    .filter(
      position =>
        !isFriendlyAtPosition(
          getPieceAtPosition(position, pieces),
          position,
          spy,
        ),
    )
    .filter(position => {
      return (
        !hasPiece(position, pieces) ||
        hasPieceBackwards(position, pieces, spy.position)
      );
    });
}

function getSniperPositions(sniper, pieces) {
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
      const pieceAtPosition = getPieceAtPosition(position, pieces);
      return (
        noPiecesInAnyPosition &&
        (!pieceAtPosition || isSameTeam(pieceAtPosition, sniper))
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

function getPieceAtPosition(position, pieces) {
  return pieces.find(piece => areCoordsEqual(piece.position, position));
}

function hasPiece(position, pieces) {
  return !!getPieceAtPosition(position, pieces);
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
  if (positions.length && !isPieceAtPosition(positions[0], pieces)) {
    return [positions[0]].concat(truncatePositions(positions.slice(1), pieces));
  }

  return [];
}

function getSelectedPiece(pieces) {
  return pieces.find(piece => piece.selected);
}

function getDirectedPiece(piece, direction, pieces) {
  const throughSniperLineOf = getSnipersInSight(piece, piece.position, pieces);

  return {
    ...piece,
    selectedDirection: direction,
    throughSniperLineOf,
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

function highlightSniperWithSight(piece, snipersWithSight) {
  if (isSniper(piece.id) && snipersWithSight.includes(piece.id)) {
    return {
      ...piece,
      highlight: true,
    };
  }

  return piece;
}

function isInSniperSight(piece) {
  return !!piece.throughSniperLineOf.length;
}

function highlightSnipersWithSight(pieces) {
  const snipersWithSight = getUniqueValues(
    pieces
      .filter(piece => isInSniperSight(piece))
      .reduce(
        (snipers, piece) => [...snipers, ...piece.throughSniperLineOf],
        [],
      ),
  );

  return pieces.map(piece => highlightSniperWithSight(piece, snipersWithSight));
}

function getPiecesKilledByTeam(team, pieces) {
  return pieces.reduce(
    (piecesKilled, piece) => {
      if (piece.killedById && getTeam(piece.killedById) === team) {
        const type = getType(piece.id);
        return {
          ...piecesKilled,
          [type]: piecesKilled[type] + 1,
        };
      }

      return piecesKilled;
    },
    { A: 0, S: 0, N: 0, C: 0 },
  );
}

function hasGameFinished(pieces) {
  return (
    pieces.filter(piece => isCeo(piece.id) && piece.killed).length >=
    NUMBER_OF_PLAYERS_KILLED_FOR_GAME_END
  );
}

const POINTS_PER_PIECE_TYPE = {
  A: 5,
  S: 10,
  N: 10,
  C: 20,
};

function getPointsFromKills(team, pieces) {
  return Object.entries(getPiecesKilledByTeam(team, pieces)).reduce(
    (score, [pieceType, pieceCount]) =>
      score + POINTS_PER_PIECE_TYPE[pieceType] * pieceCount,
    0,
  );
}

function getPointsFromSurvivors(team, pieces) {
  return pieces
    .filter(
      piece => getTeam(piece.id) === team && piece.position && !piece.killed,
    )
    .reduce(
      (score, piece) => score + POINTS_PER_PIECE_TYPE[getType(piece.id)],
      0,
    );
}

function getPointsForTeam(team, pieces) {
  return (
    getPointsFromKills(team, pieces) + getPointsFromSurvivors(team, pieces)
  );
}

export default {
  init,
  toggle,
  move,
  getHighlightedPositions,
  getSelectedPiece,
  changeSelectedPieceDirection,
  getPossibleDirections,
  getAllTeamPieces,
  getTeam,
  getType,
  getNumber,
  getPieceById,
  removeIsThroughSniperLine,
  killSnipedPiece,
  isAgent,
  isSpy,
  isCeo,
  isSniper,
  isSniperOnBoard,
  setCeoBuffs,
  highlightSnipersWithSight,
  isInSniperSight,
  getPiecesKilledByTeam,
  hasGameFinished,
  getPointsForTeam,
};
