import { useCallback, useContext } from 'react';
import { StateContext } from 'State';
import { pz } from 'Domain/pieces';
import { snipe } from 'Game/actions';
import { useCanSnipe } from './useSession';

/**
 * The snipe control, wherever it is drawn.
 *
 * Not gated on `useCanAct` like every other action: sniping is the rest of the table's answer to the
 * move the player on turn has just made, so it belongs to them and not to the mover.
 *
 * A hook rather than a private function in the action bar because the training board draws the same
 * button, and two readings of "may this be pressed" is two readings that can disagree.
 *
 * @returns {[boolean, () => void, boolean]} whether it may be pressed, what pressing it does, and
 *   whether a shot is already lined up — which is what turns the label into STAND DOWN.
 */
export default function useSnipe() {
	const [{ pieces, snipe: armed }, dispatch] = useContext(StateContext);
	const canSnipe = useCanSnipe();

	const isSniperOnBoard = pz.isSniperOnBoard(pieces);

	const onSnipe = useCallback(() => {
		if (isSniperOnBoard && canSnipe) {
			dispatch(snipe());
		}
	}, [isSniperOnBoard, canSnipe, dispatch]);

	return [canSnipe, onSnipe, armed];
}
