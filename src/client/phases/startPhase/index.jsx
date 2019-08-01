import React, { useState, useMemo, useCallback, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import PlayersState from 'State/players/playersState';
import {
  StartPhaseStyled,
  Options,
  NumberPlayers,
  MainTitle,
  Title,
  NumberPlayersOptions,
  NumberPlayersOptionLabel,
  Players,
  Player,
  PlayerNameInput,
  Buttons,
} from './components';

function NumberPlayersOption({ n, numberPlayers, onChange }) {
  const onInputChange = useCallback(
    event => onChange(parseInt(event.target.value, 10)),
    [onChange],
  );

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
  const onInputChange = useCallback(
    event => onChange(event.target.name, event.target.value),
    [onChange],
  );

  return (
    <Player key={`player${n}`}>
      <Title>PLAYER {n}</Title>
      <PlayerNameInput
        type="text"
        id={`player-name${n}`}
        name={`player${n}`}
        onBlur={onInputChange}
      />
    </Player>
  );
}

function useReadyToStart(players) {
  const [readyToStart, setReadyToStart] = useState(false);
  const [playersState, playersDispatch] = useContext(PlayersState);

  const onStart = useCallback(() => {
    setReadyToStart(true);
    playersDispatch({
      type: 'create players',
      payload: Object.values(players),
    });
  }, [players]);

  return [readyToStart, onStart];
}

function arePlayersReady(numberOfPlayers, players) {
  return useMemo(
    () =>
      Object.values(players).filter(name => name).length === numberOfPlayers,
    [numberOfPlayers, players],
  );
}

function usePlayerOptions(initialPlayers) {
  const [numberOfPlayers, setNumberOfPlayers] = useState(
    Object.keys(initialPlayers).length,
  );
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
    (player, name) => setNames({ ...players, [player]: name }),
    [players],
  );

  return [
    { players, numberOfPlayers },
    { onNumberPlayersChange, onSelectPlayerOptions },
  ];
}

function StartPhase() {
  const [playerOptions, playerOptionsHandlers] = usePlayerOptions({
    player1: null,
    player2: null,
  });

  const { players, numberOfPlayers } = playerOptions;
  const {
    onNumberPlayersChange,
    onSelectPlayerOptions,
  } = playerOptionsHandlers;

  const [readyToStart, onStart] = useReadyToStart(players);

  return (
    <StartPhaseStyled>
      {readyToStart && <Redirect to="/play" />}
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
              <PlayerOptions
                key={i + 1}
                n={i + 1}
                onChange={onSelectPlayerOptions}
              />
            ))}
        </Players>
      </Options>

      <Buttons>
        <button
          className={
            'btn' +
            (arePlayersReady(numberOfPlayers, players) ? ' btn--active' : '')
          }
          onClick={onStart}
        >
          START
        </button>
      </Buttons>
    </StartPhaseStyled>
  );
}

export default StartPhase;
