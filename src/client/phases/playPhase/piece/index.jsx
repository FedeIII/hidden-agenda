import { useContext, useCallback } from 'react';
import { pz } from 'Domain/pieces';
import { StateContext } from 'State';
import { togglePiece } from 'Game/actions';
import { useDragController } from 'Client/drag';
import { useCanAct, useCanSnipe } from 'Hooks/useSession';
import PieceStyled from 'Client/components/pieceStyled';
import { artSrc } from 'Client/art';

function Piece({ id, selectedDirection, selected, highlight, box }) {
	const team = pz.getTeam(id);
	const type = pz.getType(id);
	const image = artSrc(team, type);

	const [{ snipe }, dispatch] = useContext(StateContext);
	const { startDrag, isClickSuppressed } = useDragController();
	const canAct = useCanAct();
	const canSnipe = useCanSnipe();

	// Clicking a lit sniper is the second half of the snipe, and the snipe belongs to the players
	// who are not on turn. It is the one click on a piece that is theirs rather than the mover's,
	// so it asks a different question of the session than every other click does.
	//
	// And with a shot lined up, a lit sniper is the only thing on the board that answers a click at
	// all. The domain refuses the rest either way; not sending them matters because a piece standing
	// on the cell a fallen sniper is fired from would otherwise put a doomed action on the wire in
	// front of the shot that click is actually taking.
	const isSnipeShot = snipe && highlight && pz.isSniper(id);
	const canToggle = isSnipeShot ? canSnipe : canAct && !snipe;

	const onClick = useCallback(() => {
		if (isClickSuppressed() || !canToggle) {
			return;
		}

		dispatch(togglePiece(id));
	}, [dispatch, id, isClickSuppressed, canToggle]);

	const onPointerDown = useCallback(
		event =>
			startDrag(event, {
				previewSrc: artSrc(team, type, selectedDirection),
				pieceId: id,
				// Beginning a drag selects the piece, so one gesture can pick it up and place
				// it. Unlike the old item() callback this will not deselect an already selected
				// piece, which used to leave the drop with nothing to move.
				onStart: () => {
					if (!selected && canToggle) {
						dispatch(togglePiece(id));
					}
				},
			}),
		[startDrag, team, type, selectedDirection, selected, dispatch, id, canToggle],
	);

	return (
		<PieceStyled
			id={`pz-${id}`}
			className="piece-styled"
			src={image}
			// Images are natively draggable, and that drag would pre-empt our pointer events.
			draggable="false"
			pieceId={id}
			selected={selected}
			highlight={highlight}
			selectedDirection={selectedDirection}
			projected={!!box}
			style={box}
			onClick={onClick}
			onPointerDown={onPointerDown}
		/>
	);
}

export default Piece;
