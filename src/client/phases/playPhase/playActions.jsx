import React, { useMemo, useContext, useCallback } from 'react';
import { StateContext } from 'State';
import { pz } from 'Domain/pieces';
import { TEAM_NAMES } from 'Domain/teams';
import py from 'Domain/py';
import useBooleanState from 'Hooks/useBooleanState';
import { snipe, revealFriend, revealFoe } from 'Client/actions';
import { Alignments, AlignmentFriend, AlignmentFoe } from 'Client/components/alignments';
import { Button } from 'Client/components/button';
import {
	Actions,
	Action,
	AlignmentWarningStyled,
	AlignmentWarningMessage,
	RevealContainer,
	RevealMessage,
	RevealActions,
	RevealCancelButton,
	RevealCard,
} from './components';

function useSnipe() {
	const [{ pieces }, dispatch] = useContext(StateContext);

	const isSniperOnBoard = pz.isSniperOnBoard(pieces);

	const onSnipe = useCallback(() => {
		if (isSniperOnBoard) {
			dispatch(snipe());
		}
	}, [isSniperOnBoard]);

	return [isSniperOnBoard, onSnipe];
}

function useReveal() {
	const [{ players }] = useContext(StateContext);

	const [isRevealShown, showReveal, hideReveal] = useBooleanState(false);

	const isRevealActive = useMemo(() => py.isRevealActive(players), [players]);

	const onReveal = useCallback(() => {
		if (isRevealActive) {
			showReveal();
		}
	});

	return [isRevealShown, isRevealActive, onReveal, hideReveal];
}

function useAlignmentMessages() {
	const [isAlignmentWarningShown, showWarning, hideWarning] = useBooleanState(false);
	const [isAlignmentShown, showAlignment, hideAlignment] = useBooleanState(false);

	const onWarningConfirm = useCallback(() => {
		hideWarning();
		showAlignment();
	}, [hideWarning, showAlignment]);

	return [isAlignmentWarningShown, isAlignmentShown, showWarning, onWarningConfirm, hideAlignment];
}

function RevealedAlignments() {
	const [{ players }] = useContext(StateContext);
	const player = useMemo(() => players.find(player => player.turn), [players]);

	const showFriend = player.revealed.friend;
	const showFoe = player.revealed.foe;

	return (
		<>
			{showFriend && (
				<AlignmentFriend small disabled player={player.name} team={player.alignment.friend}>
					{TEAM_NAMES[player.alignment.friend]}
				</AlignmentFriend>
			)}
			{showFoe && (
				<AlignmentFoe small disabled player={player.name} team={player.alignment.foe}>
					{TEAM_NAMES[player.alignment.foe]}
				</AlignmentFoe>
			)}
		</>
	);
}

function RevealAlignment(props) {
	const { onClose } = props;
	const [{ players }, dispatch] = useContext(StateContext);

	const player = useMemo(() => players.find(player => player.turn), [players]);

	const isFriendRevealed = py.isFriendRevealed(players);
	const isFoeRevealed = py.isFoeRevealed(players);

	const onRevealFriend = useCallback(() => dispatch(revealFriend(players)), [players]);
	const onRevealFoe = useCallback(() => dispatch(revealFoe(players)), [players]);

	return (
		<RevealContainer>
			<RevealMessage>Reveal Alignment: </RevealMessage>
			<RevealActions>
				{isFriendRevealed ? (
					<AlignmentFriend small disabled player={player.name} team={player.alignment.friend}>
						{TEAM_NAMES[player.alignment.friend]}
					</AlignmentFriend>
				) : (
					<RevealCard onClick={onRevealFriend}>Friend</RevealCard>
				)}

				{isFoeRevealed ? (
					<AlignmentFoe small disabled player={player.name} team={player.alignment.foe}>
						{TEAM_NAMES[player.alignment.foe]}
					</AlignmentFoe>
				) : (
					<RevealCard onClick={onRevealFoe}>Foe</RevealCard>
				)}

				<RevealCancelButton small active onClick={onClose}>
					CANCEL
				</RevealCancelButton>
			</RevealActions>
		</RevealContainer>
	);
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
			<AlignmentFriend small disabled player={player.name} team={player.alignment.friend}>
				{TEAM_NAMES[player.alignment.friend]}
			</AlignmentFriend>
			<AlignmentFoe small disabled player={player.name} team={player.alignment.foe}>
				{TEAM_NAMES[player.alignment.foe]}
			</AlignmentFoe>
			<Button small active onClick={onClose}>
				HIDE
			</Button>
		</Alignments>
	);
}

function PlayActions() {
	const [isSniperOnBoard, onSnipe] = useSnipe();
	const [isRevealShown, isRevealActive, onReveal, hideReveal] = useReveal();
	const [
		isAlignmentWarningShown,
		isAlignmentShown,
		showWarning,
		onWarningConfirm,
		hideAlignment,
	] = useAlignmentMessages();

	return (
		<Actions>
			<Action>
				<Button id="snipe" small active={isSniperOnBoard} onClick={onSnipe}>
					SNIPE!
				</Button>
			</Action>
			<Action>
				{!isRevealShown && <RevealedAlignments />}
				{!isRevealShown && (
					<Button id="reveal" active={isRevealActive} onClick={onReveal}>
						REVEAL
					</Button>
				)}
				{isRevealShown && <RevealAlignment onClose={hideReveal} />}
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
	);
}

export default PlayActions;
