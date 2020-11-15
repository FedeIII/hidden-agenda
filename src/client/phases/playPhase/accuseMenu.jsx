import React, { useMemo, useContext, useCallback, useState, useEffect } from 'react';
import { StateContext } from 'State';
import { accuse } from 'Client/actions';
import { TEAM_NAMES } from 'Domain/teams';
import py from 'Domain/py';
import { AlignmentFriend, AlignmentFoe } from 'Client/components/alignments';
import { ActionCancelButton, ActionButton, RevealActions, AccuseTeam } from './components';

function useAccuseActions(onExit) {
	const [{ players }, dispatch] = useContext(StateContext);
	const [accusedPlayer, setAccusedPlayer] = useState(null);
	const [accusedAlignment, setAccusedAlignment] = useState(null);

	const playerTurn = py.getTurn(players);

	useEffect(() => {
		setAccusedPlayer(null);
		setAccusedAlignment(null);
	}, [playerTurn, setAccusedPlayer, setAccusedAlignment]);

	const accuseActions = {
		player: useMemo(() => players.map(player => () => setAccusedPlayer(player.name)), [players, setAccusedPlayer]),
		alignment: {
			friend: useCallback(() => setAccusedAlignment('friend'), [setAccusedAlignment]),
			foe: useCallback(() => setAccusedAlignment('foe'), [setAccusedAlignment]),
			back: useCallback(() => setAccusedPlayer(null), [setAccusedPlayer]),
		},
		team: useMemo(
			() =>
				Object.keys(TEAM_NAMES).map(team => () => {
					setAccusedAlignment(null);
					dispatch(
						accuse({
							accuser: playerTurn,
							accusee: accusedPlayer,
							alignment: accusedAlignment,
							team,
						}),
					);
				}),
			[dispatch, accuse, accusedPlayer, accusedAlignment],
		),
	};

	accuseActions.player.back = useCallback(() => {
		setAccusedAlignment(null);
		onExit();
	}, [setAccusedAlignment, onExit]);
	accuseActions.team.back = useCallback(() => setAccusedAlignment(null), [setAccusedAlignment]);

	return [accusedPlayer, accusedAlignment, accuseActions];
}

function PlayersMenu(props) {
	const { accusePlayer } = props;
	const [{ players }] = useContext(StateContext);

	return (
		<>
			{players.map((player, index) => (
				<ActionButton
					active
					id={`accuse-player-${index}`}
					key={`accuse-player-${player.name}`}
					hide={py.isPlayerTurn(players, player)}
					onClick={accusePlayer[index]}
				>
					{player.name}
				</ActionButton>
			))}
			<ActionCancelButton small active onClick={accusePlayer.back}>
				CANCEL
			</ActionCancelButton>
		</>
	);
}

function AlignmentMenu(props) {
	const { selectedPlayerName, accuseAlignment } = props;
	const [{ players }] = useContext(StateContext);

	const currentPlayer = players.find(player => player.turn);
	const selectedPlayer = players.find(player => player.name == selectedPlayerName);
	const isFriendRevealed = selectedPlayer.revealed.friend;
	const isFoeRevealed = selectedPlayer.revealed.foe;

	const onFriendClick = useCallback(() => {
		if (currentPlayer.allowedToAccuse.friend) {
			accuseAlignment.friend();
		}
	}, [currentPlayer.name, accuseAlignment]);

	const onFoeClick = useCallback(() => {
		if (currentPlayer.allowedToAccuse.foe) {
			accuseAlignment.foe();
		}
	}, [currentPlayer.name, accuseAlignment]);

	return (
		<>
			{isFriendRevealed ? (
				<AlignmentFriend small disabled player={selectedPlayer.name} team={selectedPlayer.alignment.friend}>
					{TEAM_NAMES[selectedPlayer.alignment.friend]}
				</AlignmentFriend>
			) : (
				<ActionButton active={currentPlayer.allowedToAccuse.friend} id="accuse-friend" onClick={onFriendClick}>
					Friend
				</ActionButton>
			)}

			{isFoeRevealed ? (
				<AlignmentFoe small disabled player={selectedPlayer.name} team={selectedPlayer.alignment.foe}>
					{TEAM_NAMES[selectedPlayer.alignment.foe]}
				</AlignmentFoe>
			) : (
				<ActionButton active={currentPlayer.allowedToAccuse.foe} id="accuse-foe" onClick={onFoeClick}>
					Foe
				</ActionButton>
			)}

			<ActionCancelButton small active onClick={accuseAlignment.back}>
				CANCEL
			</ActionCancelButton>
		</>
	);
}

function AccuseMenu(props) {
	const { onClose } = props;
	const [accusedPlayer, accusedAlignment, accuseActions] = useAccuseActions(onClose);

	const isPlayersShown = !accusedPlayer;
	const isAlignmentsShown = !!accusedPlayer && !accusedAlignment;
	const isTeamssShown = !!accusedPlayer && !!accusedAlignment;

	return (
		<RevealActions>
			{isPlayersShown && <PlayersMenu accusePlayer={accuseActions.player} />}

			{isAlignmentsShown && (
				<AlignmentMenu selectedPlayerName={accusedPlayer} accuseAlignment={accuseActions.alignment} />
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

export default AccuseMenu;
