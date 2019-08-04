import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { StateContext } from 'State';
import pz from 'Shared/pz';
import { areCoordsInList } from 'Shared/utils';
import { togglePiece, movePiece, directPiece } from 'Client/actions';

import HexagonStyled from './styled';

// import PieceContainer from 'containers/pieceContainer';

function useOnCellClick(coords) {
  const [{ followMouse, pieces }, dispatch] = useContext(StateContext);

  return useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();

      const highlightedCells = pz.getHighlightedCells(pieces);
      const selectedPiece = pz.getSelectedPiece(pieces);

      if (followMouse) {
        if (selectedPiece) {
          dispatch(togglePiece(selectedPiece.id));
        }
      } else if (areCoordsInList(coords, highlightedCells)) {
        dispatch(movePiece(selectedPiece.id, coords));
      }
    },
    [followMouse, pieces],
  );
}

function Hexagon({ row, cell, piece, highlighted }) {
  const onCellClick = useOnCellClick([row, cell]);

  // function renderPiece() {
  //   if (piece) {
  //     return <PieceContainer {...piece} />;
  //   }
  // }

  // const PieceComponent = renderPiece();

  return (
    <HexagonStyled
      highlighted={highlighted}
      row={row}
      cell={cell}
      onClick={onCellClick}
      // onMouseEnter={onMouseEnter}
    >
      {/* {PieceComponent} */}
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
