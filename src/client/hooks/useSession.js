import { useContext } from 'react';
import py from 'Domain/py';
import { SessionContext, StateContext } from 'State';

export default function useSession() {
	return useContext(SessionContext);
}

// Online, a seat may only act on its own turn. The server enforces that regardless; this exists
// so the UI stops inviting a player to do something that will be rejected. Locally everyone
// shares one screen, so whoever is on turn is whoever is holding the mouse.
export function useCanAct() {
	const session = useContext(SessionContext);
	const [{ players }] = useContext(StateContext);

	if (session.mode === 'local') {
		return true;
	}

	if (session.status !== 'ready' || !players.length) {
		return false;
	}

	return py.getTurn(players) === session.name;
}
