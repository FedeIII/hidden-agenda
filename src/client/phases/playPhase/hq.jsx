import React, { useContext } from 'react';
import { StateContext } from 'State';
import pz from 'Domain/pz';
import HqStyled from 'Client/components/hqStyled';
import { Cementery } from 'Client/components/pieceCount';
import { HqStore } from './components';
import Piece from './piece/index';

function getNotStartedTeamPieces(pieces, team) {
  return pz.getAllTeamPieces(team, pieces).filter(piece => !piece.position);
}

function HQ({ team }) {
  const [{ pieces }] = useContext(StateContext);

  return (
    <HqStyled key={`team${team}`} team={team}>
      <HqStore>
        {getNotStartedTeamPieces(pieces, team).map(piece => (
          <Piece key={piece.id} {...piece} />
        ))}
      </HqStore>
      <Cementery team={team} />
    </HqStyled>
  );
}

export default HQ;
