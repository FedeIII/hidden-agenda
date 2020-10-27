import React from 'react';
import PieceStyled from 'Client/components/pieceStyled';
import { Table, Row, Cell } from './components';

function PieceType({ type }) {
  const image = `img/0-${type}.png`;

  return <PieceStyled src={image} killed />;
}

function PieceScore() {
  return (
    <Table>
      <Row>
        <Cell>
          <PieceType type="A" /> 5 pts
        </Cell>
        <Cell>
          <PieceType type="S" /> 10 pts
        </Cell>
      </Row>

      <Row>
        <Cell>
          <PieceType type="N" /> 10 pts
        </Cell>
        <Cell>
          <PieceType type="C" /> 20 pts
        </Cell>
      </Row>
    </Table>
  );
}

export default PieceScore;
