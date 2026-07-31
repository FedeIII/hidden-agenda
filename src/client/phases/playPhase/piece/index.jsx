import { useContext, useCallback } from 'react';
import { pz } from 'Domain/pieces';
import { StateContext } from 'State';
import { togglePiece } from 'Game/actions';
import { useDragController } from 'Client/drag';
import PieceStyled from 'Client/components/pieceStyled';

function previewSrc(team, type, [v, h] = []) {
	if (typeof v === 'undefined' || typeof h === 'undefined') {
		return `img/${team}-${type}.png`;
	}

	return `img/${team}-${type}-${v}${h}.png`;
}

function Piece({ id, selectedDirection, selected, highlight }) {
	const team = pz.getTeam(id);
	const type = pz.getType(id);
	const image = `img/${team}-${type}.png`;

	const [_state, dispatch] = useContext(StateContext);
	const { startDrag, isClickSuppressed } = useDragController();

	const onClick = useCallback(() => {
		if (isClickSuppressed()) {
			return;
		}

		dispatch(togglePiece(id));
	}, [dispatch, id, isClickSuppressed]);

	const onPointerDown = useCallback(
		event =>
			startDrag(event, {
				previewSrc: previewSrc(team, type, selectedDirection),
				// Beginning a drag selects the piece, so one gesture can pick it up and place
				// it. Unlike the old item() callback this will not deselect an already selected
				// piece, which used to leave the drop with nothing to move.
				onStart: () => {
					if (!selected) {
						dispatch(togglePiece(id));
					}
				},
			}),
		[startDrag, team, type, selectedDirection, selected, dispatch, id],
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
			onClick={onClick}
			onPointerDown={onPointerDown}
		/>
	);
}

export default Piece;
