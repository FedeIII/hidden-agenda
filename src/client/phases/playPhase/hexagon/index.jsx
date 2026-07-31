import { useCallback, useContext } from 'react';
import { StateContext } from 'State';
import cells from 'Domain/cells';
import { areCoordsInList } from 'Domain/utils';
import { directPiece } from 'Game/actions';
import useCellAction from 'Hooks/useCellAction';
import { useDragController } from 'Client/drag';
import Piece from '../piece/index';

import HexagonStyled from './styled';

function Hexagon({ row, cell, piece, highlighted, edge, aim }) {
	const [_state, dispatch] = useContext(StateContext);
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

	// Hovering a cell points the selected piece towards it. TableBoard passes aim as null unless
	// the piece has finished moving, which is what stops a hover hijacking a move.
	const onMouseEnter = useCallback(() => {
		if (!aim) {
			return;
		}

		const intendedDirection = cells.getDirection(aim.from, [row, cell]);

		if (areCoordsInList(intendedDirection, aim.directions)) {
			dispatch(directPiece(intendedDirection));
		}
	}, [aim, dispatch, row, cell]);

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
