import React, { useMemo, useContext, useCallback, useEffect } from 'react';
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
	ActionCancelButton,
	ActionButton,
	AlignmentWarningStyled,
	AlignmentWarningMessage,
	RevealContainer,
	RevealMessage,
	RevealActions,
	RevealCard,
} from './components';
import AccuseMenu from './accuseMenu';

function useSnipe() {
	const [{ pieces }, dispatch] = useContext(StateContext);

	const isSniperOnBoard = pz.isSniperOnBoard(pieces);

	const onSnipe = useCallback(() => {
		if (isSniperOnBoard) {
			dispatch(snipe());
		}
	}, [isSniperOnBoard]);

	return onSnipe;
}

function useAccuseMenu() {
	const [isAccusedShown, showAccuseMenu, hideAccuseMenu] = useBooleanState(false);
	const [{ players }] = useContext(StateContext);
	const playerName = py.getTurn(players);

	useEffect(() => hideAccuseMenu(), [playerName]);

	return [isAccusedShown, showAccuseMenu, hideAccuseMenu];
}

function useRevealMenu() {
	const [isRevealShown, showRevealMenu, hideRevealMenu] = useBooleanState(false);
	const [{ players }] = useContext(StateContext);
	const playerName = py.getTurn(players);

	useEffect(() => hideRevealMenu(), [playerName]);

	const isRevealActive = useMemo(() => py.isRevealActive(players), [players]);

	const onReveal = useCallback(() => {
		if (isRevealActive) {
			showRevealMenu();
		}
	});

	return [isRevealShown, isRevealActive, onReveal, hideRevealMenu];
}

function useAlignmentMessages() {
	const [isAlignmentWarningShown, showWarning, hideWarning] = useBooleanState(false);
	const [isAlignmentShown, showAlignment, hideAlignment] = useBooleanState(false);

	const [{ players }] = useContext(StateContext);
	const playerName = py.getTurn(players);

	useEffect(() => {
		hideWarning();
		hideAlignment();
	}, [playerName]);

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

function RevealAlignmentMenu(props) {
	const { onClose } = props;
	const [{ players }, dispatch] = useContext(StateContext);

	const player = useMemo(() => players.find(player => player.turn), [players]);

	const isFriendRevealed = py.isOwnFriendRevealed(players);
	const isFoeRevealed = py.isOwnFoeRevealed(players);

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
					<RevealCard id="reveal-friend" onClick={onRevealFriend}>
						Friend
					</RevealCard>
				)}

				{isFoeRevealed ? (
					<AlignmentFoe small disabled player={player.name} team={player.alignment.foe}>
						{TEAM_NAMES[player.alignment.foe]}
					</AlignmentFoe>
				) : (
					<RevealCard id="reveal-foe" onClick={onRevealFoe}>
						Foe
					</RevealCard>
				)}

				<ActionCancelButton small active onClick={onClose}>
					CANCEL
				</ActionCancelButton>
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
	const onSnipe = useSnipe();
	const [isAccusedShown, showAccuseMenu, hideAccuseMenu] = useAccuseMenu();
	const [isRevealShown, isRevealActive, onReveal, hideReveal] = useRevealMenu();
	const [
		isAlignmentWarningShown,
		isAlignmentShown,
		showWarning,
		onWarningConfirm,
		hideAlignment,
	] = useAlignmentMessages();

	const isMainActions = !isAccusedShown && !isRevealShown;

	return (
		<Actions>
			<Action>
				<Button id="snipe" small active onClick={onSnipe}>
					SNIPE!
				</Button>
			</Action>
			<Action>
				{isMainActions && (
					<>
						<ActionButton active id="accuse" onClick={showAccuseMenu}>
							ACCUSE
						</ActionButton>{' '}
						<RevealedAlignments />{' '}
						<ActionButton id="reveal" active={isRevealActive} onClick={onReveal}>
							REVEAL
						</ActionButton>
					</>
				)}
				{isRevealShown && <RevealAlignmentMenu onClose={hideReveal} />}
				{isAccusedShown && <AccuseMenu onClose={hideAccuseMenu} />}
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
