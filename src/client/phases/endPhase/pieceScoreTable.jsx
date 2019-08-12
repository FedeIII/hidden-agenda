import React from 'react';
import styled from 'styled-components';
import PieceStyled from 'Client/components/pieceStyled';

const Table = styled.div`
  background-color: lightslategray;
  border: 1px solid gray;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin: 70px;
  height: 33vh;
`;

const Row = styled.div`
  letter-spacing: -3px;
  display: flex;
  min-height: 26px;
  align-items: end;
  justify-content: space-evenly;
  width: 100%;
`;

const Cell = styled.span`
  display: flex;
  color: white;
  flex-flow: column;
  align-items: center;
  flex-basis: 33%;
  height: 10vh;
  justify-content: space-evenly;
  font-size: 18px;
`;

function PieceType({ type }) {
  const image = `img/0-${type}.png`;

  return <PieceStyled src={image} killed />;
}

function PieceScoreTable() {
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

export default PieceScoreTable;
