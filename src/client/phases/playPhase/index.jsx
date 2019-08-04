import React, { useContext, useCallback } from 'react';
import { StateContext } from 'State';
import Button from 'Client/components/button';
import pz from 'Shared/pz';
import { nextTurn, snipe } from 'Client/actions';
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
  const [{ hasTurnEnded, pieces }, dispatch] = useContext(StateContext);

  const isSniperOnBoard = pz.isSniperOnBoard(pieces);

  const onSnipe = useCallback(() => {
    if (isSniperOnBoard) {
      dispatch(snipe());
    }
  }, [dispatch, pieces]);

  const onNextTurn = useCallback(() => {
    if (hasTurnEnded) {
      dispatch(nextTurn());
    }
  }, [dispatch, hasTurnEnded]);

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
        <Button small active={isSniperOnBoard} onClick={onSnipe}>
          SNIPE!
        </Button>
        <Button active={hasTurnEnded} onClick={onNextTurn}>
          NEXT TURN
        </Button>
      </Buttons>
    </PlayPhaseStyled>
  );
}

export default PlayPhase;
