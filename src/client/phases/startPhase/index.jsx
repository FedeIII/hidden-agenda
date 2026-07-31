import { useState, useMemo, useCallback, useContext } from 'react';
import { startGame } from 'Game/actions';
import { StateContext } from 'State';
import useSession from 'Hooks/useSession';
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
	const onInputChange = useCallback(event => onChange(event.target.name, event.target.value), [onChange]);

	return (
		<Player key={`player${n}`}>
			<Title>PLAYER {n}</Title>
			<PlayerNameInput type="text" id={`player-name${n}`} name={`player${n}`} onBlur={onInputChange} />
		</Player>
	);
}

function useStartGame(players, onReady) {
	const [_state, dispatch] = useContext(StateContext);

	return useCallback(() => {
		dispatch(startGame(Object.values(players)));
		onReady();
	}, [players, dispatch, onReady]);
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

	const onStart = useStartGame(players, onReady);
	const playersReady = useArePlayersReady(numberOfPlayers, players);
	const session = useSession();

	return (
		<StartPhaseContainer>
			<Options>
				<NumberPlayers>
					<MainTitle>1. NUMBER OF PLAYERS</MainTitle>
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

				<MainTitle>2. PLAYERS</MainTitle>

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
					GET ALIGNMENTS
				</Button>
			</Buttons>

			{/* Everything above plays hot-seat in this tab. This is the way out to a real room. */}
			<Buttons>
				<Button id="play-online-btn" small active onClick={session.actions.goOnline}>
					PLAY ONLINE INSTEAD
				</Button>
			</Buttons>
		</StartPhaseContainer>
	);
}

export default StartPhase;
