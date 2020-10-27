import React, { useContext } from 'react';
import { StateContext } from 'State';
import teams from 'Domain/teams';
import HQs from 'Client/components/hqs';
import HqStyled from 'Client/components/hqStyled';
import { Cementery, Survivors } from 'Client/components/pieceCount';
import {
  EndPhaseContainer,
  Score,
  Points,
  PieceCountTitle,
  PieceCountContainer,
  Scores,
} from './components';
import PieceScore from './pieceScore';
import PlayersScore from './playersScore';

function renderScore(team) {
  const [{ pieces }] = useContext(StateContext);

  return (
    <Score>
      {teams.getPointsForTeam(team, pieces)}
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
    <EndPhaseContainer>
      <HQs>
        <TeamScore team="0" />
        <TeamScore team="1" />
      </HQs>

      <Scores>
        <PieceScore />
        <PlayersScore />
      </Scores>

      <HQs>
        <TeamScore team="2" />
        <TeamScore team="3" />
      </HQs>
    </EndPhaseContainer>
  );
}

export default EndPhase;
