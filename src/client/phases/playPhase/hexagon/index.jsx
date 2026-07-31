import React, { useCallback } from 'react';
import useCellAction from 'Hooks/useCellAction';
import { useDragController } from 'Client/drag';
import Piece from '../piece/index';

import HexagonStyled from './styled';

function Hexagon({ row, cell, piece, highlighted, onMouseEnter, edge }) {
	const cellAction = useCellAction();
	const { isClickSuppressed } = useDragController();

	const onClick = useCallback(
		event => {
			event && event.preventDefault && event.preventDefault();
			event && event.stopPropagation && event.stopPropagation();

			// Releasing a drag over the same hexagon still produces a click, which would run
			// the action a second time against already-updated state.
			if (isClickSuppressed()) {
				return;
			}

			cellAction([row, cell]);
		},
		[cellAction, isClickSuppressed, row, cell],
	);

	return (
		<HexagonStyled
			id={`hex-${row}-${cell}`}
			highlighted={highlighted}
			row={row}
			cell={cell}
			edge={edge}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
		>
			{piece && <Piece {...piece} />}
		</HexagonStyled>
	);
}

export default Hexagon;
