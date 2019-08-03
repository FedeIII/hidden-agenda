import React from 'react';
import PropTypes from 'prop-types';

import HexagonStyled from './styled';

// import PieceContainer from 'containers/pieceContainer';

function Hexagon({ row, cell }) {
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

  // const className = highlighted ? ' hexagon--highlighted' : '';
  // const PieceComponent = renderPiece();

  return (
    <HexagonStyled
      // className={className}
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
