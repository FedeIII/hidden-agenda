export const TYPES = {
  AGENT: 'A',
  CEO: 'C',
  SPY: 'S',
  SNIPER: 'N',
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
	[TYPES.AGENT]: 5,
	[TYPES.SPY]: 10,
	[TYPES.SNIPER]: 10,
	[TYPES.CEO]: 20,
};
