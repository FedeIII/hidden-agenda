import React from 'react';
import PieceStyled from 'Client/components/pieceStyled';
import { PieceTable, PieceRow, PieceCell } from './components';

function PieceType({ type }) {
  const image = `img/0-${type}.png`;

  return <PieceStyled src={image} killed />;
}

function PieceScore() {
  return (
    <PieceTable>
      <PieceRow>
        <PieceCell>
          <PieceType type="A" /> 5 pts
        </PieceCell>
        <PieceCell>
          <PieceType type="S" /> 10 pts
        </PieceCell>
      </PieceRow>

      <PieceRow>
        <PieceCell>
          <PieceType type="N" /> 10 pts
        </PieceCell>
        <PieceCell>
          <PieceType type="C" /> 20 pts
        </PieceCell>
      </PieceRow>
    </PieceTable>
  );
}

export default PieceScore;
