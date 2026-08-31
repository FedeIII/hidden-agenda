import { useContext } from 'react';
import py from 'Domain/py';
import { getMover } from 'Domain/snipeWindow';
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

// The snipe is the one thing at this table that belongs to everybody EXCEPT the player whose move
// it answers: answering your own is the one case that makes no sense. Nearly the inverse of
// useCanAct, and the server agrees — but read off the shot rather than off the turn, because a shot
// outlives the turn it was provoked in and the two stop being the same player at NEXT TURN.
//
// Hot-seat is deliberately not restricted. There is one screen and one mouse, so the app cannot
// tell which of the people in the room reached for it — who presses it is a rule between them,
// and locking it to the mover would only mean nobody could press it at all. What hot-seat gets
// instead is a note beside the button saying whose shot it is: see useSnipeNote.
export function useCanSnipe() {
	const session = useContext(SessionContext);
	const [state] = useContext(StateContext);

	if (session.mode === 'local') {
		return true;
	}

	if (session.status !== 'ready' || !state.players.length) {
		return false;
	}

	return getMover(state) !== session.name;
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
