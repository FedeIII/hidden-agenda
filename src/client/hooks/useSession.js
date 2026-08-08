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

// The two free moves, and whether there is anything left of either. Both alignments already public
// means there is nothing to reveal, and both accusations spent means there is nothing to accuse — a
// dead button that says why beats one that just sits there.
//
// Here beside useCanAct rather than inside the action bar because the training board draws the same
// two controls, and two readings of "may this be pressed" is two readings that can disagree.
// Both hooks are called before anything is decided, never inside a `&&`: short-circuiting past a
// hook is exactly the thing the rules of hooks forbid.
export function useCanReveal() {
	const canAct = useCanAct();
	const [{ players }] = useContext(StateContext);

	return canAct && py.isRevealActive(players);
}

export function useCanAccuse() {
	const canAct = useCanAct();
	const [{ players }] = useContext(StateContext);
	const player = players.find(entry => entry.turn);

	return canAct && (player.allowedToAccuse.friend || player.allowedToAccuse.foe);
}
