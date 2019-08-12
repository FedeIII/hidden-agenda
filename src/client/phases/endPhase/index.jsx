import React, { useContext, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { StateContext } from 'State';
import Button from 'Client/components/button';
import pz from 'Domain/pz';
import HQs from 'Client/components/hqs';
import HqStyled from 'Client/components/hqStyled';
import { Cementery, Survivors } from 'Client/components/pieceCount';
import { EndPhaseStyled, Score, Points, PieceCountTitle } from './components';

function renderScore(team) {
  const [{ pieces }] = useContext(StateContext);

  return (
    <Score>
      {pz.getPointsForTeam(team, pieces)}
      <Points>pts</Points>
    </Score>
  );
}

function EndPhase() {
  return (
    <EndPhaseStyled>
      <HQs>
        <HqStyled team="0">
          {renderScore('0')}
          <div>
            <PieceCountTitle>Killed:</PieceCountTitle>
            <Cementery team="0" />
          </div>
          <div>
            <PieceCountTitle>Survivors:</PieceCountTitle>
            <Survivors team="0" />
          </div>
        </HqStyled>
        <HqStyled team="1">
          {renderScore('1')}
          <div>
            <PieceCountTitle>Killed:</PieceCountTitle>
            <Cementery team="1" />
          </div>
          <div>
            <PieceCountTitle>Survivors:</PieceCountTitle>
            <Survivors team="1" />
          </div>
        </HqStyled>
      </HQs>
      <HQs>
        <HqStyled team="2">
          {renderScore('2')}
          <div>
            <PieceCountTitle>Killed:</PieceCountTitle>
            <Cementery team="2" />
          </div>
          <div>
            <PieceCountTitle>Survivors:</PieceCountTitle>
            <Survivors team="2" />
          </div>
        </HqStyled>
        <HqStyled team="3">
          {renderScore('3')}
          <div>
            <PieceCountTitle>Killed:</PieceCountTitle>
            <Cementery team="3" />
          </div>
          <div>
            <PieceCountTitle>Survivors:</PieceCountTitle>
            <Survivors team="3" />
          </div>
        </HqStyled>
      </HQs>
    </EndPhaseStyled>
  );
}

export default EndPhase;
