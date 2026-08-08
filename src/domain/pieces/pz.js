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
		return pieces.map(piece => (piece.id === pieceId ? toggledPiece(piece) : piece));
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

	if (isSpyMidWalk(pieceId, pieces, pieceState)) {
		return false;
	}

	return selectedPiece.id === pieceId;
}

// A spy that has taken a step and has more to take may not be put down: it has to finish the walk.
//
// Scoped to the spy actually in hand, and that is not decoration. `pieceState` describes whatever
// is being held, so a spy only owns MOVEMENT or MOVEMENT2 while it is the selected piece — and a
// settled spy now ends the turn without a toggle, which leaves the state machine sitting on
// MOVEMENT2 rather than DESELECTION. Read without the check, a buffed spy picked up afterwards
// inherited those two steps and moved once.
function isSpyMidWalk(pieceId, pieces, pieceState) {
	if (!isSpy(pieceId)) {
		return false;
	}

	const spy = getPieceById(pieceId, pieces);

	if (!spy.selected) {
		return false;
	}

	return pieceState === MOVEMENT || (spy.buffed && pieceState === MOVEMENT2);
}

function isToggledTeamControlled(pieceId, teamControl, piecesPrevState, players, pieces) {
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

function toggledPiece(piece) {
	if (piece.selected) {
		return {
			...piece,
			selected: false,
			showMoveCells: false,
			direction: piece.selectedDirection,
		};
	}

	return {
		...piece,
		selected: true,
		showMoveCells: true,
	};
}

function togglePieceState(pieceId, { pieces, pieceState, followMouse }) {
	const selectedPiece = getSelectedPiece(pieces);

	// Mid-walk the click did nothing, so the state machine does not move either. Same predicate as
	// hasToToggle, which is the half of the refusal that leaves the piece where it is.
	if (isSpyMidWalk(pieceId, pieces, pieceState)) {
		return pieceState;
	}

	if (!!selectedPiece && selectedPiece.id !== pieceId) {
		return pieceState;
	}

	if (followMouse) {
		return COLLOCATION;
	}

	const toggledPiece = getPieceById(pieceId, pieces);

	// `pieces` is the pre-action state, so the piece about to be selected is the one that is
	// NOT selected yet. This used to test `.selected` directly and worked only by accident:
	// piecesReducer runs before pieceStateReducer and used to mutate this very object in
	// place, so the "old" state already carried the new flag.
	const isBeingSelected = !toggledPiece.selected;

	if (isBeingSelected) {
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
	const throughSniperLineOf = getSnipersInSight(piece, toPosition, pieces);
	const movedPiece = moveByType(piece, toPosition, throughSniperLineOf, pieceState);

	return movedPiece ? { ...movedPiece, moved: true } : piece;
}

function moveByType(piece, toPosition, throughSniperLineOf, pieceState) {
	switch (getType(piece.id)) {
		case AGENT:
			return moveAgent(piece, toPosition, throughSniperLineOf);
		case CEO:
			return moveCeo(piece, toPosition, throughSniperLineOf, pieceState);
		case SPY:
			return moveSpy(piece, toPosition, throughSniperLineOf, pieceState);
		case SNIPER:
			return moveSniper(piece, toPosition, throughSniperLineOf);
		default:
			return undefined;
	}
}

function getNotMovedPiece(piece) {
	return piece.moved ? { ...piece, moved: false } : piece;
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

function moveCeo(ceo, toPosition, throughSniperLineOf, pieceState) {
	const ceoDirection = ceo.position ? cells.getDirection(ceo.position, toPosition) : undefined;
	const ceoSelectedDirection = ceo.position ? ceoDirection : [1, 0];

	return {
		...ceo,
		position: toPosition,
		direction: ceoDirection,
		selectedDirection: ceoSelectedDirection,
		showMoveCells: false,
		// A CEO faces the way it just moved and has no turning step, so the move puts it down as
		// well as pointing it — see isSettledByMove, which the spy answers the same way.
		selected: !isSettledByMove(ceo, pieceState),
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
		showMoveCells: willSpyKeepMoving(spy, pieceState),
		// A spy is the one piece with no turning step, so its last step puts it down as well as
		// pointing it — see isSettledByMove. Every other piece is aimed after it lands and is put
		// down by hand, which is the only other place `selected` is written.
		selected: !isSettledByMove(spy, pieceState),
		throughSniperLineOf,
	};
}

function willSpyKeepMoving(spy, pieceState) {
	return Boolean((spy.position && pieceState === SELECTION) || (spy.buffed && pieceState === MOVEMENT));
}

// Which pieces a move leaves settled — facing set, nothing left to point, no longer in hand.
//
// The spy and the CEO, and only ones already on the board. Both take their facing from the move they
// just made, so by the time it lands there is nothing a turning step could still decide; being asked
// to point either one anyway was asking for a decision that had already been made. A CEO settles on
// its move because a move IS its whole distance in one direction, and a spy on the last step of its
// walk. Everything else lands and is then aimed, which is what PLACEMENT and COLLOCATION are for —
// including a spy or a CEO coming out of an HQ, which arrives with no direction of its own and is
// pointed like anything else.
//
// hasTurnEndedReducer reads this too, so what puts the piece down and what ends the turn are the
// same question asked once.
function isSettledByMove(piece, pieceState) {
	if (!piece.position) {
		return false;
	}

	if (isCeo(piece.id)) {
		return true;
	}

	return isSpy(piece.id) && !willSpyKeepMoving(piece, pieceState);
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
			return getCeoDirections(piece);
		case SPY:
			return getSpyDirections(piece);
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

function getCeoDirections(ceo) {
	if (!ceo.direction) {
		return directions.getAll();
	}

	return [ceo.direction];
}

function getSpyDirections(spy) {
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

// Aiming is not moving, so it records no sniper lines. It used to recompute them from the piece's
// own cell and union them in, which could only ever add lines the piece never crossed: a move
// already records its whole path, destination included, and a piece that merely turns has crossed
// nothing at all. Worse, getMovementPositions walks from a cell to itself by way of its right-hand
// neighbour, so turning also marked the piece as having stepped through a cell one over.
function getDirectedPiece(piece, direction) {
	return {
		...piece,
		selectedDirection: direction,
	};
}

function changeSelectedPieceDirection(pieces, direction) {
	const selectedPiece = getSelectedPiece(pieces);

	return pieces.map(piece => {
		if (piece.id === selectedPiece.id) {
			return getDirectedPiece(piece, direction);
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
			(acc, direction) => acc.concat(getFreeCells(cells.get(ceo.position).getPositionsInDirection(direction), pieces)),
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

// Where the moves AFTER this one could land, grouped by how many moves away they are: index 0 is
// one move past the current one, index 1 two past it. Only the spy fills it, because it is the one
// piece that moves a cell at a time and then has to move again — so it was the one piece whose
// player had to hold the rest of the walk in their head.
//
// Deliberately NOT part of getHighlightedPositions, and that separation is the point: the server
// re-derives legality from that list, and a cell two moves away is not a legal move. This says
// where the walk could get to and nothing else.
//
// The levels are disjoint and the nearest wins, so a cell reachable both now and later is a legal
// destination first and a preview never.
function getPreviewPositions(pieces, pieceState) {
	const walking = pieces.find(piece => piece.showMoveCells && isSpy(piece.id) && piece.position);

	return walking ? getSpyPreviewPositions(walking, pieces, pieceState) : [];
}

function getSpyPreviewPositions(spy, pieces, pieceState) {
	const levels = [];

	// The cell it is standing on is not somewhere it can get to, it is where it already is — and
	// walking out and back is exactly the move hasTurnEndedReducer refuses to call a turn.
	const seen = [spy.position];

	let frontier = [spy.position];

	for (const state of getRemainingSpyStates(spy, pieceState)) {
		frontier = getUniquePositions(
			frontier.reduce((acc, from) => acc.concat(getSpyPositionsFrom(spy, from, pieces, state)), []),
		);

		levels.push(frontier.filter(position => !areCoordsInList(position, seen)));
		seen.push(...frontier);
	}

	// The first is the move the board is already drawing in full red.
	return levels.slice(1);
}

// The spy is the only piece that moves during the walk, and every step but the last lands on an
// empty cell — a middle move may not take a piece — so relocating it is the whole simulation.
function getSpyPositionsFrom(spy, from, pieces, pieceState) {
	const stepped = pieces.map(piece => (piece.id === spy.id ? { ...piece, position: from } : piece));

	return getSpyPositions(getPieceById(spy.id, stepped), stepped, pieceState);
}

// The states a spy is in before each of its remaining moves, current move first. Walked with
// getMovedSpyState rather than written out a second time, so what the preview shows and what the
// game will actually allow cannot drift apart: a spy is finished after MOVEMENT2, MOVEMENT3 buffed.
function getRemainingSpyStates(spy, pieceState) {
	const finished = spy.buffed ? MOVEMENT3 : MOVEMENT2;
	const states = [];

	let state = pieceState;

	while (state !== finished) {
		states.push(state);
		state = getMovedSpyState(spy, state);
	}

	return states;
}

// getUniqueValues compares with includes, which is identity for a pair of coordinates.
function getUniquePositions(positions) {
	return positions.reduce(
		(unique, position) => (areCoordsInList(position, unique) ? unique : unique.concat([position])),
		[],
	);
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

// A move kills whatever else occupies the destination cell. The old double loop relied on
// killPiece mutating position to OUT_POSITION mid-iteration so the reversed pair (victim,
// killer) no longer matched — without that side effect it would have killed the mover too.
// Keying off the moved piece states the same rule directly and needs no mutation.
function killPieces(pieces, movedId) {
	const movedPiece = getPieceById(movedId, pieces);

	if (!movedPiece || !cells.inBoard(movedPiece.position)) {
		return pieces;
	}

	const withKills = pieces.map(piece => (isSamePosition(piece, movedPiece) ? killedPiece(piece, movedId) : piece));

	return cascadeCeoKills(withKills);
}

// A dead CEO takes its team's still-undeployed pieces with it whoever pulled the trigger — a move
// onto its cell or a sniper. Both paths mark the corpse in killedPiece and come through here, which
// is what a snipe used to skip: the CEO died alone and the marker stayed on it forever.
function cascadeCeoKills(pieces) {
	return pieces.filter(piece => isCeo(piece.id) && piece.teamKilledBy).reduce(killWholeTeam, pieces);
}

function killedPiece(piece, killedById) {
	const dead = {
		...piece,
		killed: true,
		position: OUT_POSITION,
		killedById,
	};

	if (isCeo(piece.id)) {
		// Transient marker: killPieces reads it to cascade the kill, then clears it.
		dead.teamKilledBy = killedById;
	}

	return dead;
}

function killWholeTeam(pieces, killedCeo) {
	const killedById = killedCeo.teamKilledBy;

	return pieces.map(piece => {
		if (piece.id === killedCeo.id) {
			return { ...piece, teamKilledBy: undefined };
		}

		// Only pieces still in the HQ; already-dead ones hold OUT_POSITION, not undefined.
		if (isSameTeam(piece, killedCeo) && !piece.position) {
			return killedPiece(piece, killedById);
		}

		return piece;
	});
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
	// The rollback runs first: every survivor goes back to its previous-turn self, so the cascade
	// then reads the HQ as it stood before the sniped move, which is the state that survives.
	const withKills = pieces.map(piece => {
		if (piece.throughSniperLineOf.length) {
			return killedPiece(piece, sniperId);
		}

		if (piece.highlight) {
			return {
				...piece,
				highlight: false,
			};
		}

		return getPieceById(piece.id, prevPieces);
	});

	return cascadeCeoKills(withKills);
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

// Assigns the highlight rather than only ever setting it, so the same function can put a snipe
// away again. It used to light snipers up and have no way of turning them off, which left the
// only exit from an armed snipe being to fire it.
function highlightSniperWithSight(piece, snipersWithSight) {
	if (!isSniper(piece.id)) {
		return piece;
	}

	const highlight = snipersWithSight.includes(piece.id);

	return piece.highlight === highlight ? piece : { ...piece, highlight };
}

function highlightSnipersWithSight(pieces) {
	const snipersWithSight = getUniqueValues(
		pieces
			.filter(piece => isInSniperSight(piece))
			.reduce((snipers, piece) => [...snipers, ...piece.throughSniperLineOf], []),
	);

	return pieces.map(piece => highlightSniperWithSight(piece, snipersWithSight));
}

// Standing down: nobody is lit, and the shot that was being lined up is not taken.
function clearSniperSights(pieces) {
	return pieces.map(piece => highlightSniperWithSight(piece, []));
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

/**
 * Whether a team is there to be claimed at all: its CEO has to be still in its HQ.
 *
 * Claiming *is* deploying that CEO — the toggle below selects it and control becomes real when it
 * lands — so a team whose CEO is already on the board cannot be claimed by anybody, its own holder
 * included. `teams.claimControl` has always refused for exactly this reason and this half did not,
 * which is the whole of a real bug: clicking claim on a team somebody else already controlled left
 * the control alone and selected their CEO anyway, handing it to whoever clicked. One predicate now,
 * called by both halves of the action, so they cannot disagree again.
 */
function canClaimControl(team, pieces) {
	return !cells.inBoard(getCeo(pieces, team).position);
}

function claimControl(team, { pieces, hasTurnEnded }) {
	if (hasTurnEnded || !canClaimControl(team, pieces)) {
		return pieces;
	}

	return pieces.map(claimControlPieceMap(team));
}

function claimControlPieceMap(team) {
	return function toggleCeo(piece) {
		if (!isCeo(piece.id)) {
			return piece;
		}

		if (getTeam(piece.id) != team) {
			return piece;
		}

		return toggledPiece(piece);
	};
}

function claimControlPieceState(team, { pieces, teamControl, pieceState }) {
	if (teamControl[team].player || !canClaimControl(team, pieces)) {
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
			return toggledPiece(piece);
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

// Either pair may be absent — an undefined position is a piece still in its HQ, an undefined
// direction one that faces nowhere yet — and areCoordsEqual answers undefined for those, so
// absence has to be settled before the coordinates are compared.
function areSameCoords(coords1, coords2) {
	if (!coords1 || !coords2) {
		return !coords1 && !coords2;
	}

	return !!areCoordsEqual(coords1, coords2);
}

// Everything a turn can leave behind: where each piece stands — a cell, an HQ or the cemetery —
// and which way it faces. Selection, highlights, CEO buffs and the sniper-line marks are all
// turn-scoped bookkeeping and deliberately excluded, which is also what lets this be compared
// against piecesPrevState: that snapshot is taken on NEXT_TURN, before those are recomputed.
function hasBoardChanged(pieces, otherPieces) {
	return pieces.some(piece => {
		const other = getPieceById(piece.id, otherPieces);

		return (
			!other ||
			!piece.killed !== !other.killed ||
			!areSameCoords(piece.position, other.position) ||
			!areSameCoords(piece.direction, other.direction)
		);
	});
}

function isPieceBlocked(selectedPiece, pieces, position1CellAhead, position2CellsAhead) {
	return (
		pieces.filter(
			piece =>
				isPieceAtPosition(piece, position1CellAhead) || isFriendlyAtPosition(piece, position2CellsAhead, selectedPiece),
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

// Whether whoever is standing on `position` has their back to the spy — straight behind them, or one
// of the two rear corners.
//
// It used to ask whether *any* piece on the board had its back turned, which is a different question
// with the same answer nearly all of the time: with one enemy in reach it is right, and it only comes
// apart when a second one is in reach as well. Then a spy was offered a kill on the piece looking
// straight at it, because some other piece somewhere had happened to turn away.
//
// A piece with no facing yet — one being placed this very turn — has no back to come at, and is not
// one either. It cannot arise while a spy is in hand, since only one piece is ever selected, but the
// answer should not depend on that.
function hasPieceBackwards(position, pieces, spyPosition) {
	const target = getPieceAtPosition(position, pieces);

	return !!(target && target.direction && isPieceBackwards(target, spyPosition));
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

function getKilledCeoCount(pieces) {
	return pieces.filter(piece => isCeo(piece.id) && piece.killed).length;
}

function hasGameFinished(pieces) {
	return getKilledCeoCount(pieces) >= NUMBER_OF_PLAYERS_KILLED_FOR_GAME_END;
}

function isTogglePieceOnCellClick(followMouse, coords, pieces, pieceState) {
	const selectedPiece = getSelectedPiece(pieces);

	// Nothing selected means there is nothing to toggle. Without this the caller went on to
	// read selectedPiece.id and threw on every click on an empty cell before picking a piece.
	if (!selectedPiece) {
		return false;
	}

	const highlightedPositions = getHighlightedPositions(pieces, pieceState);
	const pieceAtCell = getPieceAtPosition(coords, pieces);

	if (followMouse || !areCoordsInList(coords, highlightedPositions)) {
		return !pieceAtCell || pieceAtCell.id !== selectedPiece.id;
	}

	return false;
}

function isMovePieceOnCellClick(followMouse, coords, pieces, pieceState) {
	if (!getSelectedPiece(pieces)) {
		return false;
	}

	const highlightedPositions = getHighlightedPositions(pieces, pieceState);

	return !followMouse && areCoordsInList(coords, highlightedPositions);
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
	isSettledByMove,

	// DIRECTIONS
	getPossibleDirections,
	changeSelectedPieceDirection,
	getSelectedPiece,

	// POSITIONS
	getHighlightedPositions,
	getPreviewPositions,
	getPieceAtPosition,

	// SNIPERS
	removeIsThroughSniperLine,
	killSnipedPiece,
	// Which cells a sniper is watching. The game itself never draws this — a player reads it off the
	// cells another piece is quietly refused — so nothing in the play phase asks. The training board
	// does, because learning that the line is there at all is the whole of that lesson, and it has to
	// be the same list the kill is worked out from rather than a second reading of the rule.
	getSnipedPositionsBy,
	highlightSnipersWithSight,
	isInSniperSight,
	isAnyPieceThroughSniperLine,
	clearSniperSights,

	// CLAIM CONTROL
	canClaimControl,
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
	hasBoardChanged,
	getKilledCeoCount,
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
