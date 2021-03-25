import React, { useContext, useCallback, forwardRef } from 'react';
import { DragPreviewImage, useDrag } from 'react-dnd';
import { pz } from 'Domain/pieces';
import { StateContext } from 'State';
import { togglePiece } from 'Client/actions';
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

	const onClick = useCallback(() => dispatch(togglePiece(id)), [dispatch, id]);

	const [{}, drag, preview] = useDrag(
		() => ({
			type: 'PIECE',
			item: function onDrag() {
				onClick();
				return {};
			},
		}),
		[],
	);

	return (
		<>
			<DragPreviewImage connect={preview} width="92%" src={previewSrc(team, type, selectedDirection)} />
			<PieceStyled
				ref={drag}
				id={`pz-${id}`}
				className="piece-styled"
				src={image}
				pieceId={id}
				selected={selected}
				highlight={highlight}
				selectedDirection={selectedDirection}
				onClick={onClick}
			/>
		</>
	);
}

export default Piece;
