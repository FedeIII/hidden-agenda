import { useCallback, useContext } from 'react';
import { StateContext, SessionContext } from 'State';
import { pz } from 'Domain/pieces';
import { getMover } from 'Domain/snipeWindow';
import { snipe } from 'Game/actions';
import { useCanSnipe } from './useSession';

/**
 * The snipe control, wherever it is drawn.
 *
 * Not gated on `useCanAct` like every other action: sniping is the rest of the table's answer to the
 * move that has just been made, so it belongs to everybody except the player who made it.
 *
 * A hook rather than a private function in the action bar because the training board draws the same
 * button, and two readings of "may this be pressed" is two readings that can disagree.
 *
 * @returns {[boolean, () => void, boolean]} whether it may be pressed, what pressing it does, and
 *   whether a shot is already lined up — which is what turns the label into STAND DOWN.
 */
export default function useSnipe() {
	const [state, dispatch] = useContext(StateContext);
	const canSnipe = useCanSnipe();

	// Not "is a sniper standing on the board": one killed by the very move it saw is off the board
	// and still holds its shot. See pz.isSnipeAvailable.
	const isShotThere = pz.isSnipeAvailable(state.pieces);

	const onSnipe = useCallback(() => {
		if (isShotThere && canSnipe) {
			dispatch(snipe());
		}
	}, [isShotThere, canSnipe, dispatch]);

	return [canSnipe, onSnipe, state.snipe];
}

/**
 * Who at the table may reach for that button, in the one mode that cannot enforce it.
 *
 * Online the button is simply dead for the player being answered and live for everyone else, so
 * there is nothing to say. Hot-seat is one screen and one mouse: the app cannot tell who reached for
 * it, so the rule lives between the people in the room — and until now the room was never told what
 * it was. The player on turn pressing it themselves is the confusion this is for.
 *
 * Two shapes, because a list of names is not minimal information:
 *
 * - one other player at the table, so name them: the shot is theirs and nobody else's
 * - more than one, so name the one who may not: everybody else is the answer
 *
 * @returns {null | {kind: 'only' | 'not', name: string}} null when there is nothing to say
 */
export function useSnipeNote() {
	const session = useContext(SessionContext);
	const [state] = useContext(StateContext);

	if (session.mode !== 'local' || state.players.length < 2) {
		return null;
	}

	const mover = getMover(state);
	const others = state.players.filter(player => player.name !== mover);

	if (!others.length) {
		return null;
	}

	return others.length === 1 ? { kind: 'only', name: others[0].name } : { kind: 'not', name: mover };
}
