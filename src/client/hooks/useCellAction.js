import { useCallback, useContext } from 'react';
import { StateContext } from 'State';
import { pz } from 'Domain/pieces';
import { togglePiece, movePiece } from 'Client/actions';

// What clicking a cell means. Dropping a piece on a cell means exactly the same thing, which
// is why react-dnd's drop handler used to be this very callback — so it lives on its own now
// and both the hexagon and the drag controller call it.
export default function useCellAction() {
	const [{ followMouse, pieces, pieceState }, dispatch] = useContext(StateContext);

	return useCallback(
		coords => {
			const selectedPiece = pz.getSelectedPiece(pieces);

			if (pz.isTogglePieceOnCellClick(followMouse, coords, pieces, pieceState)) {
				dispatch(togglePiece(selectedPiece.id));
			} else if (pz.isMovePieceOnCellClick(followMouse, coords, pieces, pieceState)) {
				dispatch(movePiece(selectedPiece.id, coords));
			}
		},
		[followMouse, pieces, pieceState, dispatch],
	);
}
