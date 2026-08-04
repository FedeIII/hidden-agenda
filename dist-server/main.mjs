import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { randomInt, randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
//#region src/domain/phases.js
var PHASES = {
	START: "start",
	ALIGNMENT: "alignment",
	PLAY: "play",
	END: "end"
};
var ROOM_STATES = {
	LOBBY: "lobby",
	STARTED: "started"
};
function roomStateFor(phase) {
	return phase === PHASES.START ? ROOM_STATES.LOBBY : ROOM_STATES.STARTED;
}
//#endregion
//#region src/domain/roomNames.js
var ADJECTIVES = [
	"secret",
	"hidden",
	"silent",
	"quiet",
	"cunning",
	"ruthless",
	"patient",
	"restless",
	"nameless",
	"faceless",
	"double",
	"crooked",
	"loyal",
	"wary",
	"invisible",
	"sleeping",
	"burning",
	"frozen",
	"broken",
	"gilded",
	"hollow",
	"velvet",
	"brittle",
	"candid",
	"careless",
	"discreet",
	"elusive",
	"forged",
	"guarded",
	"idle",
	"jaded",
	"keen",
	"lonely",
	"masked",
	"nervous",
	"obscure",
	"polite",
	"reckless",
	"sealed",
	"shadowed",
	"sly",
	"sombre",
	"stolen",
	"sunken",
	"tangled",
	"unseen",
	"vacant",
	"veiled",
	"watchful",
	"wounded",
	"absent",
	"bitter",
	"clever",
	"deadly",
	"eager",
	"false",
	"grim",
	"humble",
	"impatient",
	"unlucky"
];
var NOUNS = [
	"agent",
	"spy",
	"traitor",
	"courier",
	"handler",
	"mole",
	"cipher",
	"dossier",
	"envelope",
	"ledger",
	"whisper",
	"rumour",
	"alias",
	"briefcase",
	"keyhole",
	"lantern",
	"matchbook",
	"notebook",
	"passport",
	"postcard",
	"signal",
	"stamp",
	"telegram",
	"typewriter",
	"umbrella",
	"vault",
	"wireless",
	"safehouse",
	"sniper",
	"chauffeur",
	"diplomat",
	"informant",
	"defector",
	"custodian",
	"gatekeeper",
	"interpreter",
	"janitor",
	"librarian",
	"locksmith",
	"messenger",
	"minister",
	"nightwatch",
	"operator",
	"photographer",
	"quartermaster",
	"receptionist",
	"secretary",
	"sentry",
	"steward",
	"switchboard",
	"telephonist",
	"understudy",
	"waiter",
	"watchman",
	"cartographer",
	"bookkeeper",
	"clockmaker",
	"tailor",
	"translator",
	"stenographer"
];
/**
* Draws a room name: one word from each list, hyphenated — `secret-agent`, `cunning-traitor`.
*
* Takes an `rng` for the same reason `pickSkin` and `deal` do: the server calls it with its own when
* a client sends no name at all, and a spec needs the draw to be deterministic.
*/
function pickRoomName(rng = Math.random) {
	return `${ADJECTIVES[Math.floor(rng() * ADJECTIVES.length) % ADJECTIVES.length]}-${NOUNS[Math.floor(rng() * NOUNS.length) % NOUNS.length]}`;
}
/**
* Trims, and collapses runs of spaces and hyphens to a single space or hyphen.
*
* Applied before storing rather than only before comparing, so the list never shows two rooms whose
* names differ by whitespace nobody can see.
*/
function normaliseRoomName(value) {
	if (typeof value !== "string") return "";
	return value.trim().replace(/\s+/g, " ").replace(/-+/g, "-");
}
function isRoomNameShaped(value) {
	const name = normaliseRoomName(value);
	return name.length >= 3 && name.length <= 24 && /^[A-Za-z0-9][A-Za-z0-9 -]*$/.test(name);
}
function searchable(value) {
	return normaliseRoomName(value).toLowerCase().replace(/-/g, " ");
}
function matchesRoomQuery(name, query) {
	const needle = searchable(query);
	return needle.length === 0 || searchable(name).includes(needle);
}
//#endregion
//#region src/domain/deal.js
var TEAMS$1 = [
	"0",
	"1",
	"2",
	"3"
];
var COPIES_PER_TEAM = 2;
function createDeck() {
	return TEAMS$1.reduce((deck, team) => deck.concat(Array(COPIES_PER_TEAM).fill(team)), []);
}
function draw(deck, excluded, rng) {
	const eligible = deck.filter((card) => card !== excluded);
	const pool = eligible.length ? eligible : deck;
	const card = pool[Math.floor(rng() * pool.length)];
	deck.splice(deck.indexOf(card), 1);
	return card;
}
function dealAlignments(playerNames, rng = Math.random) {
	const friends = createDeck();
	const foes = createDeck();
	return playerNames.map((name) => {
		const friend = draw(friends, void 0, rng);
		return {
			name,
			friend,
			foe: draw(foes, friend, rng)
		};
	});
}
//#endregion
//#region src/domain/skins.js
var SKINS = {
	DOSSIER: "dossier",
	BLUEPRINT: "blueprint",
	VAULT: "vault"
};
var SKIN_NAMES = Object.values(SKINS);
var DEFAULT_SKIN = SKINS.DOSSIER;
function isSkin(value) {
	return SKIN_NAMES.includes(value);
}
/**
* Picks a skin for a game.
*
* Takes an `rng` for the same reason `deal.js` does — the server calls it with its own, and a
* test needs to be able to make the choice deterministic. Dossier stays in the draw: keeping the
* style you started the menu in is one of the three outcomes, not a failure to change.
*/
function pickSkin(rng = Math.random) {
	return SKIN_NAMES[Math.floor(rng() * SKIN_NAMES.length) % SKIN_NAMES.length];
}
//#endregion
//#region src/domain/pieces/constants.js
var AGENT$3 = "A";
var CEO$3 = "C";
var SPY$3 = "S";
var SNIPER$3 = "N";
var TYPES = {
	AGENT: AGENT$3,
	CEO: CEO$3,
	SPY: SPY$3,
	SNIPER: SNIPER$3
};
var STATES = {
	SELECTION: "selection",
	DESELECTION: "deselection",
	PLACEMENT: "placement",
	MOVEMENT: "movement",
	MOVEMENT2: "movement2",
	MOVEMENT3: "movement3",
	COLLOCATION: "collocation"
};
var POINTS_PER_PIECE_TYPE = {
	[AGENT$3]: 5,
	[SPY$3]: 10,
	[SNIPER$3]: 10,
	[CEO$3]: 20
};
var IDS = [
	`0-${AGENT$3}1`,
	`0-${AGENT$3}2`,
	`0-${AGENT$3}3`,
	`0-${AGENT$3}4`,
	`0-${AGENT$3}5`,
	`0-${CEO$3}`,
	`0-${SPY$3}`,
	`0-${SNIPER$3}`,
	`1-${AGENT$3}1`,
	`1-${AGENT$3}2`,
	`1-${AGENT$3}3`,
	`1-${AGENT$3}4`,
	`1-${AGENT$3}5`,
	`1-${CEO$3}`,
	`1-${SPY$3}`,
	`1-${SNIPER$3}`,
	`2-${AGENT$3}1`,
	`2-${AGENT$3}2`,
	`2-${AGENT$3}3`,
	`2-${AGENT$3}4`,
	`2-${AGENT$3}5`,
	`2-${CEO$3}`,
	`2-${SPY$3}`,
	`2-${SNIPER$3}`,
	`3-${AGENT$3}1`,
	`3-${AGENT$3}2`,
	`3-${AGENT$3}3`,
	`3-${AGENT$3}4`,
	`3-${AGENT$3}5`,
	`3-${CEO$3}`,
	`3-${SPY$3}`,
	`3-${SNIPER$3}`
];
//#endregion
//#region src/domain/utils.js
function areCoordsEqual(coords1, coords2) {
	if (coords1 && coords2) return !!(coords1[0] === coords2[0] && coords1[1] === coords2[1]);
}
function areCoordsInList(coords, list) {
	return !!list.find(([x, y] = []) => areCoordsEqual(coords, [x, y]));
}
function getUniqueValues(array) {
	return array.reduce((uniqueValues, elem) => uniqueValues.includes(elem) ? uniqueValues : [...uniqueValues, elem], []);
}
var possibleDirections = [
	[1, 1],
	[1, 0],
	[0, 0],
	[-1, 0],
	[-1, 1],
	[0, 1]
];
var directions = {
	findIndex(direction) {
		return possibleDirections.findIndex(([v, h]) => areCoordsEqual([v, h], direction));
	},
	get(index) {
		return possibleDirections[index];
	},
	getAll() {
		return [...possibleDirections];
	},
	getPrevious(index) {
		let i = index - 1;
		if (i < 0) i = possibleDirections.length + i;
		return possibleDirections[i];
	},
	getFollowing(index) {
		let i = index + 1;
		if (i >= possibleDirections.length) i = i - possibleDirections.length;
		return possibleDirections[i];
	},
	getOpposite(index) {
		return directions.get(index < 3 ? index + 3 : index - 3);
	}
};
//#endregion
//#region src/domain/cells.js
var CELLS_BY_ROW = [
	4,
	5,
	6,
	7,
	6,
	5,
	4
];
CELLS_BY_ROW.map((_numberOfCells, row) => row);
var cells = [];
var OUT_POSITION = [null, null];
function createGetPositionInDirection(r, c) {
	return function getPositionInDirection([v, h] = []) {
		let hDiff = h === 0 ? 1 : -1;
		if (r < 3) {
			if (v > 0) hDiff = -h;
			else if (v < 0) hDiff = +!h;
		} else if (r === 3) {
			if (v !== 0) hDiff = -h;
		} else if (r > 3) {
			if (v > 0) hDiff = +!h;
			else if (v < 0) hDiff = -h;
		}
		const coords = [r - v, c + hDiff];
		if (inBoard(coords)) return coords;
	};
}
function createGetPositionsInDirections(r, c) {
	return function getPositionsInDirections(...directions) {
		let nextPosition = [r, c];
		return directions.map((direction) => nextPosition = nextPosition && get(nextPosition).getPositionInDirection(direction));
	};
}
function createGetPositionAfterDirections() {
	return function getPositionAfterDirections(...directions) {
		return this.getPositionsInDirections(...directions).slice(-1)[0];
	};
}
function createGetPositionsInDirection(r, c) {
	return function getPositionsInDirection([v, h] = [], positions = []) {
		const nextPosition = get(positions[positions.length - 1] || [r, c]).getPositionInDirection([v, h]);
		if (!inBoard(nextPosition)) return positions;
		return this.getPositionsInDirection([v, h], [...positions, nextPosition]);
	};
}
function getVerticalDirection(from, to) {
	if (from[0] > to[0]) return 1;
	if (from[0] === to[0]) return 0;
	if (from[0] < to[0]) return -1;
}
function getHorizontalDirection(from, to, v) {
	if (v === 0) return goingLeftDecreasesHorizontal(from, to);
	if (from[0] < 3) return getUpperHalfDirection(from, to, v);
	if (from[0] === 3) return goingLeftDecreasesHorizontal(from, to);
	if (from[0] > 3) return getLowerHalfDirection(from, to, v);
}
function getUpperHalfDirection(from, to, v) {
	if (v === 1) return goingLeftDecreasesHorizontal(from, to);
	if (v === -1) return goingRightIncreasesHorizontal(from, to);
}
function getLowerHalfDirection(from, to, v) {
	if (v === 1) return goingRightIncreasesHorizontal(from, to);
	if (v === -1) return goingLeftDecreasesHorizontal(from, to);
}
function goingLeftDecreasesHorizontal(from, to) {
	return +(from[1] > to[1]);
}
function goingRightIncreasesHorizontal(from, to) {
	return +(from[1] >= to[1]);
}
var allCells = [];
CELLS_BY_ROW.forEach((numberOfCells) => {
	const row = [];
	for (let c = 0; c < numberOfCells; c++) {
		const r = cells.length;
		row.push({
			position: [r, c],
			getPositionInDirection: createGetPositionInDirection(r, c),
			getPositionsInDirections: createGetPositionsInDirections(r, c),
			getPositionAfterDirections: createGetPositionAfterDirections(),
			getPositionsInDirection: createGetPositionsInDirection(r, c)
		});
		allCells.push([r, c]);
	}
	cells.push(row);
});
function get([r, c] = OUT_POSITION) {
	if (inBoard([r, c])) return cells[r][c];
	return {
		position: OUT_POSITION,
		getPositionInDirection: () => OUT_POSITION,
		getPositionsInDirections: () => [OUT_POSITION],
		getPositionAfterDirections: () => OUT_POSITION,
		getPositionsInDirection: () => [OUT_POSITION]
	};
}
function getAllAvailablePositions() {
	return allCells;
}
function getDirection(from, to) {
	const v = getVerticalDirection(from, to);
	return [v, getHorizontalDirection(from, to, v)];
}
function inBoard([r, c] = OUT_POSITION) {
	if (r >= 0 && r < 7) {
		if (c >= 0 && c < CELLS_BY_ROW[r]) return true;
	}
}
function getMovementPositions(from, to) {
	if (from && from.length) return (function concatPosition(movementPositions, position) {
		if (!position) return [...movementPositions, to];
		if (areCoordsEqual(position, to)) return [...movementPositions, position];
		return concatPosition([...movementPositions, position], get(position).getPositionInDirection(getDirection(position, to)));
	})([from], get(from).getPositionInDirection(getDirection(from, to)));
	return [to];
}
var cells_default = {
	get,
	getAllAvailablePositions,
	getDirection,
	inBoard,
	getMovementPositions
};
//#endregion
//#region src/domain/pieces/pz.js
var { AGENT: AGENT$2, CEO: CEO$2, SPY: SPY$2, SNIPER: SNIPER$2 } = TYPES;
var { SELECTION, MOVEMENT: MOVEMENT$1, MOVEMENT2: MOVEMENT2$1, MOVEMENT3: MOVEMENT3$1, DESELECTION, COLLOCATION: COLLOCATION$1, PLACEMENT: PLACEMENT$1 } = STATES;
function createPiece(id) {
	return {
		id,
		position: void 0,
		direction: void 0,
		selectedDirection: void 0,
		selected: false,
		killed: false,
		showMoveCells: false,
		throughSniperLineOf: [],
		buffed: false,
		highlight: false,
		killedById: void 0,
		teamKilledBy: void 0
	};
}
function init$1() {
	return IDS.map((id) => createPiece(id));
}
function toggle(state, pieceId) {
	const { hasTurnEnded, pieces, piecesPrevState } = state;
	if (hasTurnEnded) return pieces;
	if (isSniper(pieceId) && getPieceById(pieceId, pieces).highlight) return killSnipedPiece(pieces, piecesPrevState, pieceId);
	if (hasToToggle(pieceId, getSelectedPiece(pieces), state)) return pieces.map((piece) => piece.id === pieceId ? toggledPiece(piece) : piece);
	return pieces;
}
function hasToToggle(pieceId, selectedPiece, { players, snipe, pieceState, pieces, teamControl, piecesPrevState }) {
	if (snipe) return false;
	if (isToggledTeamControlled(pieceId, teamControl, piecesPrevState, players, pieces)) return false;
	if (!selectedPiece) return true;
	if (isSpy(pieceId)) {
		if (pieceState === MOVEMENT$1) return false;
		if (getPieceById(pieceId, pieces).buffed && pieceState === MOVEMENT2$1) return false;
	}
	return selectedPiece.id === pieceId;
}
function isToggledTeamControlled(pieceId, teamControl, piecesPrevState, players, pieces) {
	if (cells_default.inBoard(getPieceById(pieceId, pieces).position)) return false;
	const toggledTeam = getTeam(pieceId);
	return teamControl.map(({ player, prevPlayer, controlling }, teamIndex) => ({
		controlling,
		teamIndex,
		prevPlayer,
		player
	})).filter(({ controlling, player, prevPlayer }) => controlling && py_default.getTurn(players) != (prevPlayer || player)).map(({ teamIndex }) => String(teamIndex)).includes(toggledTeam);
}
function toggledPiece(piece) {
	if (piece.selected) return {
		...piece,
		selected: false,
		showMoveCells: false,
		direction: piece.selectedDirection
	};
	return {
		...piece,
		selected: true,
		showMoveCells: true
	};
}
function togglePieceState$1(pieceId, { pieces, pieceState, followMouse }) {
	const selectedPiece = getSelectedPiece(pieces);
	if (isSpy(pieceId, pieces)) {
		if (pieceState === MOVEMENT$1) return MOVEMENT$1;
		if (getPieceById(pieceId, pieces).buffed && pieceState === MOVEMENT2$1) return MOVEMENT2$1;
	}
	if (!!selectedPiece && selectedPiece.id !== pieceId) return pieceState;
	if (followMouse) return COLLOCATION$1;
	const toggledPiece = getPieceById(pieceId, pieces);
	if (!toggledPiece.selected) {
		if (isSniper(toggledPiece.id) && !!toggledPiece.position) return MOVEMENT$1;
		return SELECTION;
	}
	return DESELECTION;
}
function getInitialLocationCells(pieces) {
	return cells_default.getAllAvailablePositions().filter((position) => !hasPiece(position, pieces)).filter((position) => !isPositionInEnemySniperLine(position, pieces));
}
function move(pieces, id, toPosition, pieceState) {
	let movedPieces = movePieces(pieces, id, toPosition, pieceState);
	movedPieces = killPieces(movedPieces, id);
	return movedPieces;
}
function movePieces(pieces, id, toPosition, pieceState) {
	return pieces.map((piece) => {
		if (piece.id === id) return getMovedPiece(pieces, piece, toPosition, pieceState, id);
		return getNotMovedPiece(piece);
	});
}
function getMovedPiece(pieces, piece, toPosition, pieceState) {
	const movedPiece = moveByType(piece, toPosition, getSnipersInSight(piece, toPosition, pieces), pieceState);
	return movedPiece ? {
		...movedPiece,
		moved: true
	} : piece;
}
function moveByType(piece, toPosition, throughSniperLineOf, pieceState) {
	switch (getType(piece.id)) {
		case AGENT$2: return moveAgent(piece, toPosition, throughSniperLineOf);
		case CEO$2: return moveCeo(piece, toPosition, throughSniperLineOf);
		case SPY$2: return moveSpy(piece, toPosition, throughSniperLineOf, pieceState);
		case SNIPER$2: return moveSniper(piece, toPosition, throughSniperLineOf);
		default: return;
	}
}
function getNotMovedPiece(piece) {
	return piece.moved ? {
		...piece,
		moved: false
	} : piece;
}
function moveAgent(agent, toPosition, throughSniperLineOf) {
	const agentSelectedDirection = agent.position ? agent.selectedDirection : [1, 0];
	const agentDirection = willAgentSlide(agent) ? agent.direction : void 0;
	return {
		...agent,
		position: toPosition,
		direction: agentDirection,
		selectedDirection: agentSelectedDirection,
		showMoveCells: false,
		throughSniperLineOf
	};
}
function moveCeo(ceo, toPosition, throughSniperLineOf) {
	const ceoDirection = ceo.position ? cells_default.getDirection(ceo.position, toPosition) : void 0;
	const ceoSelectedDirection = ceo.position ? ceoDirection : [1, 0];
	return {
		...ceo,
		position: toPosition,
		direction: ceoDirection,
		selectedDirection: ceoSelectedDirection,
		showMoveCells: false,
		throughSniperLineOf
	};
}
function moveSpy(spy, toPosition, throughSniperLineOf, pieceState) {
	const spyDirection = spy.position ? cells_default.getDirection(spy.position, toPosition) : void 0;
	const spySelectedDirection = spy.position ? spyDirection : [1, 0];
	return {
		...spy,
		position: toPosition,
		direction: spyDirection,
		selectedDirection: spySelectedDirection,
		showMoveCells: spy.position && pieceState === SELECTION || spy.buffed && pieceState === MOVEMENT$1 ? true : false,
		throughSniperLineOf
	};
}
function moveSniper(sniper, toPosition, throughSniperLineOf) {
	const sniperDirection = sniper.position ? cells_default.getDirection(sniper.position, toPosition) : void 0;
	const sniperSelectedDirection = sniper.position ? sniperDirection : [1, 0];
	return {
		...sniper,
		position: toPosition,
		direction: sniperDirection,
		selectedDirection: sniperSelectedDirection,
		showMoveCells: false,
		throughSniperLineOf
	};
}
function movedPieceState$2(pieceId, { pieces, pieceState }) {
	const movedPiece = getPieceById(pieceId, pieces);
	if (!movedPiece.direction) return PLACEMENT$1;
	switch (getType(movedPiece.id)) {
		case SPY$2: return getMovedSpyState(movedPiece, pieceState);
		default: return MOVEMENT$1;
	}
}
function getMovedSpyState(spy, pieceState) {
	if (spy.buffed) return pieceState === MOVEMENT$1 ? MOVEMENT2$1 : pieceState === MOVEMENT2$1 ? MOVEMENT3$1 : MOVEMENT$1;
	return pieceState === MOVEMENT$1 ? MOVEMENT2$1 : MOVEMENT$1;
}
function getPossibleDirections(piece, pieces, pieceState) {
	switch (getType(piece.id)) {
		case AGENT$2: return getAgentDirections(piece, pieces, pieceState);
		case CEO$2: return getCeoDirections(piece);
		case SPY$2: return getSpyDirections(piece);
		case SNIPER$2: return getSniperDirections();
		default: return [];
	}
}
function getAgentDirections(agent, pieces, pieceState) {
	if (!agent.direction) return directions.getAll();
	if (pieceState !== SELECTION) return getThreeFrontDirections(agent.direction);
	return [];
}
function getCeoDirections(ceo) {
	if (!ceo.direction) return directions.getAll();
	return [ceo.direction];
}
function getSpyDirections(spy) {
	if (!spy.direction) return directions.getAll();
	return [spy.direction];
}
function getSniperDirections() {
	return directions.getAll();
}
function getThreeFrontDirections(direction) {
	const index = directions.findIndex(direction);
	return [
		directions.getPrevious(index),
		directions.get(index),
		directions.getFollowing(index)
	];
}
function getDirectedPiece(piece, direction) {
	return {
		...piece,
		selectedDirection: direction
	};
}
function changeSelectedPieceDirection(pieces, direction) {
	const selectedPiece = getSelectedPiece(pieces);
	return pieces.map((piece) => {
		if (piece.id === selectedPiece.id) return getDirectedPiece(piece, direction);
		return piece;
	});
}
function getHighlightedPositions(pieces, pieceState) {
	return pieces.reduce((acc, piece) => piece.showMoveCells ? acc.concat(getHighlightedPositionsFor(piece, pieces, pieceState)) : acc, []);
}
function getHighlightedPositionsFor(piece, pieces, pieceState) {
	switch (getType(piece.id)) {
		case AGENT$2: return getAgentPositions(piece, pieces);
		case CEO$2: return getCeoPositions(piece, pieces);
		case SPY$2: return getSpyPositions(piece, pieces, pieceState);
		case SNIPER$2: return getSniperPositions(piece, pieces);
		default: return [];
	}
}
function getAgentPositions(agent, pieces) {
	if (!agent.position) return getInitialLocationCells(pieces);
	const position1CellAhead = cells_default.get(agent.position).getPositionInDirection(agent.direction);
	const position2CellsAhead = cells_default.get(agent.position).getPositionAfterDirections(agent.direction, agent.direction);
	if (agent.buffed) return getBuffedAgentPositions(agent, pieces, position1CellAhead, position2CellsAhead);
	return getRegularAgentPositions(agent, pieces, position1CellAhead, position2CellsAhead);
}
function getCeoPositions(ceo, pieces) {
	if (!ceo.position) return getInitialLocationCells(pieces);
	return directions.getAll().reduce((acc, direction) => acc.concat(getFreeCells(cells_default.get(ceo.position).getPositionsInDirection(direction), pieces)), []);
}
function getSpyPositions(spy, pieces, pieceState) {
	if (!spy.position) return getInitialLocationCells(pieces);
	return getSurroundingPositions(spy.position).filter((position) => cells_default.inBoard(position)).filter((position) => {
		if (isSpyMiddleMovement(spy.buffed, pieceState)) return !isAnyPieceAtPosition(position, pieces);
		return true;
	}).filter((position) => !isFriendlyAtPosition(getPieceAtPosition(position, pieces), position, spy)).filter((position) => {
		return !hasPiece(position, pieces) || hasPieceBackwards(position, pieces, spy.position);
	});
}
function getSniperPositions(sniper, pieces) {
	if (!sniper.position) return getInitialLocationCells(pieces).filter((position) => hasAvailableDirectionsForSniper(position, sniper, pieces));
	return [];
}
function isSpyMiddleMovement(buffed, pieceState) {
	return pieceState === SELECTION || buffed && pieceState === MOVEMENT$1;
}
function getFreePositionAt(position, piece, pieces) {
	const pieceAtPosition = getPieceAtPosition(position, pieces);
	if (!pieceAtPosition || !isSameTeam(pieceAtPosition, piece)) return [position];
	return [];
}
function getBuffedAgentPositions(agent, pieces, position1CellAhead, position2CellsAhead) {
	const agentPositions = getPieceAtPosition(position1CellAhead, pieces) ? getFreePositionAt(position1CellAhead, agent, pieces) : [position1CellAhead, ...getFreePositionAt(position2CellsAhead, agent, pieces)];
	if (agentPositions.some((position) => !position)) return getInitialLocationCells(pieces);
	return agentPositions;
}
function getRegularAgentPositions(agent, pieces, position1CellAhead, position2CellsAhead) {
	if (!isPieceBlocked(agent, pieces, position1CellAhead, position2CellsAhead)) {
		if (position2CellsAhead) return [position2CellsAhead];
		return getInitialLocationCells(pieces);
	}
	return [];
}
function getSurroundingPositions(position) {
	return directions.getAll().map((direction) => cells_default.get(position).getPositionInDirection(direction));
}
function getPieceAtPosition(position, pieces) {
	return pieces.find((piece) => areCoordsEqual(piece.position, position));
}
function getThreeBackPositions(piece) {
	return getThreeFrontDirections(directions.getOpposite(directions.findIndex(piece.direction))).map((direction) => cells_default.get(piece.position).getPositionInDirection(direction));
}
function getFreeCells(positions, pieces) {
	if (positions.length && !isAnyPieceAtPosition(positions[0], pieces)) return [positions[0]].concat(getFreeCells(positions.slice(1), pieces));
	return [];
}
function getFreeCellsUntilPiece(positions, pieces) {
	if (positions.length) {
		if (isAnyPieceAtPosition(positions[0], pieces)) return [positions[0]];
		return [positions[0]].concat(getFreeCellsUntilPiece(positions.slice(1), pieces));
	}
	return [];
}
function killPieces(pieces, movedId) {
	const movedPiece = getPieceById(movedId, pieces);
	if (!movedPiece || !cells_default.inBoard(movedPiece.position)) return pieces;
	return cascadeCeoKills(pieces.map((piece) => isSamePosition(piece, movedPiece) ? killedPiece(piece, movedId) : piece));
}
function cascadeCeoKills(pieces) {
	return pieces.filter((piece) => isCeo(piece.id) && piece.teamKilledBy).reduce(killWholeTeam, pieces);
}
function killedPiece(piece, killedById) {
	const dead = {
		...piece,
		killed: true,
		position: OUT_POSITION,
		killedById
	};
	if (isCeo(piece.id)) dead.teamKilledBy = killedById;
	return dead;
}
function killWholeTeam(pieces, killedCeo) {
	const killedById = killedCeo.teamKilledBy;
	return pieces.map((piece) => {
		if (piece.id === killedCeo.id) return {
			...piece,
			teamKilledBy: void 0
		};
		if (isSameTeam(piece, killedCeo) && !piece.position) return killedPiece(piece, killedById);
		return piece;
	});
}
function addPieceToCount(pieceCount, piece) {
	const type = getType(piece.id);
	return {
		...pieceCount,
		[type]: pieceCount[type] + 1
	};
}
function getKilledPiecesByTeam(team, pieces) {
	return pieces.filter((piece) => piece.killedById && getTeam(piece.killedById) === team).reduce(addPieceToCount, {
		A: 0,
		S: 0,
		N: 0,
		C: 0
	});
}
function getSnipers(pieces) {
	return pieces.filter((piece) => isSniper(piece.id));
}
function isPositionInEnemySniperLine(position, pieces) {
	return getSnipers(pieces).filter((sniper) => !isSameTeam(sniper, getSelectedPiece(pieces))).reduce((isInSniperLine, sniper) => {
		return isInSniperLine || areCoordsInList(position, getSnipedPositionsBy(sniper, pieces));
	}, false);
}
function getSnipersInSight(piece, toPosition, pieces) {
	if (piece.position) {
		const allSnipedPositions = getSnipedPositions(pieces, piece);
		const movementPositions = cells_default.getMovementPositions(piece.position, toPosition);
		return Object.entries(allSnipedPositions).reduce((allSnipersInSight, [sniperId, snipedPositions]) => [...allSnipersInSight, ...movementPositions.reduce((snipersInSight, position) => {
			if (areCoordsInList(position, snipedPositions)) return [...snipersInSight, sniperId];
			return snipersInSight;
		}, [])], []);
	}
	return [];
}
function removeIsThroughSniperLine(pieces) {
	return pieces.map((piece) => ({
		...piece,
		throughSniperLineOf: []
	}));
}
function killSnipedPiece(pieces, prevPieces, sniperId) {
	return cascadeCeoKills(pieces.map((piece) => {
		if (piece.throughSniperLineOf.length) return killedPiece(piece, sniperId);
		if (piece.highlight) return {
			...piece,
			highlight: false
		};
		return getPieceById(piece.id, prevPieces);
	}));
}
function getSnipedPositions(pieces, piece) {
	return pieces.filter((eachPiece) => isSniper(eachPiece.id) && !isSameTeam(piece, eachPiece) && eachPiece.position).reduce((snipedPositions, sniper) => ({
		...snipedPositions,
		[sniper.id]: getSnipedPositionsBy(sniper, pieces)
	}), {});
}
function getSnipedPositionsBy(sniper, pieces) {
	const buffedSnipedPositions = cells_default.get(sniper.position).getPositionsInDirection(sniper.direction);
	if (sniper.buffed) return buffedSnipedPositions;
	return getFreeCellsUntilPiece(buffedSnipedPositions, pieces);
}
function isDirectionAvailableForSniper(position, direction, sniper, pieces) {
	return cells_default.get(position).getPositionsInDirection(direction).reduce((noPiecesInAnyPosition, position) => {
		const pieceAtPosition = getPieceAtPosition(position, pieces);
		return noPiecesInAnyPosition && (!pieceAtPosition || isSameTeam(pieceAtPosition, sniper));
	}, true);
}
function hasAvailableDirectionsForSniper(position, sniper, pieces) {
	return directions.getAll().reduce((hasAvailableDirections, direction) => hasAvailableDirections || isDirectionAvailableForSniper(position, direction, sniper, pieces), false);
}
function highlightSniperWithSight(piece, snipersWithSight) {
	if (!isSniper(piece.id)) return piece;
	const highlight = snipersWithSight.includes(piece.id);
	return piece.highlight === highlight ? piece : {
		...piece,
		highlight
	};
}
function highlightSnipersWithSight(pieces) {
	const snipersWithSight = getUniqueValues(pieces.filter((piece) => isInSniperSight(piece)).reduce((snipers, piece) => [...snipers, ...piece.throughSniperLineOf], []));
	return pieces.map((piece) => highlightSniperWithSight(piece, snipersWithSight));
}
function clearSniperSights(pieces) {
	return pieces.map((piece) => highlightSniperWithSight(piece, []));
}
function isSniperOnBoard(pieces) {
	return !!pieces.find((piece) => getType(piece.id) === SNIPER$2 && cells_default.inBoard(piece.position));
}
function isInSniperSight(piece) {
	return !!piece.throughSniperLineOf.length;
}
function isAnyPieceThroughSniperLine(pieces) {
	return pieces.some(isInSniperSight);
}
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
	return !cells_default.inBoard(getCeo(pieces, team).position);
}
function claimControl$1(team, { pieces, hasTurnEnded }) {
	if (hasTurnEnded || !canClaimControl(team, pieces)) return pieces;
	return pieces.map(claimControlPieceMap(team));
}
function claimControlPieceMap(team) {
	return function toggleCeo(piece) {
		if (!isCeo(piece.id)) return piece;
		if (getTeam(piece.id) != team) return piece;
		return toggledPiece(piece);
	};
}
function claimControlPieceState(team, { pieces, teamControl, pieceState }) {
	if (teamControl[team].player || !canClaimControl(team, pieces)) return pieceState;
	return SELECTION;
}
function cancelControl$1(team, { pieces, teamControl }) {
	return pieces.map(cancelControlPieceMap(team, teamControl));
}
function cancelControlPieceMap(team, teamControl) {
	return function toggleCeo(piece) {
		if (!isCeo(piece.id)) return piece;
		if (getTeam(piece.id) != team) return piece;
		if (teamControl[team].player) return toggledPiece(piece);
		return piece;
	};
}
function cancelControlPieceState() {
	return DESELECTION;
}
function setCeoBuffs(piece, _index, pieces) {
	return {
		...piece,
		buffed: isNextToCeo(piece, pieces)
	};
}
function areSameCoords(coords1, coords2) {
	if (!coords1 || !coords2) return !coords1 && !coords2;
	return !!areCoordsEqual(coords1, coords2);
}
function hasBoardChanged(pieces, otherPieces) {
	return pieces.some((piece) => {
		const other = getPieceById(piece.id, otherPieces);
		return !other || !piece.killed !== !other.killed || !areSameCoords(piece.position, other.position) || !areSameCoords(piece.direction, other.direction);
	});
}
function isPieceBlocked(selectedPiece, pieces, position1CellAhead, position2CellsAhead) {
	return pieces.filter((piece) => isPieceAtPosition(piece, position1CellAhead) || isFriendlyAtPosition(piece, position2CellsAhead, selectedPiece)).length !== 0;
}
function isPieceAtPosition(piece, position) {
	return areCoordsEqual(piece.position, position);
}
function isFriendlyAtPosition(piece, position, selectedPiece) {
	return piece && areCoordsEqual(piece.position, position) && isSameTeam(piece, selectedPiece);
}
function isAnyPieceAtPosition(position, pieces) {
	return areCoordsInList(position, pieces.reduce((acc, { position }) => position ? acc.concat([position]) : acc, []));
}
function isSameTeam(piece1, piece2) {
	return getTeam(piece1.id) === getTeam(piece2.id);
}
function isDifferentPiece(piece1, piece2) {
	return piece1.id !== piece2.id;
}
function isSamePosition(piece1, piece2) {
	if (isDifferentPiece(piece1, piece2) && cells_default.inBoard(piece1.position) && cells_default.inBoard(piece2.position)) return areCoordsEqual(piece1.position, piece2.position);
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
	return getSurroundingPositions(piece.position).reduce((isCeoPresent, position) => isCeoPresent || isOwnCeoInPosition(piece, position, pieces), false);
}
function hasPiece(position, pieces) {
	return !!getPieceAtPosition(position, pieces);
}
function hasPieceBackwards(position, pieces, spyPosition) {
	return !!(hasPiece(position, pieces) && pieces.find((piece) => isPieceBackwards(piece, spyPosition)));
}
function isPieceBackwards(piece, from) {
	return areCoordsInList(from, getThreeBackPositions(piece));
}
function willAgentSlide({ position, direction }) {
	return cells_default.inBoard(cells_default.get(position).getPositionAfterDirections(direction, direction));
}
function isAgent(id) {
	return getType(id) === AGENT$2;
}
function isSpy(id) {
	return getType(id) === SPY$2;
}
function isCeo(id) {
	return getType(id) === CEO$2;
}
function isSniper(id) {
	return getType(id) === SNIPER$2;
}
function getKilledCeoCount(pieces) {
	return pieces.filter((piece) => isCeo(piece.id) && piece.killed).length;
}
function hasGameFinished(pieces) {
	return getKilledCeoCount(pieces) >= 3;
}
function isTogglePieceOnCellClick(followMouse, coords, pieces, pieceState) {
	const selectedPiece = getSelectedPiece(pieces);
	if (!selectedPiece) return false;
	const highlightedPositions = getHighlightedPositions(pieces, pieceState);
	const pieceAtCell = getPieceAtPosition(coords, pieces);
	if (followMouse || !areCoordsInList(coords, highlightedPositions)) return !pieceAtCell || pieceAtCell.id !== selectedPiece.id;
	return false;
}
function isMovePieceOnCellClick(followMouse, coords, pieces, pieceState) {
	if (!getSelectedPiece(pieces)) return false;
	const highlightedPositions = getHighlightedPositions(pieces, pieceState);
	return !followMouse && areCoordsInList(coords, highlightedPositions);
}
function getSelectedPiece(pieces) {
	return pieces.find((piece) => piece.selected);
}
function getAllTeamPieces(team, pieces) {
	return pieces.filter((piece) => getTeam(piece.id) === team);
}
function getTeam(id) {
	return id.charAt(0);
}
function getType(id) {
	return id.charAt(2);
}
function getNumber(id) {
	return id.charAt(3) || "";
}
function getPieceById(id, pieces) {
	return pieces.find((piece) => piece.id === id);
}
function getCeo(pieces, team) {
	return pieces.find((piece) => isCeo(piece.id) && getTeam(piece.id) == team);
}
function getSurvivorsForTeam(team, pieces) {
	return pieces.filter((piece) => getTeam(piece.id) === team && piece.position && !piece.killed).reduce(addPieceToCount, {
		A: 0,
		S: 0,
		N: 0,
		C: 0
	});
}
var pz = {
	init: init$1,
	toggle,
	togglePieceState: togglePieceState$1,
	move,
	movedPieceState: movedPieceState$2,
	getPossibleDirections,
	changeSelectedPieceDirection,
	getSelectedPiece,
	getHighlightedPositions,
	getPieceAtPosition,
	removeIsThroughSniperLine,
	killSnipedPiece,
	highlightSnipersWithSight,
	isInSniperSight,
	isAnyPieceThroughSniperLine,
	clearSniperSights,
	canClaimControl,
	claimControl: claimControl$1,
	claimControlPieceState,
	cancelControl: cancelControl$1,
	cancelControlPieceState,
	getKilledPiecesByTeam,
	setCeoBuffs,
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
	getTeam,
	getType,
	getNumber,
	getPieceById,
	getSurvivorsForTeam,
	getAllTeamPieces,
	getCeo
};
//#endregion
//#region src/domain/teams.js
var TEAM_COLORS = {
	0: "black",
	1: "red",
	2: "white",
	3: "yellow"
};
TEAM_COLORS[0].toUpperCase(), TEAM_COLORS[1].toUpperCase(), TEAM_COLORS[2].toUpperCase(), TEAM_COLORS[3].toUpperCase();
function initControl() {
	return [
		{
			player: null,
			prevPlayer: null,
			claimEnabled: true,
			controlling: false
		},
		{
			player: null,
			prevPlayer: null,
			claimEnabled: true,
			controlling: false
		},
		{
			player: null,
			prevPlayer: null,
			claimEnabled: true,
			controlling: false
		},
		{
			player: null,
			prevPlayer: null,
			claimEnabled: true,
			controlling: false
		}
	];
}
function claimControl(playerName, team, { pieces, teamControl, hasTurnEnded }) {
	if (hasTurnEnded || !pz.canClaimControl(team, pieces)) return teamControl;
	return teamControl.map(setControlFor(playerName, team, pieces));
}
function setControlFor(playerName, team, pieces) {
	return function mapTeamControl(teamControl, teamIndex) {
		const { player, controlling } = teamControl;
		if (teamIndex == team) return {
			player: playerName,
			prevPlayer: player,
			claimEnabled: true,
			controlling
		};
		if (player == playerName) return {
			player: null,
			prevPlayer: player,
			claimEnabled: pz.canClaimControl(teamIndex, pieces),
			controlling: false
		};
		return teamControl;
	};
}
function cancelControl(team, { pieces, teamControl }) {
	return teamControl.map(removeControlFor(team, pieces));
}
function removeControlFor(team, pieces) {
	return function mapTeamControl(teamControl, teamIndex) {
		const { prevPlayer, controlling } = teamControl;
		if (teamIndex == team) return {
			player: prevPlayer,
			prevPlayer: null,
			claimEnabled: pz.canClaimControl(team, pieces),
			controlling
		};
		return teamControl;
	};
}
function releasePlayer(playerName, { teamControl, pieces }) {
	return teamControl.map((control, teamIndex) => {
		const heldByThem = control.player === playerName;
		if (!heldByThem && control.prevPlayer !== playerName) return control;
		return {
			player: heldByThem ? null : control.player,
			prevPlayer: control.prevPlayer === playerName ? null : control.prevPlayer,
			claimEnabled: pz.canClaimControl(teamIndex, pieces),
			controlling: heldByThem ? false : control.controlling
		};
	});
}
function getPointsFromKills(team, pieces) {
	return Object.entries(pz.getKilledPiecesByTeam(team, pieces)).reduce((score, [pieceType, pieceCount]) => score + POINTS_PER_PIECE_TYPE[pieceType] * pieceCount, 0);
}
function getPointsFromSurvivors(team, pieces) {
	return pieces.filter((piece) => pz.getTeam(piece.id) === team && piece.position && !piece.killed).reduce((score, piece) => score + POINTS_PER_PIECE_TYPE[pz.getType(piece.id)], 0);
}
function getPointsForTeam(team, pieces) {
	return getPointsFromKills(team, pieces) + getPointsFromSurvivors(team, pieces);
}
function movePieceForControl(pieceId, { teamControl, pieces }) {
	if (isCeoPlacement(pieceId, pieces)) return teamControl.map(mapDeployedCeo(pieceId));
	return teamControl;
}
function isCeoPlacement(pieceId, pieces) {
	return pz.isCeo(pieceId) && !pz.getPieceById(pieceId, pieces).position;
}
function mapDeployedCeo(ceoId) {
	const ceoTeam = pz.getTeam(ceoId);
	return function setTeamControl(teamControl, teamIndex) {
		const { player } = teamControl;
		if (teamIndex == ceoTeam) return {
			player,
			prevPlayer: null,
			claimEnabled: false,
			controlling: !!player
		};
		return teamControl;
	};
}
function revealFriend$1(players, { teamControl, pieces }) {
	const player = players.find((p) => p.turn);
	return teamControl.map(controlRevealedTeam(player.name, player.alignment.friend, pieces));
}
function revealFoe$1(players, { teamControl, pieces }) {
	const player = players.find((p) => p.turn);
	return teamControl.map(controlRevealedTeam(player.name, player.alignment.foe, pieces));
}
function controlRevealedTeam(playerName, team, pieces) {
	return function setControlledTeam(teamControl, teamIndex) {
		const { player } = teamControl;
		if (teamIndex == team) return {
			player: playerName,
			prevPlayer: null,
			claimEnabled: pz.canClaimControl(team, pieces),
			controlling: true
		};
		if (player == playerName) return {
			player: null,
			prevPlayer: null,
			claimEnabled: pz.canClaimControl(teamIndex, pieces),
			controlling: false
		};
		return teamControl;
	};
}
var teams_default = {
	initControl,
	claimControl,
	cancelControl,
	releasePlayer,
	getPointsForTeam,
	movePieceForControl,
	revealFriend: revealFriend$1,
	revealFoe: revealFoe$1
};
//#endregion
//#region src/domain/py.js
var NO_PLAYER = {
	name: null,
	score: 0
};
function init(playerNames) {
	return playerNames.map((name, i) => ({
		name,
		turn: i === 0,
		alignment: {
			friend: void 0,
			foe: void 0
		},
		revealed: {
			friend: false,
			foe: false
		},
		exposed: {
			friend: null,
			foe: null
		},
		lastAccusation: null,
		allowedToAccuse: {
			friend: true,
			foe: true
		}
	}));
}
function nextTurn$1(players) {
	const currentIndex = players.findIndex((player) => player.turn);
	const nextIndex = currentIndex + 1 >= players.length ? 0 : currentIndex + 1;
	return players.map((player, i) => ({
		...player,
		turn: i === nextIndex
	}));
}
/**
* Somebody has left the table mid-game.
*
* Nothing on the board is orphaned by this, and that is a property of the game rather than luck:
* pieces belong to *teams*, every player moves every team's pieces, and a team is only ever claimed.
* What leaves with a player is a place in the turn order and a pair of cards nobody will score.
*
* The turn is the one thing that cannot simply be filtered out. Exactly one player holds it at all
* times and `getTurn` reads that with no guard, so if it was theirs it moves on to whoever it would
* have gone to next. The server passes the turn properly first — a turn change is more than a flag,
* it snapshots the board for the sniper rollback and recomputes the CEO buffs — but the invariant is
* kept here as well, because this is the function that could break it.
*/
function removePlayer$1(players, name) {
	const index = players.findIndex((player) => player.name === name);
	if (index === -1) return players;
	const remaining = players.filter((player) => player.name !== name);
	if (!remaining.length || !players[index].turn) return remaining;
	const next = players[(index + 1) % players.length].name;
	return remaining.map((player) => ({
		...player,
		turn: player.name === next
	}));
}
function setAlignment$1(players, playerName, friend, foe) {
	return players.map((player) => {
		if (player.name === playerName) return {
			...player,
			alignment: {
				friend: typeof friend === "undefined" ? player.alignment.friend : friend,
				foe: typeof foe === "undefined" ? player.alignment.foe : foe
			}
		};
		return player;
	});
}
function getTurn(players) {
	return players.find((player) => player.turn).name;
}
function isRevealActive(players) {
	const player = players.find((player) => player.turn);
	return !player.revealed.friend || !player.revealed.foe;
}
function isOwnFriendRevealed(players) {
	return players.find((player) => player.turn).revealed.friend;
}
function isOwnFoeRevealed(players) {
	return players.find((player) => player.turn).revealed.foe;
}
function revealFriend(players) {
	const playerName = getTurn(players);
	return players.map((player) => {
		if (player.name == playerName) return {
			...player,
			revealed: {
				friend: true,
				foe: player.revealed.foe
			}
		};
		return player;
	});
}
function revealFoe(players) {
	const playerName = getTurn(players);
	return players.map((player) => {
		if (player.name == playerName) return {
			...player,
			revealed: {
				foe: true,
				friend: player.revealed.friend
			}
		};
		return player;
	});
}
function isPlayerTurn(players, player) {
	return py_default.getTurn(players) == player.name;
}
function accuse({ accuser, accusee, alignment, team }, players) {
	const accuserPlayer = players.find((player) => player.name == accuser);
	const accuseePlayer = players.find((player) => player.name == accusee);
	if (!accuserPlayer.allowedToAccuse[alignment]) return players;
	const isAccuserCorrect = accuseePlayer.alignment[alignment] == team;
	if (isAccuserCorrect && accuseePlayer.revealed[alignment]) return players;
	return players.map((player) => {
		if (player.name == accuser) return {
			...player,
			allowedToAccuse: {
				...player.allowedToAccuse,
				[alignment]: isAccuserCorrect
			},
			lastAccusation: {
				accusee,
				alignment,
				team,
				correct: isAccuserCorrect
			}
		};
		if (player.name == accusee) {
			const exposed = player.exposed || {
				friend: null,
				foe: null
			};
			return {
				...player,
				revealed: {
					...player.revealed,
					[alignment]: isAccuserCorrect
				},
				exposed: {
					...exposed,
					[alignment]: isAccuserCorrect ? accuser : exposed[alignment]
				}
			};
		}
		return player;
	});
}
function getPoints(player, pieces) {
	const { friend, foe } = player.alignment;
	const { friend: isFriendRevealed, foe: isFoeRevealed } = player.revealed;
	const friendPoints = teams_default.getPointsForTeam(friend, pieces);
	const foePoints = teams_default.getPointsForTeam(foe, pieces);
	return 100 - 50 * isFriendRevealed - 50 * isFoeRevealed + friendPoints - foePoints;
}
function getWinner(players, pieces) {
	return players.reduce((winner, player) => {
		const score = py_default.getPoints(player, pieces);
		if (winner.score > score) return winner;
		else return {
			...player,
			score
		};
	}, NO_PLAYER);
}
function sortByPoints(players, pieces) {
	return players.slice().sort((player1, player2) => getPoints(player2, pieces) - getPoints(player1, pieces));
}
var py_default = {
	init,
	nextTurn: nextTurn$1,
	removePlayer: removePlayer$1,
	setAlignment: setAlignment$1,
	getTurn,
	isRevealActive,
	isOwnFriendRevealed,
	isOwnFoeRevealed,
	revealFriend,
	revealFoe,
	isPlayerTurn,
	accuse,
	getPoints,
	getWinner,
	sortByPoints
};
//#endregion
//#region src/game/actions.js
var START_GAME = "START_GAME";
function startGame(players) {
	return {
		type: START_GAME,
		payload: players
	};
}
var SET_ALIGNMENT = "SET_ALIGNMENT";
function setAlignment({ name, friend, foe }) {
	return {
		type: SET_ALIGNMENT,
		payload: {
			name,
			friend,
			foe
		}
	};
}
var NEXT_TURN = "NEXT_TURN";
function nextTurn() {
	return { type: NEXT_TURN };
}
var REMOVE_PLAYER = "REMOVE_PLAYER";
function removePlayer(name) {
	return {
		type: REMOVE_PLAYER,
		payload: { name }
	};
}
var TOGGLE_PIECE = "TOGGLE_PIECE";
var MOVE_PIECE = "MOVE_PIECE";
var DIRECT_PIECE = "DIRECT_PIECE";
var SNIPE = "SNIPE";
var CLAIM_CONTROL = "CLAIM_CONTROL";
var CANCEL_CONTROL = "CANCEL_CONTROL";
var REVEAL_FRIEND = "REVEAL_FRIEND";
var REVEAL_FOE = "REVEAL_FOE";
var ACCUSE = "ACCUSE";
//#endregion
//#region src/game/reducers/playersReducer.js
function playersReducer({ players }, action) {
	switch (action.type) {
		case START_GAME: return py_default.init(action.payload);
		case NEXT_TURN: return py_default.nextTurn(players);
		case REMOVE_PLAYER: return py_default.removePlayer(players, action.payload.name);
		case SET_ALIGNMENT: {
			const { name, friend, foe } = action.payload;
			return py_default.setAlignment(players, name, friend, foe);
		}
		case REVEAL_FRIEND: return py_default.revealFriend(players);
		case REVEAL_FOE: return py_default.revealFoe(players);
		case ACCUSE: return py_default.accuse(action.payload, players);
		default: return players;
	}
}
//#endregion
//#region src/game/reducers/hasTurnEndedReducer.js
var { AGENT: AGENT$1, CEO: CEO$1, SPY: SPY$1, SNIPER: SNIPER$1 } = TYPES;
var { MOVEMENT, MOVEMENT2, MOVEMENT3, PLACEMENT } = STATES;
function hasPieceEndedTurn(pieces, pieceState, toggledPieceId) {
	const selectedPiece = pz.getSelectedPiece(pieces);
	if (selectedPiece && selectedPiece.id === toggledPieceId) switch (pz.getType(selectedPiece.id)) {
		case AGENT$1: return pieceState === PLACEMENT || pieceState === MOVEMENT;
		case CEO$1: return pieceState === PLACEMENT || pieceState === MOVEMENT;
		case SPY$1: return selectedPiece.buffed ? pieceState === PLACEMENT || pieceState === MOVEMENT3 : pieceState === PLACEMENT || pieceState === MOVEMENT2;
		case SNIPER$1: return pieceState === PLACEMENT || pieceState === MOVEMENT;
		default: return false;
	}
	return false;
}
function hasTurnChangedTheBoard(state, toggledPieceId) {
	return pz.hasBoardChanged(pz.toggle(state, toggledPieceId), state.piecesPrevState);
}
function isPieceBeingDropped(state, toggledPieceId) {
	if (state.hasTurnEnded) return true;
	return hasPieceEndedTurn(state.pieces, state.pieceState, toggledPieceId) && hasTurnChangedTheBoard(state, toggledPieceId);
}
function isSniperSelectedForSnipe(snipe, pieceId) {
	return snipe && pz.isSniper(pieceId);
}
function togglePieceState(state, pieceId) {
	return isPieceBeingDropped(state, pieceId) || isSniperSelectedForSnipe(state.snipe, pieceId);
}
function snipeState$2(state) {
	if (state.snipe) return !pz.getSelectedPiece(state.pieces) && pz.hasBoardChanged(state.pieces, state.piecesPrevState);
	if (pz.isAnyPieceThroughSniperLine(state.pieces)) return false;
	return state.hasTurnEnded;
}
function hasTurnEndedReducer(state, action) {
	switch (action.type) {
		case NEXT_TURN: return false;
		case START_GAME: return false;
		case TOGGLE_PIECE: return togglePieceState(state, action.payload.pieceId);
		case MOVE_PIECE: return false;
		case SNIPE: return snipeState$2(state);
		default: return state.hasTurnEnded;
	}
}
//#endregion
//#region src/game/reducers/piecesReducer.js
function toggledPieceState(state, pieceId) {
	return pz.toggle(state, pieceId);
}
function movedPieceState$1({ pieces, pieceState }, { pieceId, coords }) {
	return pz.move(pieces, pieceId, coords, pieceState);
}
function directedPieceState(pieces, direction) {
	return pz.changeSelectedPieceDirection(pieces, direction);
}
function nextTurnState(pieces) {
	return pz.removeIsThroughSniperLine(pieces).map(pz.setCeoBuffs);
}
function snipeState$1({ pieces, snipe }) {
	return snipe ? pz.clearSniperSights(pieces) : pz.highlightSnipersWithSight(pieces);
}
function claimControlState(payload, state) {
	const { team } = payload;
	return pz.claimControl(team, state);
}
function cancelControlState(payload, state) {
	const { team } = payload;
	return pz.cancelControl(team, state);
}
function piecesReducer(state, action) {
	switch (action.type) {
		case TOGGLE_PIECE: return [...toggledPieceState(state, action.payload.pieceId)];
		case MOVE_PIECE: return [...movedPieceState$1(state, action.payload)];
		case DIRECT_PIECE: return [...directedPieceState(state.pieces, action.payload)];
		case NEXT_TURN: return [...nextTurnState(state.pieces)];
		case SNIPE: return [...snipeState$1(state)];
		case CLAIM_CONTROL: return [...claimControlState(action.payload, state)];
		case CANCEL_CONTROL: return [...cancelControlState(action.payload, state)];
		default: return state.pieces;
	}
}
//#endregion
//#region src/game/reducers/pieceStateReducer.js
/**
* undefined === in HQ
*
* AGENT: SELECTION => DESELECTION
*                  => PLACEMENT => COLLOCATION
*                  => MOVEMENT => COLLOCATION
*
* SPY: SELECTION => DESELECTION
*                => PLACEMENT => COLLOCATION
*                => MOVEMENT => MOVEMENT2 => COLLOCATION
*                                (buffed) => MOVEMENT3 => COLLOCATION
*
* CEO: SELECTION => DESELECTION
*                => PLACEMENT => COLLOCATION
*                => MOVEMENT => DESELECTION
*
* SNIPER: SELECTION => DESELECTION
*                   => PLACEMENT => COLLOCATION
*                   => MOVEMENT => COLLOCATION
*/
function pieceStateReducer(state, action) {
	let result;
	if (!state.hasTurnEnded) switch (action.type) {
		case TOGGLE_PIECE:
			result = pz.togglePieceState(action.payload.pieceId, state);
			break;
		case MOVE_PIECE:
			result = pz.movedPieceState(action.payload.pieceId, state);
			break;
		case CLAIM_CONTROL:
			result = pz.claimControlPieceState(action.payload.team, state);
			break;
		case CANCEL_CONTROL:
			result = pz.cancelControlPieceState();
			break;
		default: result = state.pieceState;
	}
	else result = state.pieceState;
	return result;
}
//#endregion
//#region src/game/reducers/followMouseReducer.js
var { AGENT, CEO, SPY, SNIPER } = TYPES;
var { COLLOCATION } = STATES;
function movedPieceState({ pieces, followMouse, pieceState }) {
	const selectedPiece = pz.getSelectedPiece(pieces);
	switch (pz.getType(selectedPiece.id)) {
		case AGENT: return true;
		case CEO: return pieceState === COLLOCATION;
		case SPY: return false;
		case SNIPER: return true;
		default: return followMouse;
	}
}
function followMouseReducer(state, action) {
	switch (action.type) {
		case MOVE_PIECE: return movedPieceState(state);
		case DIRECT_PIECE: return true;
		default: return false;
	}
}
//#endregion
//#region src/game/reducers/snipeReducer.js
function snipeState(pieces) {
	return pieces.some((piece) => pz.isInSniperSight(piece));
}
function snipeReducer(state, action) {
	switch (action.type) {
		case SNIPE: return state.snipe ? false : snipeState(state.pieces);
		case NEXT_TURN: return false;
		default: return state.snipe;
	}
}
//#endregion
//#region src/game/reducers/piecesPrevStateReducer.js
function piecesPrevStateReducer(state, action) {
	switch (action.type) {
		case NEXT_TURN: return [...state.pieces];
		default: return state.piecesPrevState;
	}
}
//#endregion
//#region src/game/reducers/teamControlReducer.js
function teamControlReducer(state, action) {
	switch (action.type) {
		case CLAIM_CONTROL: return teams_default.claimControl(action.payload.playerName, action.payload.team, state);
		case REMOVE_PLAYER: return teams_default.releasePlayer(action.payload.name, state);
		case CANCEL_CONTROL: return teams_default.cancelControl(action.payload.team, state);
		case MOVE_PIECE: return teams_default.movePieceForControl(action.payload.pieceId, state);
		case REVEAL_FRIEND: return teams_default.revealFriend(state.players, state);
		case REVEAL_FOE: return teams_default.revealFoe(state.players, state);
		default: return state.teamControl;
	}
}
//#endregion
//#region src/game/reducer.js
var reducers = {
	players: playersReducer,
	hasTurnEnded: hasTurnEndedReducer,
	pieces: piecesReducer,
	pieceState: pieceStateReducer,
	followMouse: followMouseReducer,
	snipe: snipeReducer,
	piecesPrevState: piecesPrevStateReducer,
	teamControl: teamControlReducer
};
function reduceSlices(state, action) {
	return Object.entries(reducers).reduce((newState, [slice, reducer]) => ({
		...newState,
		[slice]: reducer(state, action)
	}), {});
}
function createInitialState() {
	return {
		players: [],
		hasTurnEnded: false,
		pieces: pz.init(),
		pieceState: void 0,
		followMouse: false,
		snipe: false,
		piecesPrevState: pz.init(),
		teamControl: teams_default.initControl()
	};
}
function createGameReducer({ debug = false } = {}) {
	return function gameReducer(state, action) {
		const newState = action.type === "SYNC_STATE" ? action.payload : reduceSlices(state, action);
		if (debug) console.log(action, "=>", newState);
		return newState;
	};
}
var gameReducer = createGameReducer();
//#endregion
//#region server/codes.js
var ALPHABET = "ABCDEFGHJKLMNPQRTUVWXYZ2346789";
var MAX_ATTEMPTS = 200;
function createCode(isTaken = () => false) {
	for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
		let code = "";
		for (let i = 0; i < 4; i++) code += ALPHABET[randomInt(30)];
		if (!isTaken(code)) return code;
	}
	throw new Error("could not allocate a free room code");
}
function isCodeShaped(value) {
	return typeof value === "string" && new RegExp(`^[ABCDEFGHJKLMNPQRTUVWXYZ2346789]{4}$`).test(value);
}
function createToken() {
	return randomUUID();
}
var PINNED_SKIN = isSkin(process.env.HA_SKIN) ? process.env.HA_SKIN : null;
function createRoomStore({ now = () => Date.now(), rng = Math.random, skin = null } = {}) {
	const rooms = /* @__PURE__ */ new Map();
	function get(code) {
		return rooms.get(code) || null;
	}
	function create({ name = null, isPrivate = false } = {}) {
		if (rooms.size >= 200) return null;
		const code = createCode((candidate) => rooms.has(candidate));
		const room = {
			code,
			name: isRoomNameShaped(name) ? normaliseRoomName(name) : pickRoomName(rng),
			private: Boolean(isPrivate),
			phase: PHASES.START,
			state: createInitialState(),
			seats: [],
			version: 0,
			hostSeatId: null,
			skin: skin || PINNED_SKIN || pickSkin(rng),
			createdAt: now(),
			updatedAt: now()
		};
		rooms.set(code, room);
		return room;
	}
	function addSeat(room, name) {
		if (room.phase !== PHASES.START) return { error: "room_already_started" };
		if (room.seats.length >= 6) return { error: "room_full" };
		if (room.seats.some((seat) => seat.name === name)) return { error: "name_taken" };
		const seat = {
			id: createToken(),
			name,
			token: createToken(),
			ready: false,
			connected: true,
			lastSeenAt: now(),
			ackSeq: 0
		};
		room.seats.push(seat);
		room.hostSeatId = room.hostSeatId || seat.id;
		room.updatedAt = now();
		return { seat };
	}
	function seatByToken(room, token) {
		return room.seats.find((seat) => seat.token === token) || null;
	}
	function seatById(room, id) {
		return room.seats.find((seat) => seat.id === id) || null;
	}
	function start(room) {
		if (room.phase !== PHASES.START) return { error: "room_already_started" };
		if (room.seats.length < 2) return { error: "not_enough_players" };
		const names = room.seats.map((seat) => seat.name);
		let state = gameReducer(room.state, startGame(names));
		for (const { name, friend, foe } of dealAlignments(names, rng)) state = gameReducer(state, setAlignment({
			name,
			friend,
			foe
		}));
		room.state = state;
		room.phase = PHASES.ALIGNMENT;
		room.seats.forEach((seat) => {
			seat.ready = false;
		});
		room.version += 1;
		room.updatedAt = now();
		return { room };
	}
	const SKIN_CHANGEABLE_IN = [PHASES.START, PHASES.ALIGNMENT];
	function setSkin(room, seat, skin) {
		if (room.hostSeatId !== seat.id) return { error: "not_host" };
		if (!SKIN_CHANGEABLE_IN.includes(room.phase)) return { error: "skin_locked" };
		if (!isSkin(skin)) return { error: "bad_skin" };
		room.skin = skin;
		room.updatedAt = now();
		return { room };
	}
	function advanceIfEveryoneIsReady(room) {
		if (room.phase !== PHASES.ALIGNMENT || !room.seats.length || !room.seats.every((seat) => seat.ready)) return;
		room.phase = PHASES.PLAY;
		room.version += 1;
	}
	function markReady(room, seat) {
		if (room.phase !== PHASES.ALIGNMENT) return { error: "not_in_alignment" };
		seat.ready = true;
		room.updatedAt = now();
		advanceIfEveryoneIsReady(room);
		return { room };
	}
	const PLAYABLE = [PHASES.ALIGNMENT, PHASES.PLAY];
	/**
	* Takes a seat out of a room, and out of the game if one is running.
	*
	* Returns every seat that ended up leaving — the one that asked, plus anybody stranded by it — and
	* whether the room has nobody left in it at all.
	*/
	function leave(room, seat) {
		const others = room.seats.filter((other) => other.id !== seat.id);
		const stranded = PLAYABLE.includes(room.phase) && others.length === 1 ? others : [];
		const gone = [seat, ...stranded];
		room.seats = others.filter((other) => !stranded.includes(other));
		if (room.phase !== PHASES.START) {
			room.state = gone.reduce((state, departing) => {
				return gameReducer(state.players.some((player) => player.turn && player.name === departing.name) ? gameReducer(state, nextTurn()) : state, removePlayer(departing.name));
			}, room.state);
			room.version += 1;
		}
		if (!room.seats.some((other) => other.id === room.hostSeatId)) room.hostSeatId = room.seats.length ? room.seats[0].id : null;
		advanceIfEveryoneIsReady(room);
		room.updatedAt = now();
		return {
			gone,
			dissolved: room.seats.length === 0
		};
	}
	function setConnected(room, seat, connected) {
		seat.connected = connected;
		seat.lastSeenAt = now();
		room.updatedAt = now();
	}
	function remove(code) {
		rooms.delete(code);
	}
	function all() {
		return [...rooms.values()];
	}
	function hostName(room) {
		const host = room.seats.find((seat) => seat.id === room.hostSeatId) || room.seats[0];
		return host ? host.name : null;
	}
	function listingFor(room) {
		return {
			code: room.code,
			name: room.name || room.code,
			host: hostName(room),
			players: room.seats.length,
			state: roomStateFor(room.phase)
		};
	}
	const STATE_ORDER = {
		[ROOM_STATES.LOBBY]: 0,
		[ROOM_STATES.STARTED]: 1
	};
	/**
	* The public list. Private rooms are absent from it entirely — not dimmed, not marked — which is
	* the whole of what private means here.
	*
	* Returns the total as well as the page, because a cap that is not reported reads as "that is
	* every room" when it is not.
	*/
	function list({ query = "", limit = 60 } = {}) {
		const ordered = all().filter((room) => !room.private && matchesRoomQuery(room.name || room.code, query)).sort((a, b) => {
			return STATE_ORDER[roomStateFor(a.phase)] - STATE_ORDER[roomStateFor(b.phase)] || b.createdAt - a.createdAt;
		});
		return {
			rooms: ordered.slice(0, limit).map(listingFor),
			total: ordered.length
		};
	}
	function load(room) {
		rooms.set(room.code, {
			name: room.code,
			private: false,
			...room
		});
	}
	return {
		get,
		create,
		addSeat,
		seatByToken,
		seatById,
		start,
		setSkin,
		markReady,
		leave,
		setConnected,
		remove,
		all,
		list,
		load,
		get size() {
			return rooms.size;
		}
	};
}
function isNameShaped(value) {
	return typeof value === "string" && value.trim().length > 0 && value.trim().length <= 16;
}
//#endregion
//#region server/validate.js
var ALIGNMENTS = ["friend", "foe"];
var TEAMS = [
	"0",
	"1",
	"2",
	"3"
];
var PLAY_ACTIONS = /* @__PURE__ */ new Set([
	TOGGLE_PIECE,
	MOVE_PIECE,
	DIRECT_PIECE,
	SNIPE,
	CLAIM_CONTROL,
	CANCEL_CONTROL,
	REVEAL_FRIEND,
	REVEAL_FOE,
	ACCUSE,
	NEXT_TURN
]);
function reject(reason) {
	return {
		ok: false,
		reason
	};
}
var ok = { ok: true };
function isCoords(value) {
	return Array.isArray(value) && value.length === 2 && value.every((n) => Number.isInteger(n));
}
function isDirection(value) {
	return Array.isArray(value) && value.length === 2 && value.every((n) => Number.isInteger(n));
}
function isPieceId(value, state) {
	return typeof value === "string" && state.pieces.some((piece) => piece.id === value);
}
function validateShape(action, state) {
	switch (action.type) {
		case TOGGLE_PIECE: return isPieceId(action.payload?.pieceId, state) ? ok : reject("bad_piece_id");
		case MOVE_PIECE:
			if (!isPieceId(action.payload?.pieceId, state)) return reject("bad_piece_id");
			return isCoords(action.payload?.coords) ? ok : reject("bad_coords");
		case DIRECT_PIECE: return isDirection(action.payload) ? ok : reject("bad_direction");
		case CLAIM_CONTROL:
		case CANCEL_CONTROL: return TEAMS.includes(String(action.payload?.team)) ? ok : reject("bad_team");
		case ACCUSE: {
			const { accuser, accusee, alignment, team } = action.payload || {};
			if (!ALIGNMENTS.includes(alignment)) return reject("bad_alignment");
			if (!TEAMS.includes(String(team))) return reject("bad_team");
			if (!state.players.some((player) => player.name === accusee)) return reject("unknown_accusee");
			return typeof accuser === "string" ? ok : reject("bad_accuser");
		}
		default: return ok;
	}
}
function isSnipeAction(action, state) {
	if (action.type === "SNIPE") return true;
	if (action.type !== "TOGGLE_PIECE") return false;
	const piece = pz.getPieceById(action.payload?.pieceId, state.pieces);
	return !!state.snipe && !!piece && !!piece.highlight && pz.isSniper(piece.id);
}
function validateLegality(action, state) {
	switch (action.type) {
		case MOVE_PIECE: {
			const highlighted = pz.getHighlightedPositions(state.pieces, state.pieceState);
			return areCoordsInList(action.payload.coords, highlighted) ? ok : reject("illegal_move");
		}
		case DIRECT_PIECE: {
			const selected = pz.getSelectedPiece(state.pieces);
			if (!selected) return reject("no_selected_piece");
			const possible = pz.getPossibleDirections(selected, state.pieces, state.pieceState);
			return areCoordsInList(action.payload, possible) ? ok : reject("illegal_direction");
		}
		default: return ok;
	}
}
function validateAction({ action, room, seat, turnGraceExpired = false }) {
	if (!action || typeof action.type !== "string") return reject("malformed_action");
	if (room.phase !== PHASES.PLAY) return reject("wrong_phase");
	if (!PLAY_ACTIONS.has(action.type)) return reject("action_not_allowed");
	const turnHolder = py_default.getTurn(room.state.players);
	const isSnipe = isSnipeAction(action, room.state);
	if (seat.name === turnHolder) {
		if (isSnipe) return reject("not_your_snipe");
	} else if (!isSnipe) {
		if (!(action.type === "NEXT_TURN" && turnGraceExpired)) return reject("not_your_turn");
	}
	if (action.type === "ACCUSE" && action.payload?.accuser !== seat.name) return reject("accuser_mismatch");
	const shape = validateShape(action, room.state);
	if (!shape.ok) return shape;
	return validateLegality(action, room.state);
}
function createRateLimiter({ perSecond = 30, burst = 60, now = () => Date.now() } = {}) {
	const buckets = /* @__PURE__ */ new Map();
	return function allow(seatId, action) {
		if (action?.type === "DIRECT_PIECE") return true;
		const at = now();
		const bucket = buckets.get(seatId) || {
			tokens: burst,
			at
		};
		const refilled = Math.min(burst, bucket.tokens + (at - bucket.at) / 1e3 * perSecond);
		if (refilled < 1) {
			buckets.set(seatId, {
				tokens: refilled,
				at
			});
			return false;
		}
		buckets.set(seatId, {
			tokens: refilled - 1,
			at
		});
		return true;
	};
}
//#endregion
//#region server/apply.js
var TURN_GRACE_MS = 6e4;
function isTurnGraceExpired(room, { now = () => Date.now() } = {}) {
	const turnHolderName = room.state.players.find((player) => player.turn)?.name;
	const turnHolder = room.seats.find((seat) => seat.name === turnHolderName);
	if (!turnHolder || turnHolder.connected) return false;
	return now() - turnHolder.lastSeenAt >= TURN_GRACE_MS;
}
function applyAction(room, seat, action, { now = () => Date.now() } = {}) {
	const verdict = validateAction({
		action,
		room,
		seat,
		turnGraceExpired: isTurnGraceExpired(room, { now })
	});
	if (!verdict.ok) return {
		ok: false,
		reason: verdict.reason,
		version: room.version
	};
	room.state = gameReducer(room.state, action);
	room.version += 1;
	room.updatedAt = now();
	if (pz.hasGameFinished(room.state.pieces)) room.phase = PHASES.END;
	return {
		ok: true,
		version: room.version
	};
}
function createRoomPersistence({ dir = process.env.HA_STATE_DIR || "/var/lib/hidden-agenda/rooms", log = () => {} } = {}) {
	let enabled = true;
	try {
		mkdirSync(dir, { recursive: true });
	} catch (error) {
		enabled = false;
		log(`room persistence disabled (${dir}: ${error.code || error.message})`);
	}
	function fileFor(code) {
		return join(dir, `${code}.json`);
	}
	return {
		get enabled() {
			return enabled;
		},
		save(room) {
			if (!enabled) return;
			const target = fileFor(room.code);
			const tmp = `${target}.tmp`;
			try {
				writeFileSync(tmp, JSON.stringify(room), "utf8");
				renameSync(tmp, target);
			} catch (error) {
				log(`could not save room ${room.code}: ${error.message}`);
			}
		},
		remove(code) {
			if (!enabled) return;
			try {
				unlinkSync(fileFor(code));
			} catch (error) {
				if (error.code !== "ENOENT") log(`could not remove room ${code}: ${error.message}`);
			}
		},
		loadAll() {
			if (!enabled) return [];
			try {
				return readdirSync(dir).filter((name) => name.endsWith(".json")).map((name) => {
					try {
						return JSON.parse(readFileSync(join(dir, name), "utf8"));
					} catch (error) {
						log(`skipping unreadable room file ${name}: ${error.message}`);
						return null;
					}
				}).filter(Boolean).map((room) => ({
					...room,
					seats: room.seats.map((seat) => ({
						...seat,
						connected: false
					}))
				}));
			} catch (error) {
				log(`could not read room directory: ${error.message}`);
				return [];
			}
		}
	};
}
//#endregion
//#region server/redact.js
function redactAlignment(player, isOwn) {
	const { friend, foe } = player.alignment;
	const { friend: friendRevealed, foe: foeRevealed } = player.revealed;
	return {
		friend: isOwn || friendRevealed ? friend : null,
		foe: isOwn || foeRevealed ? foe : null
	};
}
function redactFor(seatName, state, phase) {
	if (phase === PHASES.END) return state;
	const { test: _test, ...visible } = state;
	return {
		...visible,
		players: state.players.map((player) => ({
			...player,
			alignment: redactAlignment(player, player.name === seatName)
		}))
	};
}
//#endregion
//#region server/protocol.js
var MAX_MESSAGE_BYTES = 8192;
var CLIENT = {
	CREATE: "create",
	JOIN: "join",
	REJOIN: "rejoin",
	LEAVE: "leave",
	LIST: "list",
	START: "start",
	READY: "ready",
	SKIN: "skin",
	ACTION: "action",
	PING: "ping"
};
var SERVER = {
	SEAT: "seat",
	ROOM: "room",
	ROOMS: "rooms",
	SNAPSHOT: "snapshot",
	LEFT: "left",
	REJECTED: "rejected",
	ERROR: "error",
	PONG: "pong"
};
var LEFT = {
	ASKED: "you_left",
	ALONE: "left_alone"
};
function parseMessage(raw) {
	if (typeof raw !== "string" || raw.length > 8192) return { error: "message_too_large" };
	try {
		const message = JSON.parse(raw);
		if (!message || typeof message.type !== "string") return { error: "malformed_message" };
		return { message };
	} catch {
		return { error: "malformed_message" };
	}
}
function seatMessage(room, seat) {
	return {
		type: SERVER.SEAT,
		code: room.code,
		seatId: seat.id,
		token: seat.token,
		name: seat.name
	};
}
function roomsMessage({ rooms, total }) {
	return {
		type: SERVER.ROOMS,
		rooms,
		total
	};
}
function roomMessage(room) {
	return {
		type: SERVER.ROOM,
		code: room.code,
		name: room.name || room.code,
		private: Boolean(room.private),
		phase: room.phase,
		hostSeatId: room.hostSeatId,
		skin: room.skin || DEFAULT_SKIN,
		seats: room.seats.map(({ id, name, ready, connected }) => ({
			id,
			name,
			ready,
			connected
		}))
	};
}
function snapshotMessage(room, seat) {
	return {
		type: SERVER.SNAPSHOT,
		v: room.version,
		phase: room.phase,
		ack: seat.ackSeq || 0,
		state: redactFor(seat.name, room.state, room.phase)
	};
}
function leftMessage(reason) {
	return {
		type: SERVER.LEFT,
		reason
	};
}
function rejectedMessage({ seq, reason, version }) {
	return {
		type: SERVER.REJECTED,
		seq,
		reason,
		v: version
	};
}
function errorMessage(reason) {
	return {
		type: SERVER.ERROR,
		reason
	};
}
//#endregion
//#region server/index.js
var DEFAULT_PORT = 3007;
var SEAT_RECLAIMED = 4e3;
var PING_INTERVAL_MS = 25e3;
var SNAPSHOT_COALESCE_MS = 40;
var SWEEP_INTERVAL_MS = 6e4;
var LIST_INTERVAL_MS = 3e3;
var LIST_MIN_INTERVAL_MS = 250;
var EVICT_AFTER_ALL_GONE_MS = 18e5;
var EVICT_HARD_CAP_MS = 108e5;
var JOINS_PER_IP_PER_MINUTE = Number(process.env.HA_JOINS_PER_MINUTE) || 10;
function createGameServer({ log = console.log, now = () => Date.now(), rng = Math.random, stateDir } = {}) {
	const rooms = createRoomStore({
		now,
		rng
	});
	const persistence = createRoomPersistence({
		log,
		...stateDir ? { dir: stateDir } : {}
	});
	const allowAction = createRateLimiter({ now });
	const sockets = /* @__PURE__ */ new Map();
	const pendingSnapshots = /* @__PURE__ */ new Map();
	const joinsByIp = /* @__PURE__ */ new Map();
	const watchers = /* @__PURE__ */ new Map();
	for (const room of persistence.loadAll()) rooms.load(room);
	if (rooms.size) log(`reloaded ${rooms.size} room(s) from disk`);
	function send(seatId, message) {
		const socket = sockets.get(seatId);
		if (socket && socket.readyState === socket.OPEN) socket.send(JSON.stringify(message));
	}
	function broadcastRoom(room) {
		const message = roomMessage(room);
		room.seats.forEach((seat) => send(seat.id, message));
	}
	function sendSnapshots(room) {
		if (room.phase === PHASES.START) return;
		room.seats.forEach((seat) => send(seat.id, snapshotMessage(room, seat)));
	}
	function scheduleSnapshots(room) {
		if (pendingSnapshots.has(room.code)) return;
		pendingSnapshots.set(room.code, setTimeout(() => {
			pendingSnapshots.delete(room.code);
			sendSnapshots(room);
			persistence.save(room);
		}, SNAPSHOT_COALESCE_MS));
	}
	function bind(socket, room, seat) {
		const previous = sockets.get(seat.id);
		if (previous && previous !== socket) previous.close(SEAT_RECLAIMED, "seat reclaimed");
		watchers.delete(socket);
		sockets.set(seat.id, socket);
		socket.seatId = seat.id;
		socket.roomCode = room.code;
		rooms.setConnected(room, seat, true);
	}
	function allowJoinFrom(ip) {
		const at = now();
		const recent = (joinsByIp.get(ip) || []).filter((time) => at - time < 6e4);
		if (recent.length >= JOINS_PER_IP_PER_MINUTE) {
			joinsByIp.set(ip, recent);
			return false;
		}
		joinsByIp.set(ip, [...recent, at]);
		return true;
	}
	function handleList(socket, message) {
		const query = typeof message.query === "string" ? message.query.slice(0, 24) : "";
		const at = now();
		const watcher = watchers.get(socket);
		if (watcher && at - watcher.at < LIST_MIN_INTERVAL_MS) {
			watchers.set(socket, {
				query,
				at: watcher.at,
				sent: null
			});
			return;
		}
		const encoded = JSON.stringify(roomsMessage(rooms.list({ query })));
		watchers.set(socket, {
			query,
			at,
			sent: encoded
		});
		socket.send(encoded);
	}
	function refreshLists() {
		for (const [socket, watcher] of watchers) {
			if (socket.readyState !== socket.OPEN) {
				watchers.delete(socket);
				continue;
			}
			const encoded = JSON.stringify(roomsMessage(rooms.list({ query: watcher.query })));
			if (encoded === watcher.sent) continue;
			watcher.sent = encoded;
			socket.send(encoded);
		}
	}
	function handleCreate(socket, message, ip) {
		if (!isNameShaped(message.name)) return socket.send(JSON.stringify(errorMessage("bad_name")));
		if (message.room !== void 0 && !isRoomNameShaped(message.room)) return socket.send(JSON.stringify(errorMessage("bad_room_name")));
		if (!allowJoinFrom(ip)) return socket.send(JSON.stringify(errorMessage("slow_down")));
		const room = rooms.create({
			name: message.room,
			isPrivate: message.private
		});
		if (!room) return socket.send(JSON.stringify(errorMessage("server_full")));
		const { seat, error } = rooms.addSeat(room, message.name.trim());
		if (error) return socket.send(JSON.stringify(errorMessage(error)));
		bind(socket, room, seat);
		send(seat.id, seatMessage(room, seat));
		broadcastRoom(room);
		persistence.save(room);
	}
	function handleJoin(socket, message, ip) {
		if (!isCodeShaped(message.code) || !isNameShaped(message.name)) return socket.send(JSON.stringify(errorMessage("bad_join")));
		if (!allowJoinFrom(ip)) return socket.send(JSON.stringify(errorMessage("slow_down")));
		const room = rooms.get(message.code.toUpperCase());
		if (!room) return socket.send(JSON.stringify(errorMessage("no_such_room")));
		const { seat, error } = rooms.addSeat(room, message.name.trim());
		if (error) return socket.send(JSON.stringify(errorMessage(error)));
		bind(socket, room, seat);
		send(seat.id, seatMessage(room, seat));
		broadcastRoom(room);
		persistence.save(room);
	}
	function handleRejoin(socket, message) {
		if (!isCodeShaped(message.code || "")) return socket.send(JSON.stringify(errorMessage("bad_join")));
		const room = rooms.get(message.code.toUpperCase());
		const seat = room && typeof message.token === "string" ? rooms.seatByToken(room, message.token) : null;
		if (!seat) return socket.send(JSON.stringify(errorMessage("seat_lost")));
		seat.ackSeq = 0;
		bind(socket, room, seat);
		send(seat.id, seatMessage(room, seat));
		broadcastRoom(room);
		sendSnapshots(room);
	}
	function withSeat(socket, handler) {
		const room = rooms.get(socket.roomCode);
		const seat = room ? rooms.seatById(room, socket.seatId) : null;
		if (!room || !seat) return socket.send(JSON.stringify(errorMessage("not_seated")));
		return handler(room, seat);
	}
	function handleStart(socket) {
		return withSeat(socket, (room, seat) => {
			if (room.hostSeatId !== seat.id) return send(seat.id, errorMessage("not_host"));
			const { error } = rooms.start(room);
			if (error) return send(seat.id, errorMessage(error));
			broadcastRoom(room);
			sendSnapshots(room);
			persistence.save(room);
		});
	}
	function handleSkin(socket, message) {
		return withSeat(socket, (room, seat) => {
			const { error } = rooms.setSkin(room, seat, message.skin);
			if (error) return send(seat.id, errorMessage(error));
			broadcastRoom(room);
			persistence.save(room);
		});
	}
	function forget(room) {
		clearTimeout(pendingSnapshots.get(room.code));
		pendingSnapshots.delete(room.code);
		rooms.remove(room.code);
		persistence.remove(room.code);
	}
	function unseat(seatId) {
		const socket = sockets.get(seatId);
		sockets.delete(seatId);
		if (socket) {
			socket.seatId = void 0;
			socket.roomCode = void 0;
		}
	}
	function handleLeave(socket) {
		return withSeat(socket, (room, seat) => {
			const { gone, dissolved } = rooms.leave(room, seat);
			gone.forEach((departed) => {
				send(departed.id, leftMessage(departed.id === seat.id ? LEFT.ASKED : LEFT.ALONE));
				unseat(departed.id);
			});
			if (dissolved) {
				forget(room);
				log(`room ${room.code} dissolved: nobody left in it`);
				return;
			}
			broadcastRoom(room);
			sendSnapshots(room);
			persistence.save(room);
		});
	}
	function handleReady(socket) {
		return withSeat(socket, (room, seat) => {
			const { error } = rooms.markReady(room, seat);
			if (error) return send(seat.id, errorMessage(error));
			broadcastRoom(room);
			sendSnapshots(room);
			persistence.save(room);
		});
	}
	function handleAction(socket, message) {
		return withSeat(socket, (room, seat) => {
			if (!allowAction(seat.id, message.action)) return send(seat.id, rejectedMessage({
				seq: message.seq,
				reason: "rate_limited",
				version: room.version
			}));
			const result = applyAction(room, seat, message.action, { now });
			if (!result.ok) return send(seat.id, rejectedMessage({
				seq: message.seq,
				reason: result.reason,
				version: result.version
			}));
			if (Number.isInteger(message.seq)) seat.ackSeq = message.seq;
			if (room.phase === PHASES.END) broadcastRoom(room);
			scheduleSnapshots(room);
		});
	}
	function handleMessage(socket, raw, ip) {
		const { message, error } = parseMessage(typeof raw === "string" ? raw : raw.toString());
		if (error) return socket.send(JSON.stringify(errorMessage(error)));
		switch (message.type) {
			case CLIENT.CREATE: return handleCreate(socket, message, ip);
			case CLIENT.JOIN: return handleJoin(socket, message, ip);
			case CLIENT.REJOIN: return handleRejoin(socket, message);
			case CLIENT.LEAVE: return handleLeave(socket);
			case CLIENT.LIST: return handleList(socket, message);
			case CLIENT.START: return handleStart(socket);
			case CLIENT.READY: return handleReady(socket);
			case CLIENT.SKIN: return handleSkin(socket, message);
			case CLIENT.ACTION: return handleAction(socket, message);
			case CLIENT.PING: return socket.send(JSON.stringify({ type: SERVER.PONG }));
			default: return socket.send(JSON.stringify(errorMessage("unknown_message")));
		}
	}
	function handleClose(socket) {
		const room = rooms.get(socket.roomCode);
		const seat = room ? rooms.seatById(room, socket.seatId) : null;
		watchers.delete(socket);
		const wasCurrent = sockets.get(socket.seatId) === socket;
		if (wasCurrent) sockets.delete(socket.seatId);
		if (room && seat && wasCurrent) {
			rooms.setConnected(room, seat, false);
			broadcastRoom(room);
			persistence.save(room);
		}
	}
	function sweep() {
		const at = now();
		for (const room of rooms.all()) {
			const anyoneConnected = room.seats.some((seat) => seat.connected);
			const idleFor = at - room.updatedAt;
			const ageFor = at - room.createdAt;
			if (!anyoneConnected && idleFor > EVICT_AFTER_ALL_GONE_MS || ageFor > EVICT_HARD_CAP_MS) {
				room.seats.forEach((seat) => sockets.delete(seat.id));
				forget(room);
				log(`evicted room ${room.code}`);
			}
		}
	}
	const httpServer = createServer((request, response) => {
		if (request.method === "GET" && request.url === "/healthz") {
			response.writeHead(200, {
				"content-type": "application/json",
				"cache-control": "no-store"
			});
			return response.end(JSON.stringify({
				ok: true,
				rooms: rooms.size,
				maxRooms: 200,
				connections: sockets.size,
				persistence: persistence.enabled,
				uptime: Math.round(process.uptime())
			}));
		}
		response.writeHead(404, { "content-type": "text/plain" });
		response.end("not found\n");
	});
	const wss = new WebSocketServer({
		noServer: true,
		maxPayload: MAX_MESSAGE_BYTES
	});
	httpServer.on("upgrade", (request, socket, head) => {
		const { pathname } = new URL(request.url, "http://localhost");
		if (pathname !== "/ws") {
			socket.destroy();
			return;
		}
		wss.handleUpgrade(request, socket, head, (ws) => wss.emit("connection", ws, request));
	});
	wss.on("connection", (socket, request) => {
		const forwarded = request.headers["x-forwarded-for"];
		const ip = (forwarded ? String(forwarded).split(",")[0].trim() : request.socket.remoteAddress) || "unknown";
		socket.isAlive = true;
		socket.on("pong", () => {
			socket.isAlive = true;
		});
		socket.on("message", (raw) => {
			try {
				handleMessage(socket, raw, ip);
			} catch (error) {
				log(`error handling message: ${error.stack || error.message}`);
				socket.send(JSON.stringify(errorMessage("internal_error")));
			}
		});
		socket.on("close", () => handleClose(socket));
		socket.on("error", () => handleClose(socket));
	});
	const heartbeat = setInterval(() => {
		wss.clients.forEach((socket) => {
			if (!socket.isAlive) return socket.terminate();
			socket.isAlive = false;
			socket.ping();
		});
	}, PING_INTERVAL_MS);
	const sweeper = setInterval(sweep, SWEEP_INTERVAL_MS);
	const lister = setInterval(refreshLists, LIST_INTERVAL_MS);
	heartbeat.unref?.();
	sweeper.unref?.();
	lister.unref?.();
	return {
		httpServer,
		rooms,
		sweep,
		refreshLists,
		listen(port = DEFAULT_PORT, host = "127.0.0.1") {
			return new Promise((resolve) => httpServer.listen(port, host, () => resolve(httpServer.address())));
		},
		close() {
			clearInterval(heartbeat);
			clearInterval(sweeper);
			clearInterval(lister);
			watchers.clear();
			pendingSnapshots.forEach((timer) => clearTimeout(timer));
			pendingSnapshots.clear();
			wss.clients.forEach((socket) => socket.terminate());
			return new Promise((resolve) => {
				wss.close(() => httpServer.close(resolve));
			});
		}
	};
}
//#endregion
//#region server/main.js
var port = Number(process.env.PORT) || 3007;
var host = process.env.HOST || "127.0.0.1";
var server = createGameServer();
server.listen(port, host).then((address) => {
	console.log(`hidden-agenda server listening on ${address.address}:${address.port}`);
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => {
	console.log(`${signal} received, shutting down`);
	server.close().then(() => process.exit(0));
});
//#endregion
export {};

//# sourceMappingURL=main.mjs.map