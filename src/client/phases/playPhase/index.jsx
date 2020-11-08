import React, { useMemo, useContext, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { StateContext } from 'State';

import { Title } from 'Client/components/title';
import HQs from 'Client/components/hqs';
import { Alignments, AlignmentFriend, AlignmentFoe } from 'Client/components/alignments';
import { Button } from 'Client/components/button';
import useBooleanState from 'Hooks/useBooleanState';
import { pz } from 'Domain/pieces';
import py from 'Domain/py';
import { nextTurn, snipe } from 'Client/actions';
import { TEAM_NAMES } from 'Domain/teams';
import {
	PlayPhaseContainer,
	Board,
	Actions,
	Action,
	AlignmentWarningStyled,
	AlignmentWarningMessage,
} from './components';
import HQ from './hq';
import TableBoard from './tableBoard';

function useAlignmentMessages() {
	const [isAlignmentWarningShown, showWarning, hideWarning] = useBooleanState(false);
	const [isAlignmentShown, showAlignment, hideAlignment] = useBooleanState(false);

	const onWarningConfirm = useCallback(() => {
		hideWarning();
		showAlignment();
	}, [hideWarning, showAlignment]);

	return [isAlignmentWarningShown, isAlignmentShown, showWarning, onWarningConfirm, hideAlignment];
}

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

function useRenderTurn() {
	const [{ players }] = useContext(StateContext);

	return useCallback(() => `Player's turn: ${py.getTurn(players)}`, [players]);
}

function useGameFinished() {
	const [{ pieces }] = useContext(StateContext);

	return pz.hasGameFinished(pieces);
}

function AlignmentWarning(props) {
	const { onClose } = props;
	const [{ players }] = useContext(StateContext);

	const playerName = useMemo(() => players.find(player => player.turn).name, [players]);

	return (
		<AlignmentWarningStyled>
			<AlignmentWarningMessage>This information is only for {playerName}'s eyes</AlignmentWarningMessage>
			<Button small active onClick={onClose}>
				Confirm
			</Button>
		</AlignmentWarningStyled>
	);
}

function AlignmentReminder(props) {
	const { onClose } = props;
	const [{ players }] = useContext(StateContext);

	const player = useMemo(() => players.find(player => player.turn), [players]);

	return (
		<Alignments small>
			<AlignmentFriend small disabled player={player.name} team={player.friend}>
				{TEAM_NAMES[player.friend]}
			</AlignmentFriend>
			<AlignmentFoe small disabled player={player.name} team={player.foe}>
				{TEAM_NAMES[player.foe]}
			</AlignmentFoe>
			<Button small active onClick={onClose}>
				HIDE
			</Button>
		</Alignments>
	);
}

function PlayPhase() {
	const [
		isAlignmentWarningShown,
		isAlignmentShown,
		showWarning,
		onWarningConfirm,
		hideAlignment,
	] = useAlignmentMessages();

	const readyToPlay = useReadyToPlay();
	const renderTurn = useRenderTurn();
	const gameFinished = useGameFinished();
	const [{ hasTurnEnded, pieces }, dispatch] = useContext(StateContext);

	const isSniperOnBoard = pz.isSniperOnBoard(pieces);

	const onSnipe = useCallback(() => {
		if (isSniperOnBoard) {
			dispatch(snipe());
		}
	}, [isSniperOnBoard]);

	const onNextTurn = useCallback(() => {
		if (hasTurnEnded) {
			dispatch(nextTurn());
		}
	}, [hasTurnEnded]);

	return (
		<PlayPhaseContainer>
			{!readyToPlay && <Redirect to="/" />}
			{gameFinished && <Redirect to="/end" />}

			<Title>{renderTurn()}</Title>

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

			<Actions>
				<Action>
					<Button id="snipe" mall active={isSniperOnBoard} onClick={onSnipe}>
						SNIPE!
					</Button>
				</Action>
				<Action>
					<Button id="next-turn" active={hasTurnEnded} onClick={onNextTurn}>
						NEXT TURN
					</Button>
				</Action>
				<Action>
					{!isAlignmentWarningShown && !isAlignmentShown && (
						<Button small active onClick={showWarning}>
							FRIEND & FOE
						</Button>
					)}
					{isAlignmentWarningShown && <AlignmentWarning onClose={onWarningConfirm} />}
					{isAlignmentShown && <AlignmentReminder onClose={hideAlignment} />}
				</Action>
			</Actions>
		</PlayPhaseContainer>
	);
}

export default PlayPhase;
