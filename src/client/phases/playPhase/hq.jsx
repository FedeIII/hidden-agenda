import React, { useContext } from 'react';
import { StateContext } from 'State';
import { HqStyled, HqStore } from './components';
import Piece from './piece/index';

function getTeamPieces(pieces, team) {
  return pieces.filter(piece => piece.id.charAt(0) === team && !piece.position);
}

function HQ({ team }) {
  const [{ pieces }] = useContext(StateContext);

  return (
    <HqStyled key={`team${team}`} team={team}>
      <HqStore>
        {getTeamPieces(pieces, team).map(piece => (
          <Piece key={piece.id} {...piece} />
        ))}
      </HqStore>
    </HqStyled>
  );
}

export default HQ;
