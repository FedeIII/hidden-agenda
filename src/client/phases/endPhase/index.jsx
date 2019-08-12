import React, { useContext } from 'react';
import { StateContext } from 'State';
import pz from 'Domain/pz';
import HQs from 'Client/components/hqs';
import HqStyled from 'Client/components/hqStyled';
import { Cementery, Survivors } from 'Client/components/pieceCount';
import {
  EndPhaseStyled,
  Score,
  Points,
  PieceCountTitle,
  PieceCountContainer,
} from './components';
import PieceScoreTable from './pieceScoreTable';

function renderScore(team) {
  const [{ pieces }] = useContext(StateContext);

  return (
    <Score>
      {pz.getPointsForTeam(team, pieces)}
      <Points>pts</Points>
    </Score>
  );
}

function TeamScore({ team }) {
  return (
    <HqStyled team={team}>
      {renderScore(team)}
      <PieceCountContainer>
        <PieceCountTitle>Killed:</PieceCountTitle>
        <Cementery team={team} />
      </PieceCountContainer>
      <PieceCountContainer>
        <PieceCountTitle>Survivors:</PieceCountTitle>
        <Survivors team={team} />
      </PieceCountContainer>
    </HqStyled>
  );
}

function EndPhase() {
  return (
    <EndPhaseStyled>
      <HQs>
        <TeamScore team="0" />
        <TeamScore team="1" />
      </HQs>

      <PieceScoreTable />

      <HQs>
        <TeamScore team="2" />
        <TeamScore team="3" />
      </HQs>
    </EndPhaseStyled>
  );
}

export default EndPhase;
