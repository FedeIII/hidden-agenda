import { createGameReducer, createInitialState } from './reducer';

// A minimal observable store, shaped for useSyncExternalStore. The point of it is the seam: the
// UI only ever knows getState/subscribe/dispatch, so phase 2 can swap this for a store fed by
// server snapshots without touching a component.
export function createLocalStore({ initialState, debug = false } = {}) {
	const reduce = createGameReducer({ debug });

	let state = initialState || createInitialState();
	const listeners = new Set();

	return {
		getState() {
			return state;
		},

		subscribe(listener) {
			listeners.add(listener);

			return () => listeners.delete(listener);
		},

		dispatch(action) {
			const newState = reduce(state, action);

			if (newState === state) {
				return;
			}

			state = newState;
			listeners.forEach(listener => listener());
		},
	};
}

export default createLocalStore;
