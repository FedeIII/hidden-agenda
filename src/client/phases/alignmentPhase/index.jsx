import React, { useState, useCallback, useContext, useMemo } from 'react';
import { Redirect } from 'react-router-dom';
import { StateContext } from 'State';
import { setAlignment } from 'Client/actions';
import { Button, Buttons } from 'Client/components/button';
import { Title, Subtitle } from 'Client/components/title';
import { AlignmentPhaseContainer, Alignments } from './components';
import { AlignmentFriend, AlignmentFoe } from './alignments';

const FRIEND_CARDS = ['0', '0', '1', '1', '2', '2', '3', '3'];
const FOE_CARDS = ['0', '0', '1', '1', '2', '2', '3', '3'];

function getCard(remainingCards, setRemainingCards, excludedCard) {
  const randomIndex = Math.floor(Math.random() * remainingCards.length);
  const card = remainingCards.splice(randomIndex, 1)[0];

  if (excludedCard === card) {
    remainingCards.push(card);
    return getCard(remainingCards, setRemainingCards, excludedCard);
  }

  setRemainingCards(remainingCards);

  return card;
}

function useSelectedCards() {
  const [remainingFriends, setRemainingFriends] = useState(FRIEND_CARDS);
  const [remainingFoes, setRemainingFoes] = useState(FOE_CARDS);

  const getFriendCard = useCallback(
    () => getCard(remainingFriends, setRemainingFriends),
    [remainingFriends, setRemainingFriends],
  );

  const getFoeCard = useCallback(
    friendCard => getCard(remainingFoes, setRemainingFoes, friendCard),
    [remainingFoes, setRemainingFoes],
  );

  return [getFriendCard, getFoeCard];
}

function useAlignmentCards(start) {
  const [{ players }, dispatch] = useContext(StateContext);
  const [playerTurn, setPlayerTurn] = useState(players[0].name);
  const [getFriendCard, getFoeCard] = useSelectedCards();
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
      const currentIndex = players.findIndex(
        player => player.name === currentPlayerTurn,
      );

      if (currentIndex === players.length - 1) {
        return null;
      }

      return players[currentIndex + 1].name;
    });
  }, [players, playerTurn, start, resetReveals, setPlayerTurn]);

  const currentFriend = useMemo(() => {
    const currentPlayer = players.find(player => player.name === playerTurn);

    if (currentPlayer) {
      return currentPlayer.friend;
    }

    return null;
  }, [players, playerTurn]);

  const currentFoe = useMemo(() => {
    const currentPlayer = players.find(player => player.name === playerTurn);

    if (currentPlayer) {
      return currentPlayer.foe;
    }

    return null;
  }, [players, playerTurn]);

  const revealFriend = useCallback(() => {
    if (cardsRevealed.friend) {
      return;
    }

    dispatch(setAlignment({ name: playerTurn, friend: getFriendCard() }));
    setCardsRevealed(reveals => ({ friend: true, foe: reveals.foe }));
  }, [playerTurn, setCardsRevealed, cardsRevealed]);

  const revealFoe = useCallback(() => {
    if (cardsRevealed.foe) {
      return;
    }

    dispatch(setAlignment({ name: playerTurn, foe: getFoeCard(currentFriend) }));

    setCardsRevealed(reveals => ({ friend: reveals.friend, foe: true }));
  }, [playerTurn, setCardsRevealed, cardsRevealed]);

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

function useReadyToStart() {
  const [readyToStart, setReadyToStart] = useState(false);

  const start = useCallback(() => setReadyToStart(true));

  return [readyToStart, start];
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

const TEAM_MAPPING = {
  0: 'BLACK TEAM',
  1: 'RED TEAM',
  2: 'WHITE TEAM',
  3: 'YELLOW TEAM',
};

function AlignmentPhase() {
  const [readyToStart, start] = useReadyToStart();

  const {
    cardsRevealed,
    revealFriend,
    revealFoe,
    playerTurn,
    currentFriend,
    currentFoe,
    nextTurn,
  } = useAlignmentCards(start);

  const isButtonActive =
    Object.values(cardsRevealed).every(revealed => revealed) || !playerTurn;

  return (
    <AlignmentPhaseContainer>
      {readyToStart && <Redirect to="/play" />}
      {renderTitle(playerTurn)}

      {playerTurn && (
        <Alignments>
          <AlignmentFriend
            player={playerTurn}
            team={currentFriend}
            disabled={cardsRevealed.friend}
            onClick={revealFriend}
          >
            {TEAM_MAPPING[currentFriend]}
          </AlignmentFriend>
          <AlignmentFoe
            player={playerTurn}
            disabled={cardsRevealed.foe}
            team={currentFoe}
            onClick={revealFoe}
          >
            {TEAM_MAPPING[currentFoe]}
          </AlignmentFoe>
        </Alignments>
      )}

      <Buttons>
        <Button active={isButtonActive} onClick={nextTurn}>
          {playerTurn ? 'NEXT PLAYER' : 'START'}
        </Button>
      </Buttons>
    </AlignmentPhaseContainer>
  );
}

export default AlignmentPhase;
