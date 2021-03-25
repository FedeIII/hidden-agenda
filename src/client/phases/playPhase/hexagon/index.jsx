import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { StateContext } from 'State';
import { pz } from 'Domain/pieces';
import { togglePiece, movePiece } from 'Client/actions';
import Piece from '../piece/index';

import HexagonStyled from './styled';

function useOnCellClick(coords) {
	const [{ followMouse, pieces, pieceState }, dispatch] = useContext(StateContext);

	return useCallback(
		event => {
			event && event.preventDefault && event.preventDefault();
			event && event.stopPropagation && event.stopPropagation();

      const selectedPiece = pz.getSelectedPiece(pieces);

      if (pz.isTogglePieceOnCellClick(followMouse, coords, pieces, pieceState)) {
        dispatch(togglePiece(selectedPiece.id));
      } else if (pz.isMovePieceOnCellClick(followMouse, coords, pieces, pieceState)) {
        dispatch(movePiece(selectedPiece.id, coords));
      }
		},
		[followMouse, pieces],
	);
}

function Hexagon({ row, cell, piece, highlighted, onMouseEnter, edge }) {
	const onCellClick = useOnCellClick([row, cell]);

	const [{}, drop] = useDrop(
		() => ({
			accept: 'PIECE',
			drop: onCellClick,
		}),
		[onCellClick],
	);

	return (
		<HexagonStyled
			id={`hex-${row}-${cell}`}
			ref={drop}
			highlighted={highlighted}
			row={row}
			cell={cell}
			edge={edge}
			onClick={onCellClick}
			onMouseEnter={onMouseEnter}
		>
			{piece && <Piece {...piece} />}
		</HexagonStyled>
	);
}

Hexagon.propTypes = {
	row: PropTypes.number.isRequired,
	cell: PropTypes.number.isRequired,
	// piece: PropTypes.object,
	// highlighted: PropTypes.bool,
};

export default Hexagon;
