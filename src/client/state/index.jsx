import React, { createContext, useReducer } from 'react';
import { pz } from 'Domain/pieces';
import teams from 'Domain/teams';
import getWrapperName from './getWrapperName';

import players from './reducers/playersReducer';
import hasTurnEnded from './reducers/hasTurnEndedReducer';
import pieces from './reducers/piecesReducer';
import pieceState from './reducers/pieceStateReducer';
import followMouse from './reducers/followMouseReducer';
import snipe from './reducers/snipeReducer';
import piecesPrevState from './reducers/piecesPrevStateReducer';
import teamControl from './reducers/teamControlReducer';

import playMock from './mocks/play';
import endgameMock from './mocks/endgame';

const reducers = {
	players,
	hasTurnEnded,
	pieces,
	pieceState,
	followMouse,
	snipe,
	piecesPrevState,
	teamControl,
};

function gameReducer(state, action) {
	const newState = Object.entries(reducers).reduce(
		(newState, [stateVar, reducer]) => ({
			...newState,
			[stateVar]: reducer(state, action),
		}),
		{},
	);

	console.log(action, '=>', newState);

	return newState;
}

let initialState = {
	players: [],
	hasTurnEnded: false,
	pieces: pz.init(),
	pieceState: undefined,
	followMouse: false,
	snipe: false,
	piecesPrevState: pz.init(),
	teamControl: teams.initControl(),
};

const urlParams = new URLSearchParams(window.location.search);
const test = urlParams.get('test');

if (test === 'play') {
	initialState = playMock;
	initialState.test = true;
} else if (test === 'endgame') {
	initialState = endgameMock;
	initialState.test = true;
}

export const StateContext = createContext(null);
export const TestContext = createContext(test);

export function withState(WrappedComponent) {
	function WithState(props) {
		const [state, dispatch] = useReducer(gameReducer, initialState);

		return (
			<TestContext.Provider value={test}>
				<StateContext.Provider value={[state, dispatch]}>
					<WrappedComponent {...props} />
				</StateContext.Provider>
			</TestContext.Provider>
		);
	}

	WithState.displayName = getWrapperName('WithState', WrappedComponent);

	return WithState;
}
