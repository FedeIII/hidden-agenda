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

// The snipe is the one thing at this table that belongs to everybody EXCEPT the player on turn:
// it is how the rest of the table answers the move that was just made, so answering your own is
// the one case that makes no sense. Exactly the inverse of useCanAct, and the server agrees.
//
// Hot-seat is deliberately not restricted. There is one screen and one mouse, so the app cannot
// tell which of the people in the room reached for it — who presses it is a rule between them,
// and locking it to the turn holder would only mean nobody could press it at all.
export function useCanSnipe() {
	const session = useContext(SessionContext);
	const [{ players }] = useContext(StateContext);

	if (session.mode === 'local') {
		return true;
	}

	if (session.status !== 'ready' || !players.length) {
		return false;
	}

	return py.getTurn(players) !== session.name;
}
