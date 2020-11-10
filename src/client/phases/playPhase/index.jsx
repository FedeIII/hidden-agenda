import React, { useContext, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { StateContext } from 'State';

import { Title } from 'Client/components/title';
import HQs from 'Client/components/hqs';
import { Button } from 'Client/components/button';
import { pz } from 'Domain/pieces';
import py from 'Domain/py';
import { nextTurn } from 'Client/actions';
import { PlayPhaseContainer, Board } from './components';
import HQ from './hq';
import TableBoard from './tableBoard';
import PlayActions from './playActions';

function useReadyToPlay() {
	const [{ players }] = useContext(StateContext);

	return useCallback(() => {
		const playerNames = Object.values(players);

		return (
			playerNames.length > 1 &&
			playerNames.reduce((arePlayersReady, playerName) => arePlayersReady && playerName, true)
		);
	}, [players]);
}

function useGameFinished() {
	const [{ pieces }] = useContext(StateContext);

	return pz.hasGameFinished(pieces);
}

function useRenderTurn() {
	const [{ players }] = useContext(StateContext);

	return useCallback(() => `Player's turn: ${py.getTurn(players)}`, [players]);
}

function useNextTurn() {
	const [{ hasTurnEnded }, dispatch] = useContext(StateContext);

	const onNextTurn = useCallback(() => {
		if (hasTurnEnded) {
			dispatch(nextTurn());
		}
	}, [hasTurnEnded]);

	return [hasTurnEnded, onNextTurn];
}

function PlayPhase() {
	const readyToPlay = useReadyToPlay();
	const gameFinished = useGameFinished();
	const renderTurn = useRenderTurn();
	const [hasTurnEnded, onNextTurn] = useNextTurn();

	return (
		<PlayPhaseContainer>
			{!readyToPlay && <Redirect to="/" />}
			{gameFinished && <Redirect to="/end" />}

			<Title>
				{renderTurn()}
				{'  '}
				<Button small id="next-turn" active={hasTurnEnded} onClick={onNextTurn}>
					NEXT TURN
				</Button>
			</Title>

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

			<PlayActions />
		</PlayPhaseContainer>
	);
}

export default PlayPhase;
