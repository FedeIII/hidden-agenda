import { createContext, useMemo, useSyncExternalStore } from 'react';
import createTransport from 'Client/net/transport';
import getWrapperName from './getWrapperName';

// React glue only. The reducer, the initial state and the store all live in src/game, which the
// multiplayer server imports too — so nothing game-related belongs in this file.

export const StateContext = createContext(null);
export const TestContext = createContext(null);

export function withState(WrappedComponent) {
	function WithState(props) {
		// One transport per mount. useSyncExternalStore is React 18's primitive for exactly this,
		// and it is what lets phase 2 feed the same tree from server snapshots.
		const { store, test } = useMemo(() => createTransport(), []);

		const state = useSyncExternalStore(store.subscribe, store.getState);
		const value = useMemo(() => [state, store.dispatch], [state, store.dispatch]);

		return (
			<TestContext.Provider value={test}>
				<StateContext.Provider value={value}>
					<WrappedComponent {...props} />
				</StateContext.Provider>
			</TestContext.Provider>
		);
	}

	WithState.displayName = getWrapperName('WithState', WrappedComponent);

	return WithState;
}
