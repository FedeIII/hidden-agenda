// direction:
//  [0] vertical:
//      1: up
//      0: horizontal
//      -1: down
//  [1] horizontal:
//      1: left
//      0: right

const AGENT = 'A';
const CEO = 'C';
const SPY = 'S';
const SNIPER = 'N';

export const TYPES = {
	AGENT,
	CEO,
	SPY,
	SNIPER,
};

export const STATES = {
	SELECTION: 'selection',
	DESELECTION: 'deselection',
	PLACEMENT: 'placement',
	MOVEMENT: 'movement',
	MOVEMENT2: 'movement2',
	MOVEMENT3: 'movement3',
	COLLOCATION: 'collocation',
};

export const POINTS_PER_PIECE_TYPE = {
	[AGENT]: 5,
	[SPY]: 10,
	[SNIPER]: 10,
	[CEO]: 20,
};

export const NUMBER_OF_PLAYERS_KILLED_FOR_GAME_END = 3;

export const IDS = [
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
