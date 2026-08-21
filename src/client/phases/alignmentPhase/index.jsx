import { useState, useCallback, useContext, useMemo } from 'react';
import { StateContext } from 'State';
import { setAlignment } from 'Game/actions';
import { Button, Buttons } from 'Client/components/button';
import { Title, Subtitle } from 'Client/components/title';
import { Alignments, AlignmentFriend, AlignmentFoe } from 'Client/components/alignments';
import useSession from 'Hooks/useSession';
import useT from 'Client/i18n';
import { dealAlignments } from 'Domain/deal';
import SkinPicker from 'Client/components/skinPicker';
import LanguagePicker from 'Client/components/languagePicker';
import LeaveGame from 'Client/components/leaveGame';
import { AlignmentPhaseContainer } from './components';

// Dealt once for the whole table instead of a card at a time off a shared deck. Hot-seat only: online
// the server deals, and sends each player nothing but their own pair.
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
	}, [playerTurn, setCardsRevealed, cardsRevealed, dealt, dispatch]);

	const revealFoe = useCallback(() => {
		if (cardsRevealed.foe) {
			return;
		}

		dispatch(setAlignment({ name: playerTurn, foe: dealt[playerTurn].foe }));

		setCardsRevealed(reveals => ({ friend: reveals.friend, foe: true }));
	}, [playerTurn, setCardsRevealed, cardsRevealed, dealt, dispatch]);

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

function renderTitle(t, playerTurn) {
	if (playerTurn) {
		return (
			<>
				<Title>{t('alignmentPhase.onlyForEyes', { name: playerTurn })}</Title>
				<Subtitle>{t('alignmentPhase.expose')}</Subtitle>
			</>
		);
	}

	return <Title>{t('alignmentPhase.allReady')}</Title>;
}

// Online there is no ceremony to perform: the server dealt the cards and each client only ever
// received its own, so a player simply looks at their screen and says they are ready.
function OnlineAlignment({ onReady }) {
	const [{ players }] = useContext(StateContext);
	const session = useSession();
	const t = useT();
	const [ready, setReady] = useState(false);

	const me = players.find(player => player.name === session.name);

	const confirm = useCallback(() => {
		setReady(true);
		onReady();
	}, [onReady]);

	if (!me) {
		return (
			<AlignmentPhaseContainer>
				<Title>{t('alignmentPhase.waitingForTable')}</Title>
			</AlignmentPhaseContainer>
		);
	}

	const readyCount = session.seats.filter(seat => seat.ready).length;

	return (
		<AlignmentPhaseContainer>
			<Title>{t('alignmentPhase.theseAreYours', { name: me.name })}</Title>
			<Subtitle>{t('alignmentPhase.nobodyElseSees')}</Subtitle>

			<Alignments>
				<AlignmentFriend id="alingnment-card-friend" disabled player={me.name} team={me.alignment.friend}>
					{t(`team.${me.alignment.friend}`)}
				</AlignmentFriend>
				<AlignmentFoe id="alingnment-card-foe" disabled player={me.name} team={me.alignment.foe}>
					{t(`team.${me.alignment.foe}`)}
				</AlignmentFoe>
			</Alignments>

			<Buttons>
				<Button id="alignments-btn" active={!ready} onClick={confirm}>
					{t(ready ? 'alignmentPhase.waiting' : 'alignmentPhase.ready')}
				</Button>

				{/* Straight out, with nothing to confirm — unlike leaving from the board, where LEAVE sits
				    among the controls a player is pressing all game and a misclick would end theirs. This is
				    a waiting screen: nothing has happened yet, and if the table is waiting on somebody who
				    has closed their laptop, this button is the way out rather than a hazard on the way past. */}
				<LeaveGame />
			</Buttons>

			<Subtitle id="alignment-ready-count">
				{t('alignmentPhase.readyCount', { ready: readyCount, total: session.seats.length })}
			</Subtitle>

			<SkinPicker />
			<LanguagePicker />
		</AlignmentPhaseContainer>
	);
}

function HotSeatAlignment({ onReady }) {
	const t = useT();
	const { cardsRevealed, revealFriend, revealFoe, playerTurn, currentFriend, currentFoe, nextTurn } =
		useAlignmentCards(onReady);

	const isButtonActive = Object.values(cardsRevealed).every(revealed => revealed) || !playerTurn;

	return (
		<AlignmentPhaseContainer>
			{renderTitle(t, playerTurn)}

			{playerTurn && (
				<Alignments>
					<AlignmentFriend
						id="alingnment-card-friend"
						player={playerTurn}
						team={currentFriend}
						disabled={cardsRevealed.friend}
						onClick={revealFriend}
					>
						{t(`team.${currentFriend}`)}
					</AlignmentFriend>
					<AlignmentFoe
						id="alingnment-card-foe"
						player={playerTurn}
						disabled={cardsRevealed.foe}
						team={currentFoe}
						onClick={revealFoe}
					>
						{t(`team.${currentFoe}`)}
					</AlignmentFoe>
				</Alignments>
			)}

			<Buttons>
				<Button id="alignments-btn" active={isButtonActive} onClick={nextTurn}>
					{t(playerTurn ? 'alignmentPhase.nextPlayer' : 'alignmentPhase.start')}
				</Button>
			</Buttons>

			{/* The last moment the table can agree on how the evening should look. After this the
			    board is up and the furniture stops moving. The language goes with it: a preference,
			    not a rule of the table, but this is the last screen before the board and nothing may
			    sit over the board. */}
			<SkinPicker />
			<LanguagePicker />
		</AlignmentPhaseContainer>
	);
}

function AlignmentPhase({ online, onReady }) {
	return online ? <OnlineAlignment onReady={onReady} /> : <HotSeatAlignment onReady={onReady} />;
}

export default AlignmentPhase;
