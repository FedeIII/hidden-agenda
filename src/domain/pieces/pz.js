import cells, { OUT_POSITION } from 'Domain/cells';
import { areCoordsEqual, areCoordsInList, directions, getUniqueValues } from 'Domain/utils';
import { TYPES, STATES, NUMBER_OF_PLAYERS_KILLED_FOR_GAME_END, IDS } from 'Domain/pieces';
import py from 'Domain/py';

const { AGENT, CEO, SPY, SNIPER } = TYPES;
const { SELECTION, MOVEMENT, MOVEMENT2, MOVEMENT3, DESELECTION, COLLOCATION, PLACEMENT } = STATES;

////////////////////
// INITIALIZATION //
////////////////////

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

function init() {
	return IDS.map(id => createPiece(id));
}

//////////////
// TOGGLING //
//////////////

function toggle(state, pieceId) {
	const { hasTurnEnded, pieces, piecesPrevState } = state;
	if (hasTurnEnded) {
		return pieces;
	}

	if (isSniper(pieceId) && getPieceById(pieceId, pieces).highlight) {
		return killSnipedPiece(pieces, piecesPrevState, pieceId);
	}

	const selectedPiece = getSelectedPiece(pieces);

	if (hasToToggle(pieceId, selectedPiece, state)) {
		return pieces.map(piece => {
			if (piece.id === pieceId) {
				togglePiece(piece);
			}

			return piece;
		});
	}

	return pieces;
}

function hasToToggle(pieceId, selectedPiece, { players, snipe, pieceState, pieces, teamControl, piecesPrevState }) {
	if (snipe) {
		return false;
	}

	if (isToggledTeamControlled(pieceId, teamControl, piecesPrevState, players, pieces)) {
		return false;
	}

	if (!selectedPiece) {
		return true;
	}

	if (isSpy(pieceId)) {
		if (pieceState === MOVEMENT) {
			return false;
		}

		if (getPieceById(pieceId, pieces).buffed && pieceState === MOVEMENT2) {
			return false;
		}
	}

	return selectedPiece.id === pieceId;
}

function isToggledTeamControlled(pieceId, teamControl, piecesPrevState, players, pieces) {
	// if (isCeo(pieceId) && isCeoPlacement(pieceId, piecesPrevState)) {
	// 	return false;
	// }

	if (cells.inBoard(getPieceById(pieceId, pieces).position)) {
		return false;
	}

	const toggledTeam = getTeam(pieceId);
	const controlledTeams = teamControl
		.map(({ player, prevPlayer, controlling }, teamIndex) => ({
			controlling,
			teamIndex,
			prevPlayer,
			player,
		}))
		.filter(({ controlling, player, prevPlayer }) => controlling && py.getTurn(players) != (prevPlayer || player))
		.map(({ teamIndex }) => String(teamIndex));

	return controlledTeams.includes(toggledTeam);
}

function isCeoPlacement(ceoId, piecesPrevState) {
	const ceo = getPieceById(ceoId, piecesPrevState);

	return !ceo.direction;
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

function togglePieceState(pieceId, { pieces, pieceState, followMouse }) {
	const selectedPiece = getSelectedPiece(pieces);

	if (isSpy(pieceId, pieces)) {
		if (pieceState === MOVEMENT) {
			return MOVEMENT;
		}

		if (getPieceById(pieceId, pieces).buffed && pieceState === MOVEMENT2) {
			return MOVEMENT2;
		}
	}

	if (!!selectedPiece && selectedPiece.id !== pieceId) {
		return pieceState;
	}

	if (followMouse) {
		return COLLOCATION;
	}

	const toggledPiece = getPieceById(pieceId, pieces);

	if (toggledPiece.selected) {
		if (isSniper(toggledPiece.id) && !!toggledPiece.position) {
			return MOVEMENT;
		}

		return SELECTION;
	}

	return DESELECTION;
}

///////////////
// PLACEMENT //
///////////////

function getInitialLocationCells(pieces) {
	return cells
		.getAllAvailablePositions()
		.filter(position => !hasPiece(position, pieces))
		.filter(position => !isPositionInEnemySniperLine(position, pieces));
}

//////////////
// MOVEMENT //
//////////////

function move(pieces, id, toPosition, pieceState) {
	let movedPieces = movePieces(pieces, id, toPosition, pieceState);
	movedPieces = killPieces(movedPieces, id);

	return movedPieces;
}

function movePieces(pieces, id, toPosition, pieceState) {
	return pieces.map(piece => {
		if (piece.id === id) {
			return getMovedPiece(pieces, piece, toPosition, pieceState, id);
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
	const agentSelectedDirection = agent.position ? agent.selectedDirection : [1, 0];
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
	const ceoDirection = ceo.position ? cells.getDirection(ceo.position, toPosition) : undefined;
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
	const spyDirection = spy.position ? cells.getDirection(spy.position, toPosition) : undefined;
	const spySelectedDirection = spy.position ? spyDirection : [1, 0];

	return {
		...spy,
		position: toPosition,
		direction: spyDirection,
		selectedDirection: spySelectedDirection,
		showMoveCells:
			(spy.position && pieceState === SELECTION) || (spy.buffed && pieceState === MOVEMENT) ? true : false,
		throughSniperLineOf,
	};
}

function moveSniper(sniper, toPosition, throughSniperLineOf) {
	const sniperDirection = sniper.position ? cells.getDirection(sniper.position, toPosition) : undefined;
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

function movedPieceState(pieceId, { pieces, pieceState }) {
	const movedPiece = getPieceById(pieceId, pieces);

	if (!movedPiece.direction) {
		return PLACEMENT;
	}

	switch (getType(movedPiece.id)) {
		case SPY:
			return getMovedSpyState(movedPiece, pieceState);
		default:
			return MOVEMENT;
	}
}

function getMovedSpyState(spy, pieceState) {
	if (spy.buffed) {
		return pieceState === MOVEMENT ? MOVEMENT2 : pieceState === MOVEMENT2 ? MOVEMENT3 : MOVEMENT;
	}

	return pieceState === MOVEMENT ? MOVEMENT2 : MOVEMENT;
}

////////////////
// DIRECTIONS //
////////////////

function getPossibleDirections(piece, pieces, pieceState) {
	switch (getType(piece.id)) {
		case AGENT:
			return getAgentDirections(piece, pieces, pieceState);
		case CEO:
			return getCeoDirections(piece, pieces);
		case SPY:
			return getSpyDirections(piece, pieces);
		case SNIPER:
			return getSniperDirections();
		default:
			return [];
	}
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

function getSniperDirections() {
	return directions.getAll();
}

function getThreeFrontDirections(direction) {
	const index = directions.findIndex(direction);

	return [directions.getPrevious(index), directions.get(index), directions.getFollowing(index)];
}

function getDirectedPiece(piece, direction, pieces) {
	const inSniperLineOf = getSnipersInSight(piece, piece.position, pieces);
	const throughSniperLineOf = getUniqueValues([...inSniperLineOf, ...piece.throughSniperLineOf]);

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

///////////////
// POSITIONS //
///////////////

function getHighlightedPositions(pieces, pieceState) {
	return pieces.reduce(
		(acc, piece) => (piece.showMoveCells ? acc.concat(getHighlightedPositionsFor(piece, pieces, pieceState)) : acc),
		[],
	);
}

function getHighlightedPositionsFor(piece, pieces, pieceState) {
	switch (getType(piece.id)) {
		case AGENT:
			return getAgentPositions(piece, pieces);
		case CEO:
			return getCeoPositions(piece, pieces);
		case SPY:
			return getSpyPositions(piece, pieces, pieceState);
		case SNIPER:
			return getSniperPositions(piece, pieces);
		default:
			return [];
	}
}

function getAgentPositions(agent, pieces) {
	if (!agent.position) {
		return getInitialLocationCells(pieces);
	}

	const position1CellAhead = cells.get(agent.position).getPositionInDirection(agent.direction);

	const position2CellsAhead = cells.get(agent.position).getPositionAfterDirections(agent.direction, agent.direction);

	if (agent.buffed) {
		return getBuffedAgentPositions(agent, pieces, position1CellAhead, position2CellsAhead);
	}

	return getRegularAgentPositions(agent, pieces, position1CellAhead, position2CellsAhead);
}

function getCeoPositions(ceo, pieces) {
	if (!ceo.position) {
		return getInitialLocationCells(pieces);
	}

	return directions
		.getAll()
		.reduce(
			(acc, direction) =>
				acc.concat(getFreeCells(cells.get(ceo.position).getPositionsInDirection(direction), pieces)),
			[],
		);
}

function getSpyPositions(spy, pieces, pieceState) {
	if (!spy.position) {
		return getInitialLocationCells(pieces);
	}

	return getSurroundingPositions(spy.position)
		.filter(position => cells.inBoard(position))
		.filter(position => {
			if (isSpyMiddleMovement(spy.buffed, pieceState)) {
				return !isAnyPieceAtPosition(position, pieces);
			}

			return true;
		})
		.filter(position => !isFriendlyAtPosition(getPieceAtPosition(position, pieces), position, spy))
		.filter(position => {
			return !hasPiece(position, pieces) || hasPieceBackwards(position, pieces, spy.position);
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

function isSpyMiddleMovement(buffed, pieceState) {
	return pieceState === SELECTION || (buffed && pieceState === MOVEMENT);
}

function getFreePositionAt(position, piece, pieces) {
	const pieceAtPosition = getPieceAtPosition(position, pieces);
	if (!pieceAtPosition || !isSameTeam(pieceAtPosition, piece)) {
		return [position];
	}

	return [];
}

function getBuffedAgentPositions(agent, pieces, position1CellAhead, position2CellsAhead) {
	const pieceAtPosition1 = getPieceAtPosition(position1CellAhead, pieces);

	const agentPositions = pieceAtPosition1
		? getFreePositionAt(position1CellAhead, agent, pieces)
		: [position1CellAhead, ...getFreePositionAt(position2CellsAhead, agent, pieces)];

	if (agentPositions.some(position => !position)) {
		return getInitialLocationCells(pieces);
	}

	return agentPositions;
}

function getRegularAgentPositions(agent, pieces, position1CellAhead, position2CellsAhead) {
	if (!isPieceBlocked(agent, pieces, position1CellAhead, position2CellsAhead)) {
		if (position2CellsAhead) {
			return [position2CellsAhead];
		}

		return getInitialLocationCells(pieces);
	}

	return [];
}

function getSurroundingPositions(position) {
	return directions.getAll().map(direction => cells.get(position).getPositionInDirection(direction));
}

function getPieceAtPosition(position, pieces) {
	return pieces.find(piece => areCoordsEqual(piece.position, position));
}

function getThreeBackPositions(piece) {
	return getThreeFrontDirections(directions.getOpposite(directions.findIndex(piece.direction))).map(direction =>
		cells.get(piece.position).getPositionInDirection(direction),
	);
}

function getFreeCells(positions, pieces) {
	if (positions.length && !isAnyPieceAtPosition(positions[0], pieces)) {
		return [positions[0]].concat(getFreeCells(positions.slice(1), pieces));
	}

	return [];
}

function getFreeCellsUntilPiece(positions, pieces) {
	if (positions.length) {
		if (isAnyPieceAtPosition(positions[0], pieces)) {
			return [positions[0]];
		}

		return [positions[0]].concat(getFreeCellsUntilPiece(positions.slice(1), pieces));
	}

	return [];
}

/////////////
// KILLING //
/////////////

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

	const killedCeo = killedPieces.find(piece => isCeo(piece.id) && piece.teamKilledBy);

	if (!killedCeo) {
		return killedPieces;
	}

	return killWholeTeam(killedPieces, killedCeo);
}

function killPiece({ killedPiece, killedById }) {
	killedPiece.killed = true;
	killedPiece.position = OUT_POSITION;
	killedPiece.killedById = killedById;

	if (isCeo(killedPiece.id)) {
		killedPiece.teamKilledBy = killedById;
	}

	return killedPiece;
}

function killWholeTeam(pieces, killedCeo) {
	const killedPieces = pieces.map(piece => setTeamKilledBy(piece, killedCeo));
	killedCeo.teamKilledBy = undefined;
	return killedPieces;
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

function addPieceToCount(pieceCount, piece) {
	const type = getType(piece.id);

	return {
		...pieceCount,
		[type]: pieceCount[type] + 1,
	};
}

function getKilledPiecesByTeam(team, pieces) {
	return pieces
		.filter(piece => piece.killedById && getTeam(piece.killedById) === team)
		.reduce(addPieceToCount, { A: 0, S: 0, N: 0, C: 0 });
}

/////////////
// SNIPERS //
/////////////

function getSnipers(pieces) {
	return pieces.filter(piece => isSniper(piece.id));
}

function isPositionInEnemySniperLine(position, pieces) {
	return getSnipers(pieces)
		.filter(sniper => !isSameTeam(sniper, getSelectedPiece(pieces)))
		.reduce((isInSniperLine, sniper) => {
			return isInSniperLine || areCoordsInList(position, getSnipedPositionsBy(sniper, pieces));
		}, false);
}

function getSnipersInSight(piece, toPosition, pieces) {
	if (piece.position) {
		const allSnipedPositions = getSnipedPositions(pieces, piece);
		const movementPositions = cells.getMovementPositions(piece.position, toPosition);

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

function killSnipedPiece(pieces, prevPieces, sniperId) {
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

		return getPieceById(piece.id, prevPieces);
	});
}

function getSnipedPositions(pieces, piece) {
	return pieces
		.filter(eachPiece => isSniper(eachPiece.id) && !isSameTeam(piece, eachPiece) && eachPiece.position)
		.reduce(
			(snipedPositions, sniper) => ({
				...snipedPositions,
				[sniper.id]: getSnipedPositionsBy(sniper, pieces),
			}),
			{},
		);
}

function getSnipedPositionsBy(sniper, pieces) {
	const buffedSnipedPositions = cells.get(sniper.position).getPositionsInDirection(sniper.direction);

	if (sniper.buffed) {
		return buffedSnipedPositions;
	}

	return getFreeCellsUntilPiece(buffedSnipedPositions, pieces);
}

function isDirectionAvailableForSniper(position, direction, sniper, pieces) {
	return cells
		.get(position)
		.getPositionsInDirection(direction)
		.reduce((noPiecesInAnyPosition, position) => {
			const pieceAtPosition = getPieceAtPosition(position, pieces);
			return noPiecesInAnyPosition && (!pieceAtPosition || isSameTeam(pieceAtPosition, sniper));
		}, true);
}

function hasAvailableDirectionsForSniper(position, sniper, pieces) {
	return directions
		.getAll()
		.reduce(
			(hasAvailableDirections, direction) =>
				hasAvailableDirections || isDirectionAvailableForSniper(position, direction, sniper, pieces),
			false,
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

function highlightSnipersWithSight(pieces) {
	const snipersWithSight = getUniqueValues(
		pieces
			.filter(piece => isInSniperSight(piece))
			.reduce((snipers, piece) => [...snipers, ...piece.throughSniperLineOf], []),
	);

	return pieces.map(piece => highlightSniperWithSight(piece, snipersWithSight));
}

function isSniperOnBoard(pieces) {
	return !!pieces.find(piece => getType(piece.id) === SNIPER && cells.inBoard(piece.position));
}

function isInSniperSight(piece) {
	return !!piece.throughSniperLineOf.length;
}

function isAnyPieceThroughSniperLine(pieces) {
	return pieces.some(isInSniperSight);
}

///////////////////
// CLAIM CONTROL //
///////////////////

function claimControl(team, { pieces, teamControl, hasTurnEnded }) {
	if (hasTurnEnded) {
		return pieces;
	}

	return pieces.map(claimControlPieceMap(team, teamControl));
}

function claimControlPieceMap(team, teamControl) {
	return function toggleCeo(piece) {
		if (!isCeo(piece.id)) {
			return piece;
		}

		if (getTeam(piece.id) != team) {
			return piece;
		}

		togglePiece(piece);
		return piece;
	};
}

function claimControlPieceState(team, { teamControl, pieceState }) {
	if (teamControl[team].player) {
		return pieceState;
	}

	return SELECTION;
}

function cancelControl(team, { pieces, teamControl }) {
	return pieces.map(cancelControlPieceMap(team, teamControl));
}

function cancelControlPieceMap(team, teamControl) {
	return function toggleCeo(piece) {
		if (!isCeo(piece.id)) {
			return piece;
		}

		if (getTeam(piece.id) != team) {
			return piece;
		}

		if (teamControl[team].player) {
			togglePiece(piece);
		}

		return piece;
	};
}

function cancelControlPieceState() {
	return DESELECTION;
}

/////////
// CEO //
/////////

function setCeoBuffs(piece, _index, pieces) {
	return {
		...piece,
		buffed: isNextToCeo(piece, pieces),
	};
}

////////////
// CHECKS //
////////////

function isPieceBlocked(selectedPiece, pieces, position1CellAhead, position2CellsAhead) {
	return (
		pieces.filter(
			piece =>
				isPieceAtPosition(piece, position1CellAhead) ||
				isFriendlyAtPosition(piece, position2CellsAhead, selectedPiece),
		).length !== 0
	);
}

function isPieceAtPosition(piece, position) {
	return areCoordsEqual(piece.position, position);
}

function isFriendlyAtPosition(piece, position, selectedPiece) {
	return piece && areCoordsEqual(piece.position, position) && isSameTeam(piece, selectedPiece);
}

function isAnyPieceAtPosition(position, pieces) {
	return areCoordsInList(
		position,
		pieces.reduce((acc, { position }) => (position ? acc.concat([position]) : acc), []),
	);
}

function isSameTeam(piece1, piece2) {
	return getTeam(piece1.id) === getTeam(piece2.id);
}

function getSameTeamPieces(piece, pieces) {
	return pieces.filter(eachPiece => isSameTeam(eachPiece, piece));
}

function isDifferentPiece(piece1, piece2) {
	return piece1.id !== piece2.id;
}

function isSamePosition(piece1, piece2) {
	if (isDifferentPiece(piece1, piece2) && cells.inBoard(piece1.position) && cells.inBoard(piece2.position)) {
		return areCoordsEqual(piece1.position, piece2.position);
	}
}

function isOwnCeoInPosition(piece, position, pieces) {
	const pieceAtPosition = getPieceAtPosition(position, pieces);

	if (pieceAtPosition) {
		const pieceTeam = getTeam(piece.id);
		const ceoTeam = getTeam(pieceAtPosition.id);
		return isCeo(pieceAtPosition.id) && pieceTeam == ceoTeam;
	}

	return false;
}

function isNextToCeo(piece, pieces) {
	return getSurroundingPositions(piece.position).reduce(
		(isCeoPresent, position) => isCeoPresent || isOwnCeoInPosition(piece, position, pieces),
		false,
	);
}

function hasPiece(position, pieces) {
	return !!getPieceAtPosition(position, pieces);
}

function hasPieceBackwards(position, pieces, spyPosition) {
	return !!(hasPiece(position, pieces) && pieces.find(piece => isPieceBackwards(piece, spyPosition)));
}

function isPieceBackwards(piece, from) {
	return areCoordsInList(from, getThreeBackPositions(piece));
}

function willAgentSlide({ position, direction }) {
	return cells.inBoard(cells.get(position).getPositionAfterDirections(direction, direction));
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

function hasGameFinished(pieces) {
	return pieces.filter(piece => isCeo(piece.id) && piece.killed).length >= NUMBER_OF_PLAYERS_KILLED_FOR_GAME_END;
}

function isTogglePieceOnCellClick(followMouse, coords, pieces, pieceState) {
	const highlightedPositions = getHighlightedPositions(pieces, pieceState);
	const selectedPiece = getSelectedPiece(pieces);
	const pieceAtCell = getPieceAtPosition(coords, pieces);

	const isDirectingPiece = followMouse && selectedPiece;

	if ((isDirectingPiece) || !areCoordsInList(coords, highlightedPositions)) {
		if(!pieceAtCell || pieceAtCell.id !== selectedPiece.id) {
			return true
		}

		return false;
	}

	return false;
}

function isMovePieceOnCellClick(followMouse, coords, pieces, pieceState) {
	const highlightedPositions = pz.getHighlightedPositions(pieces, pieceState);

	if (!followMouse && areCoordsInList(coords, highlightedPositions)) {
		return true;
	}

	return false;
}

/////////////
// GETTERS //
/////////////

function getSelectedPiece(pieces) {
	return pieces.find(piece => piece.selected);
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

function getCeo(pieces, team) {
	return pieces.find(piece => isCeo(piece.id) && getTeam(piece.id) == team);
}

function getSurvivorsForTeam(team, pieces) {
	return pieces
		.filter(piece => getTeam(piece.id) === team && piece.position && !piece.killed)
		.reduce(addPieceToCount, { A: 0, S: 0, N: 0, C: 0 });
}

export const pz = {
	// INITIALIZATION
	init,

	// TOGGLING
	toggle,
	togglePieceState,

	// MOVEMENT
	move,
	movedPieceState,

	// DIRECTIONS
	getPossibleDirections,
	changeSelectedPieceDirection,
	getSelectedPiece,

	// POSITIONS
	getHighlightedPositions,
	getPieceAtPosition,

	// SNIPERS
	removeIsThroughSniperLine,
	killSnipedPiece,
	highlightSnipersWithSight,
	isInSniperSight,
	isAnyPieceThroughSniperLine,

	// CLAIM CONTROL
	claimControl,
	claimControlPieceState,
	cancelControl,
	cancelControlPieceState,

	// KILLING
	getKilledPiecesByTeam,

	// CEO
	setCeoBuffs,

	// CHECKS
	isAgent,
	isSpy,
	isCeo,
	isSniper,
	isSniperOnBoard,
	hasGameFinished,
	isTogglePieceOnCellClick,
	isMovePieceOnCellClick,

	// GETTERS
	getTeam,
	getType,
	getNumber,
	getPieceById,
	getSurvivorsForTeam,
	getAllTeamPieces,
	getCeo,
};
