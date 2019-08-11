import React, { useContext } from 'react';
import styled from 'styled-components';
import { StateContext } from 'State';
import pz from 'Domain/pz';
import PieceStyled from './pieceStyled';

const CementeryStyled = styled.div`
  letter-spacing: -3px;
  display: flex;
  min-height: 26px;
  align-items: end;
  /* justify-content: space-around; */
  justify-content: flex-start;
  width: 100%;
`;

const CementeryCount = styled.span`
  display: flex;
  color: ${({ team }) => (team === '1' || team === '2' ? 'white' : 'black')};
  flex-flow: column;
  align-items: center;
  flex-basis: 25%;
`;

function getGenericPieceTeam(team) {
  return team === '1' || team === '2' ? '2' : '0';
}

function KilledPiece({ type, team }) {
  const image = `img/${getGenericPieceTeam(team)}-${type}.png`;

  return <PieceStyled src={image} killed />;
}

function renderKilledPieces(pieces, team) {
  return Object.entries(pz.getPiecesKilledByTeam(team, pieces))
    .filter(([pieceType, pieceCount]) => pieceCount !== 0)
    .map(([pieceType, pieceCount]) => (
      <CementeryCount key={`cementery-${team}-${pieceType}`} team={team}>
        <KilledPiece type={pieceType} team={team} /> x {pieceCount}
      </CementeryCount>
    ));
}

function Cementery({ team }) {
  const [{ pieces }] = useContext(StateContext);

  return <CementeryStyled>{renderKilledPieces(pieces, team)}</CementeryStyled>;
}

export default Cementery;
