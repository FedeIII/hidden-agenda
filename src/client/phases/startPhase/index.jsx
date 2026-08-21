import { useState, useMemo, useCallback, useContext } from 'react';
import { startGame } from 'Game/actions';
import { StateContext } from 'State';
import useSession from 'Hooks/useSession';
import useT from 'Client/i18n';
import LanguagePicker from 'Client/components/languagePicker';
import { Button, Buttons } from 'Client/components/button';
import {
	StartPhaseContainer,
	Options,
	NumberPlayers,
	MainTitle,
	Title,
	NumberPlayersOptions,
	NumberPlayersOptionLabel,
	Players,
	Player,
	PlayerNameInput,
} from './components';

function NumberPlayersOption({ n, numberPlayers, onChange }) {
	const onInputChange = useCallback(event => onChange(parseInt(event.target.value, 10)), [onChange]);

	return (
		<div key={`players${n}`}>
			<input
				type="radio"
				id={`players${n}`}
				name="number-players"
				value={n}
				defaultChecked={n === numberPlayers}
				onChange={onInputChange}
			/>
			<NumberPlayersOptionLabel htmlFor={n}>{n}</NumberPlayersOptionLabel>
		</div>
	);
}

function PlayerOptions({ n, onChange }) {
	const t = useT();
	const onInputChange = useCallback(event => onChange(event.target.name, event.target.value), [onChange]);

	return (
		<Player key={`player${n}`}>
			<Title>{t('start.player', { n })}</Title>
			{/* On change, not on blur. A name that has been typed is a name: waiting for focus to leave
			    meant the last player's name never counted, so GET ALIGNMENTS stayed dead while looking
			    ready — and clicking it started the game anyway, because the handler never checked. */}
			<PlayerNameInput type="text" id={`player-name${n}`} name={`player${n}`} onChange={onInputChange} />
		</Player>
	);
}

function useStartGame(players, onReady, ready) {
	const [_state, dispatch] = useContext(StateContext);

	return useCallback(() => {
		// Guarded, so the button being disabled is the rule rather than a suggestion. Without this a
		// game could start with a player called `undefined`.
		if (!ready) {
			return;
		}

		dispatch(startGame(Object.values(players)));
		onReady();
	}, [players, dispatch, onReady, ready]);
}

// Named as a hook because it is one — it calls useMemo.
function useArePlayersReady(numberOfPlayers, players) {
	return useMemo(
		() => Object.values(players).filter(name => name).length === numberOfPlayers,
		[numberOfPlayers, players],
	);
}

function usePlayerOptions(initialPlayers) {
	const [numberOfPlayers, setNumberOfPlayers] = useState(Object.keys(initialPlayers).length);
	const [players, setNames] = useState(initialPlayers);

	const onNumberPlayersChange = useCallback(
		newNumberOfPlayers => {
			setNumberOfPlayers(newNumberOfPlayers);
			setNames(
				Object.entries(players)
					.slice(0, newNumberOfPlayers)
					.reduce(
						(acc, [input, name]) => ({
							...acc,
							[input]: name,
						}),
						{},
					),
			);
		},
		[players],
	);

	const onSelectPlayerOptions = useCallback(
		(player, name) => setNames({ ...players, [player]: name.toUpperCase() }),
		[players],
	);

	return [
		{ players, numberOfPlayers },
		{ onNumberPlayersChange, onSelectPlayerOptions },
	];
}

function StartPhase({ onReady }) {
	const [playerOptions, playerOptionsHandlers] = usePlayerOptions({
		player1: undefined,
		player2: undefined,
	});

	const { players, numberOfPlayers } = playerOptions;
	const { onNumberPlayersChange, onSelectPlayerOptions } = playerOptionsHandlers;

	const playersReady = useArePlayersReady(numberOfPlayers, players);
	const onStart = useStartGame(players, onReady, playersReady);
	const session = useSession();
	const t = useT();

	return (
		<StartPhaseContainer>
			{/* The hot-seat form is the other front door — a player who arrived on `?hotseat` never
			    passes the lobby, so this is their only chance to say which language the evening is in. */}
			<LanguagePicker />

			<Options>
				<NumberPlayers>
					<MainTitle>{t('start.numberOfPlayers')}</MainTitle>
					<NumberPlayersOptions>
						{Array(5)
							.fill()
							.map((_, i) => (
								<NumberPlayersOption
									key={`${i + 2}`}
									n={i + 2}
									numberPlayers={numberOfPlayers}
									onChange={onNumberPlayersChange}
								/>
							))}
					</NumberPlayersOptions>
				</NumberPlayers>

				<MainTitle>{t('start.players')}</MainTitle>

				<Players>
					{Array(numberOfPlayers)
						.fill()
						.map((_, i) => (
							<PlayerOptions key={i + 1} n={i + 1} onChange={onSelectPlayerOptions} />
						))}
				</Players>
			</Options>

			<Buttons>
				<Button id="start-btn" active={playersReady} onClick={onStart}>
					{t('start.getAlignments')}
				</Button>
			</Buttons>

			{/* Everything above plays hot-seat in this tab. This is the way out to a real room. */}
			<Buttons>
				<Button id="play-online-btn" small active onClick={session.actions.goOnline}>
					{t('start.playOnlineInstead')}
				</Button>
			</Buttons>
		</StartPhaseContainer>
	);
}

export default StartPhase;
