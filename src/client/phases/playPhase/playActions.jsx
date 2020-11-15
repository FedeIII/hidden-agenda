import React, { useMemo, useContext, useCallback, useState } from 'react';
import { StateContext } from 'State';
import { pz } from 'Domain/pieces';
import { TEAM_NAMES } from 'Domain/teams';
import py from 'Domain/py';
import useBooleanState from 'Hooks/useBooleanState';
import { snipe, revealFriend, revealFoe, accuse } from 'Client/actions';
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
	AccuseTeam,
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

function useAccuseMenu() {
	return useBooleanState(false);
}

function useRevealMenu() {
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

function useAccuseActions(onExit) {
	const [{ players }, dispatch] = useContext(StateContext);
	const [playerAccused, setPlayerAccused] = useState(null);
	const [alignmentAccused, setAlignmentAccused] = useState(null);

	const accuseActions = {
		player: useMemo(() => players.map(player => () => setPlayerAccused(player.name)), [players, setPlayerAccused]),
		alignment: {
			friend: useCallback(() => setAlignmentAccused('friend'), [setAlignmentAccused]),
			foe: useCallback(() => setAlignmentAccused('foe'), [setAlignmentAccused]),
			back: useCallback(() => setPlayerAccused(null), [setPlayerAccused]),
		},
		team: useMemo(
			() =>
				Object.keys(TEAM_NAMES).map(team => () =>
					dispatch(
						accuse({
							player: playerAccused,
							alignment: alignmentAccused,
							team,
						}),
					),
				),
			[dispatch, accuse, playerAccused, alignmentAccused],
		),
	};

	accuseActions.player.back = useMemo(
		() => () => {
			setAlignmentAccused(null);
			onExit();
		},
		[setAlignmentAccused, onExit],
	);
	accuseActions.team.back = useMemo(() => () => setAlignmentAccused(null), [setAlignmentAccused]);

	return [playerAccused, alignmentAccused, accuseActions];
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

function AccuseMenu(props) {
	const { onClose } = props;
	const [{ players }] = useContext(StateContext);
	const [playerAccused, alignmentAccused, accuseActions] = useAccuseActions(onClose);

	const isPlayersShown = !playerAccused;
	const isAlignmentsShown = !!playerAccused && !alignmentAccused;
	const isTeamssShown = !!playerAccused && !!alignmentAccused;

	return (
		<RevealActions>
			{isPlayersShown && (
				<>
					{players
						.filter(player => py.getTurn(players) != player.name)
						.map((player, index) => (
							<ActionButton
								active
								id={`accuse-player-${index}`}
								key={`accuse-player-${player.name}`}
								onClick={accuseActions.player[index]}
							>
								{player.name}
							</ActionButton>
						))}
					<ActionCancelButton small active onClick={accuseActions.player.back}>
						CANCEL
					</ActionCancelButton>
				</>
			)}

			{isAlignmentsShown && (
				<>
					<ActionButton active id="accuse-friend" onClick={accuseActions.alignment.friend}>
						Friend
					</ActionButton>
					<ActionButton active id="accuse-foe" onClick={accuseActions.alignment.foe}>
						Foe
					</ActionButton>
					<ActionCancelButton small active onClick={accuseActions.alignment.back}>
						CANCEL
					</ActionCancelButton>
				</>
			)}

			{isTeamssShown && (
				<>
					{Object.values(TEAM_NAMES).map((teamName, index) => (
						<AccuseTeam
							active
							id={`accuse-team-${index}`}
							key={`accuse-team-${teamName}`}
							team={index}
							onClick={accuseActions.team[index]}
						>
							{teamName}
						</AccuseTeam>
					))}
					<ActionCancelButton small active onClick={accuseActions.team.back}>
						CANCEL
					</ActionCancelButton>
				</>
			)}
		</RevealActions>
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
				<Button id="snipe" small active={isSniperOnBoard} onClick={onSnipe}>
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
