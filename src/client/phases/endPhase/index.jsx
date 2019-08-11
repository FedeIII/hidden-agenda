import React, { useContext, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { StateContext } from 'State';
import Button from 'Client/components/button';
import pz from 'Domain/pz';
import HQs from 'Client/components/hqs';
import HqStyled from 'Client/components/hqStyled';
import Cementery from 'Client/components/cementery';
import { EndPhaseStyled, Score, Points } from './components';

function renderScore(team) {
  const [{ pieces }] = useContext(StateContext);

  return (
    <Score>
      {pz.getPointsForTeam(team, pieces)}<Points>pts</Points>
    </Score>
  );
}

function EndPhase() {
  return (
    <EndPhaseStyled>
      <HQs>
        <HqStyled team="0">
          {renderScore('0')}
          <Cementery team="0" />
        </HqStyled>
        <HqStyled team="1">
          {renderScore('1')}
          <Cementery team="1" />
        </HqStyled>
      </HQs>
      <HQs>
        <HqStyled team="2">
          {renderScore('2')}
          <Cementery team="2" />
        </HqStyled>
        <HqStyled team="3">
          {renderScore('3')}
          <Cementery team="3" />
        </HqStyled>
      </HQs>
    </EndPhaseStyled>
  );
}

export default EndPhase;
