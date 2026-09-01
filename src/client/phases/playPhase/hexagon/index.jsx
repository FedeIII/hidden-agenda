import { useCallback, useContext } from 'react';
import { StateContext } from 'State';
import cells from 'Domain/cells';
import { areCoordsInList } from 'Domain/utils';
import { directPiece } from 'Game/actions';
import useCellAction from 'Hooks/useCellAction';
import { useDragController } from 'Client/drag';
import Piece from '../piece/index';
import FallenSniper from '../fallenSniper';
import LastMove from '../lastMove';

import HexagonStyled from './styled';

// The token's own footprint, near enough the whole cell. Centred — which means it covers the
// cell's centre, so a click on an occupied cell lands on the piece and bubbles to the hexagon,
// running both handlers. That is exactly what the flat renderer does (its <img> overhangs the
// cell and covers the centre too), and a good deal of the game's behaviour is built on it.
//
// In percentages, so it follows the hexagon's box without arithmetic — and never as a transform,
// which belongs to the piece's facing and is read back as a matrix.
// Shifted up, because the token is drawn STANDING on the tile: its height projects about a fifth
// of a cell up the screen, so a box centred on the cell would leave the top of the chip outside
// its own hit target and clicking there would reach the row behind it.
const TOKEN_BOX = { left: '6%', top: '-6%', width: '88%', height: '96%' };

function Hexagon({ row, cell, piece, highlighted, preview, edge, aim, box, onHover, fallenSniper, lastMove }) {
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
		if (onHover) {
			onHover([row, cell]);
		}

		if (!aim) {
			return;
		}

		const intendedDirection = cells.getDirection(aim.from, [row, cell]);

		if (areCoordsInList(intendedDirection, aim.directions)) {
			dispatch(directPiece(intendedDirection));
		}
	}, [aim, dispatch, onHover, row, cell]);

	return (
		<HexagonStyled
			id={`hex-${row}-${cell}`}
			highlighted={highlighted}
			// How many moves away this cell is, when it is one the selected piece could only reach
			// later. 0 or undefined when it is not.
			preview={preview}
			row={row}
			cell={cell}
			edge={edge}
			projected={!!box}
			style={box}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
		>
			{piece && <Piece {...piece} box={box && TOKEN_BOX} />}

			{/* Only on the flat board. Projected, this hexagon is opacity: 0 and would take a mark
			    down with it, so TableBoard lays both on the board instead. */}
			{fallenSniper && !box && <FallenSniper id={fallenSniper} />}

			{lastMove && !box && <LastMove move={lastMove} />}
		</HexagonStyled>
	);
}

export default Hexagon;
