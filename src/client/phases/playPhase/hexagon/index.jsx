import React from 'react';
import PropTypes from 'prop-types';

import HexagonStyled from './styled';

// import PieceContainer from 'containers/pieceContainer';

function Hexagon({ row, cell, piece, highlighted }) {
  // function onCellClick(e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   onClick();
  // }

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
      // onClick={onCellClick}
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
