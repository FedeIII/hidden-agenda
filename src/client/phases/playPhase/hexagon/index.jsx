import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { StateContext } from 'State';
import pz from 'Domain/pz';
import { areCoordsInList } from 'Domain/utils';
import { togglePiece, movePiece } from 'Client/actions';
import Piece from '../piece/index';

import HexagonStyled from './styled';

// import PieceContainer from 'containers/pieceContainer';

function useOnCellClick(coords) {
  const [{ followMouse, pieces }, dispatch] = useContext(StateContext);

  return useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();

      const highlightedPositions = pz.getHighlightedPositions(pieces);
      const selectedPiece = pz.getSelectedPiece(pieces);

      if (followMouse) {
        if (selectedPiece) {
          dispatch(togglePiece(selectedPiece.id));
        }
      } else if (areCoordsInList(coords, highlightedPositions)) {
        dispatch(movePiece(selectedPiece.id, coords));
      }
    },
    [followMouse, pieces],
  );
}

function Hexagon({ row, cell, piece, highlighted, onMouseEnter, edge }) {
  const onCellClick = useOnCellClick([row, cell]);

  return (
    <HexagonStyled
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
