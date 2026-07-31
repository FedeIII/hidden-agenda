import { createContext, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import createTransport, { readRoomCode } from 'Client/net/transport';
import getWrapperName from './getWrapperName';

// React glue only. The reducer, the initial state and the store all live in src/game, which the
// multiplayer server imports too — so nothing game-related belongs in this file.

export const StateContext = createContext(null);
export const TestContext = createContext(null);
export const SessionContext = createContext(null);

// A room code in the URL means somebody followed a shared link, so start online.
function detectMode() {
	return readRoomCode() ? 'online' : 'local';
}

export function withState(WrappedComponent) {
	function WithState(props) {
		// Switching mode rebuilds the transport, which is how the start screen turns a local game
		// into an online one without the rest of the tree knowing anything changed.
		const [mode, setMode] = useState(detectMode);
		const transport = useMemo(() => createTransport({ mode }), [mode]);

		useEffect(() => transport.close, [transport]);

		const state = useSyncExternalStore(transport.store.subscribe, transport.store.getState);
		const session = useSyncExternalStore(transport.session.subscribe, transport.session.get);

		const goOnline = useCallback(() => setMode('online'), []);

		const stateValue = useMemo(() => [state, transport.store.dispatch], [state, transport.store.dispatch]);
		const sessionValue = useMemo(
			() => ({ ...session, actions: { ...transport.actions, goOnline } }),
			[session, transport.actions, goOnline],
		);

		return (
			<TestContext.Provider value={transport.test}>
				<SessionContext.Provider value={sessionValue}>
					<StateContext.Provider value={stateValue}>
						<WrappedComponent {...props} />
					</StateContext.Provider>
				</SessionContext.Provider>
			</TestContext.Provider>
		);
	}

	WithState.displayName = getWrapperName('WithState', WrappedComponent);

	return WithState;
}
