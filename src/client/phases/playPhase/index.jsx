import React, { useContext, useCallback } from 'react';
import { StateContext } from 'State';
import { PlayPhaseStyled, Turn, Board, Buttons, HQs } from './components';
import HQ from './hq';
import TableBoard from './tableBoard';

function useRenderTurn() {
  const [{ players }] = useContext(StateContext);

  return useCallback(
    () => `Player's turn: ${players.find(player => player.turn).name}`,
    [players],
  );
}

function PlayPhase() {
  const renderTurn = useRenderTurn();
  const [{hasTurnEnded}] = useContext(StateContext);

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
