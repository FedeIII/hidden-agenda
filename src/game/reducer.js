import { pz } from 'Domain/pieces';
import teams from 'Domain/teams';
import { SYNC_STATE } from './actions';

import players from './reducers/playersReducer';
import hasTurnEnded from './reducers/hasTurnEndedReducer';
import pieces from './reducers/piecesReducer';
import pieceState from './reducers/pieceStateReducer';
import followMouse from './reducers/followMouseReducer';
import snipe from './reducers/snipeReducer';
import snipeWindow from './reducers/snipeWindowReducer';
import piecesPrevState from './reducers/piecesPrevStateReducer';
import lastMove from './reducers/lastMoveReducer';
import teamControl from './reducers/teamControlReducer';

// This module is the game core: no React, no browser globals, no side effects at import time.
// The multiplayer server runs this exact reducer over the same actions, so anything added here
// has to work in node as well as in a browser.

const reducers = {
	players,
	hasTurnEnded,
	pieces,
	pieceState,
	followMouse,
	snipe,
	snipeWindow,
	piecesPrevState,
	lastMove,
	teamControl,
};

// NOT combineReducers. Every slice reducer receives the WHOLE previous state plus the action and
// returns only its own slice, which is why a slice can read another's pre-action value. What it
// can never do is see another slice's new value — see togglePieceState for the trap that caused.
function reduceSlices(state, action) {
	return Object.entries(reducers).reduce(
		(newState, [slice, reducer]) => ({
			...newState,
			[slice]: reducer(state, action),
		}),
		{},
	);
}

export function createInitialState() {
	return {
		players: [],
		hasTurnEnded: false,
		pieces: pz.init(),
		pieceState: undefined,
		followMouse: false,
		snipe: false,
		// No shot on the table. See Domain/snipeWindow for what it holds when there is one.
		snipeWindow: null,
		piecesPrevState: pz.init(),
		// Nobody has moved yet. See reducers/lastMoveReducer for what it holds once somebody has.
		lastMove: null,
		teamControl: teams.initControl(),
	};
}

export function createGameReducer({ debug = false } = {}) {
	return function gameReducer(state, action) {
		// Handled above the slices on purpose: a snapshot from the server replaces the state
		// wholesale rather than being interpreted by each slice.
		const newState = action.type === SYNC_STATE ? action.payload : reduceSlices(state, action);

		if (debug) {
			console.log(action, '=>', newState);
		}

		return newState;
	};
}

export const gameReducer = createGameReducer();

export default gameReducer;
