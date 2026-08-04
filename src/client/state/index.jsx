import { createContext, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import createTransport, { readRoomCode, readHotSeat, readTestParam } from 'Client/net/transport';
import getWrapperName from './getWrapperName';

// React glue only. The reducer, the initial state and the store all live in src/game, which the
// multiplayer server imports too — so nothing game-related belongs in this file.

export const StateContext = createContext(null);
export const TestContext = createContext(null);
export const SessionContext = createContext(null);

// Online is what the index offers, because that is what this game is: people in different places
// holding cards nobody else can see. The one-tab table is the option rather than the premise.
//
// Two things ask for local instead. `?hotseat` is a player choosing it — or the browser suite, which
// is nearly all hot-seat. `?test=` loads a mid-game mock, and a mock has no server it could have come
// from, so handing it to the socket store would mean a state the server never sent. A room code in the
// URL is the other direction: somebody followed a shared link, which is online by definition.
function detectMode() {
	if (readRoomCode()) {
		return 'online';
	}

	return readHotSeat() || readTestParam() ? 'local' : 'online';
}

// Which mode you are in belongs in the URL, so a reload keeps you there instead of dropping you back
// on the default. replaceState rather than a navigation: switching mode rebuilds the transport in
// place and there is nothing to fetch.
function rememberMode(mode) {
	if (typeof window === 'undefined' || !window.history) {
		return;
	}

	const url = new URL(window.location.href);

	if (mode === 'local') {
		url.searchParams.set('hotseat', '');
	} else {
		url.searchParams.delete('hotseat');
	}

	// URLSearchParams writes a bare flag as `hotseat=`. Both parse; the shorter one is what the
	// documentation says and what a player would type.
	const search = url.search.replace(/hotseat=(?=&|$)/, 'hotseat');

	window.history.replaceState(null, '', `${url.pathname}${search}${url.hash}`);
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

		const goOnline = useCallback(() => {
			rememberMode('online');
			setMode('online');
		}, []);

		const goHotSeat = useCallback(() => {
			rememberMode('local');
			setMode('local');
		}, []);

		const stateValue = useMemo(() => [state, transport.store.dispatch], [state, transport.store.dispatch]);
		const sessionValue = useMemo(
			() => ({ ...session, actions: { ...transport.actions, goOnline, goHotSeat } }),
			[session, transport.actions, goOnline, goHotSeat],
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
