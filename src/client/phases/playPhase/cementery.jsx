import React, { useContext } from 'react';
import { StateContext } from 'State';
import pz from 'Domain/pz';
import { CementeryStyled, CementeryCount } from './components';
import PieceStyled from './piece/styled';

function KilledPiece({ type }) {
  const image = `img/0-${type}.png`;

  return <PieceStyled src={image} killed />;
}

function renderKilledPieces(pieces, team) {
  return Object.entries(pz.getPiecesKilledByTeam(team, pieces))
    .filter(([pieceType, pieceCount]) => pieceCount !== 0)
    .map(([pieceType, pieceCount]) => (
      <CementeryCount key={`cementery-${team}-${pieceType}`} team={team}>
        <KilledPiece type={pieceType} /> x {pieceCount}
      </CementeryCount>
    ));
}

function Cementery({ team }) {
  const [{ pieces }] = useContext(StateContext);

  return <CementeryStyled>{renderKilledPieces(pieces, team)}</CementeryStyled>;
}

export default Cementery;
