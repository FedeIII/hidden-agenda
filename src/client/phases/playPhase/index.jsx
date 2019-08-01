import React, { useContext, useCallback } from 'react';
import { Players } from 'State/players/playersProviders';
import { HasTurnEnded } from 'State/hasTurnEnded/hasTurnEndedProviders';
import { PlayPhaseStyled, Turn, Board, Buttons, HQs } from './components';
import HQ from './hq';
import TableBoard from './tableBoard';

function useRenderTurn() {
  const players = useContext(Players);

  return useCallback(
    () => `Player's turn: ${players.find(player => player.turn).name}`,
    [players],
  );
}

function PlayPhase() {
  const renderTurn = useRenderTurn();
  const hasTurnEnded = useContext(HasTurnEnded);

  const nextTurnBtnClass = 'btn' + (hasTurnEnded ? ' btn--active' : '');
  // const snipeBtnClass =
  //   'btn btn--small' + (isSniperOnBoard ? ' btn--active' : '');

  return (
    <PlayPhaseStyled>
      <Turn>{renderTurn()}</Turn>
      <Board>
        <HQs>
          <HQ team="0" />
          <HQ team="1" />
        </HQs>
        <TableBoard />
        <HQs>
          <HQ team="2" />
          <HQ team="3" />
        </HQs>
      </Board>
      <Buttons>
        {/* <button className={snipeBtnClass} onClick={onSnipe}>
          SNIPE!
        </button> */}
        <button className={nextTurnBtnClass}>NEXT TURN</button>
      </Buttons>
    </PlayPhaseStyled>
  );
}

export default PlayPhase;
