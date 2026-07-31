import { useMemo, useContext, useCallback, useState, useEffect } from 'react';
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

	// Resets the menu when the turn changes. The idiomatic fix is a key on <AccuseMenu> so it
	// remounts instead, but the accuse flow has no spec covering it, so that refactor waits for
	// one rather than being done blind.
	/* eslint-disable react-hooks/set-state-in-effect */
	useEffect(() => {
		setAccusedPlayer(null);
		setAccusedAlignment(null);
	}, [playerTurn, setAccusedPlayer, setAccusedAlignment]);
	/* eslint-enable react-hooks/set-state-in-effect */

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
			// playerTurn was missing, so these closures could have captured a stale accuser. It
			// happened to be masked because the reset effect above changes accusedPlayer on every
			// turn change, which invalidated the memo anyway. `accuse` is an imported action
			// creator, not reactive, so it does not belong here.
			[dispatch, accusedPlayer, accusedAlignment, playerTurn],
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
	}, [currentPlayer.allowedToAccuse.friend, accuseAlignment]);

	const onFoeClick = useCallback(() => {
		if (currentPlayer.allowedToAccuse.foe) {
			accuseAlignment.foe();
		}
	}, [currentPlayer.allowedToAccuse.foe, accuseAlignment]);

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
