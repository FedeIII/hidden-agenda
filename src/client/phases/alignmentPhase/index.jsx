import React, { useState, useCallback, useContext, useMemo } from 'react';
import { StateContext } from 'State';
import { setAlignment } from 'Client/actions';
import { Button, Buttons } from 'Client/components/button';
import { Title, Subtitle } from 'Client/components/title';
import { Alignments, AlignmentFriend, AlignmentFoe } from 'Client/components/alignments';
import { TEAM_NAMES } from 'Domain/teams';
import { dealAlignments } from 'Domain/deal';
import { AlignmentPhaseContainer } from './components';

// Dealt once for the whole table instead of a card at a time off a shared deck. Phase 1 of
// MULTIPLAYER-PLAN.md moves this to the server, which sends each player only their own pair.
function useDealtAlignments(players) {
	const [dealt] = useState(() =>
		dealAlignments(players.map(player => player.name)).reduce(
			(byName, alignment) => ({ ...byName, [alignment.name]: alignment }),
			{},
		),
	);

	return dealt;
}

function useAlignmentCards(start) {
	const [{ players }, dispatch] = useContext(StateContext);
	const [playerTurn, setPlayerTurn] = useState(players[0].name);
	const dealt = useDealtAlignments(players);
	const [cardsRevealed, setCardsRevealed] = useState({
		friend: false,
		foe: false,
	});

	const resetReveals = useCallback(
		() =>
			setCardsRevealed({
				friend: false,
				foe: false,
			}),
		[setCardsRevealed],
	);

	const nextTurn = useCallback(() => {
		if (!playerTurn) {
			start();
		}

		resetReveals();
		setPlayerTurn(currentPlayerTurn => {
			const currentIndex = players.findIndex(player => player.name === currentPlayerTurn);

			if (currentIndex === players.length - 1) {
				return null;
			}

			return players[currentIndex + 1].name;
		});
	}, [players, playerTurn, start, resetReveals, setPlayerTurn]);

	const currentFriend = useMemo(() => {
		const currentPlayer = players.find(player => player.name === playerTurn);

		if (currentPlayer) {
			return currentPlayer.alignment.friend;
		}

		return null;
	}, [players, playerTurn]);

	const currentFoe = useMemo(() => {
		const currentPlayer = players.find(player => player.name === playerTurn);

		if (currentPlayer) {
			return currentPlayer.alignment.foe;
		}

		return null;
	}, [players, playerTurn]);

	const revealFriend = useCallback(() => {
		if (cardsRevealed.friend) {
			return;
		}

		dispatch(setAlignment({ name: playerTurn, friend: dealt[playerTurn].friend }));
		setCardsRevealed(reveals => ({ friend: true, foe: reveals.foe }));
	}, [playerTurn, setCardsRevealed, cardsRevealed, dealt]);

	const revealFoe = useCallback(() => {
		if (cardsRevealed.foe) {
			return;
		}

		dispatch(setAlignment({ name: playerTurn, foe: dealt[playerTurn].foe }));

		setCardsRevealed(reveals => ({ friend: reveals.friend, foe: true }));
	}, [playerTurn, setCardsRevealed, cardsRevealed, dealt]);

	return {
		cardsRevealed,
		revealFriend,
		revealFoe,
		playerTurn,
		currentFriend,
		currentFoe,
		nextTurn,
	};
}

function renderTitle(playerTurn) {
	if (playerTurn) {
		return (
			<>
				<Title>This is only for {playerTurn}'s eyes</Title>
				<Subtitle>Expose your alignments</Subtitle>
			</>
		);
	}

	return <Title>You are all ready to start!</Title>;
}

function AlignmentPhase({ onReady }) {
	const { cardsRevealed, revealFriend, revealFoe, playerTurn, currentFriend, currentFoe, nextTurn } =
		useAlignmentCards(onReady);

	const isButtonActive = Object.values(cardsRevealed).every(revealed => revealed) || !playerTurn;

	return (
		<AlignmentPhaseContainer>
			{renderTitle(playerTurn)}

			{playerTurn && (
				<Alignments>
					<AlignmentFriend
						id="alingnment-card-friend"
						player={playerTurn}
						team={currentFriend}
						disabled={cardsRevealed.friend}
						onClick={revealFriend}
					>
						{TEAM_NAMES[currentFriend]}
					</AlignmentFriend>
					<AlignmentFoe
						id="alingnment-card-foe"
						player={playerTurn}
						disabled={cardsRevealed.foe}
						team={currentFoe}
						onClick={revealFoe}
					>
						{TEAM_NAMES[currentFoe]}
					</AlignmentFoe>
				</Alignments>
			)}

			<Buttons>
				<Button id="alignments-btn" active={isButtonActive} onClick={nextTurn}>
					{playerTurn ? 'NEXT PLAYER' : 'START'}
				</Button>
			</Buttons>
		</AlignmentPhaseContainer>
	);
}

export default AlignmentPhase;
