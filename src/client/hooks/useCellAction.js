import { useCallback, useContext } from 'react';
import { StateContext } from 'State';
import { pz } from 'Domain/pieces';
import { togglePiece, movePiece } from 'Game/actions';
import { useCanAct, useCanSnipe } from 'Hooks/useSession';

// What clicking a cell means. Dropping a piece on a cell means exactly the same thing, which
// is why react-dnd's drop handler used to be this very callback — so it lives on its own now
// and both the hexagon and the drag controller call it.
export default function useCellAction() {
	const [{ followMouse, pieces, pieceState, snipe, snipeWindow }, dispatch] = useContext(StateContext);
	const canAct = useCanAct();
	const canSnipe = useCanSnipe();

	return useCallback(
		coords => {
			// The one click on a cell that is not the turn holder's, and it comes first because the
			// cell is standing in for a piece. A sniper killed by the very move it saw is lit like any
			// other and has no token left to click, so the cell it stood in fires it — and it answers
			// to the players who may take the shot, never to the one who moved.
			const fallen = snipe && snipeWindow ? pz.getFallenSniperAt(coords, pieces, snipeWindow.pieces) : undefined;

			if (fallen) {
				if (canSnipe) {
					dispatch(togglePiece(fallen));
				}

				return;
			}

			// The server refuses out-of-turn actions anyway; this stops the UI inviting one.
			if (!canAct) {
				return;
			}

			const selectedPiece = pz.getSelectedPiece(pieces);

			if (pz.isTogglePieceOnCellClick(followMouse, coords, pieces, pieceState)) {
				dispatch(togglePiece(selectedPiece.id));
			} else if (pz.isMovePieceOnCellClick(followMouse, coords, pieces, pieceState)) {
				dispatch(movePiece(selectedPiece.id, coords));
			}
		},
		[followMouse, pieces, pieceState, snipe, snipeWindow, dispatch, canAct, canSnipe],
	);
}
