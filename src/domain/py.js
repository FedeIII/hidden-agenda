import teams from 'Domain/teams';
import py from 'Domain/py';

const NO_PLAYER = { name: null, score: 0 };

function init(playerNames) {
	return playerNames.map((name, i) => ({
		name,
		turn: i === 0,
		alignment: {
			friend: undefined,
			foe: undefined,
		},
		revealed: {
			friend: false,
			foe: false,
		},
		allowedToAccuse: {
			friend: true,
			foe: true,
		},
	}));
}

function nextTurn(players) {
	const currentIndex = players.findIndex(player => player.turn);
	const nextIndex = currentIndex + 1 >= players.length ? 0 : currentIndex + 1;
	return players.map((player, i) => ({
		...player,
		turn: i === nextIndex,
	}));
}

function setAlignment(players, playerName, friend, foe) {
	return players.map(player => {
		if (player.name === playerName) {
			return {
				...player,
				alignment: {
					friend: typeof friend === 'undefined' ? player.alignment.friend : friend,
					foe: typeof foe === 'undefined' ? player.alignment.foe : foe,
				},
			};
		}

		return player;
	});
}

function getTurn(players) {
	return players.find(player => player.turn).name;
}

function isRevealActive(players) {
	const player = players.find(player => player.turn);
	return !player.revealed.friend || !player.revealed.foe;
}

function isOwnFriendRevealed(players) {
	const player = players.find(player => player.turn);

	return player.revealed.friend;
}

function isOwnFoeRevealed(players) {
	const player = players.find(player => player.turn);

	return player.revealed.foe;
}

function revealFriend(players) {
	const playerName = getTurn(players);

	return players.map(player => {
		if (player.name == playerName) {
			return {
				...player,
				revealed: {
					friend: true,
					foe: player.revealed.foe,
				},
			};
		}

		return player;
	});
}

function revealFoe(players) {
	const playerName = getTurn(players);

	return players.map(player => {
		if (player.name == playerName) {
			return {
				...player,
				revealed: {
					foe: true,
					friend: player.revealed.friend,
				},
			};
		}

		return player;
	});
}

function isPlayerTurn(players, player) {
	return py.getTurn(players) == player.name;
}

function accuse({ accuser, accusee, alignment, team }, players) {
	const accuserPlayer = players.find(player => player.name == accuser);
	const accuseePlayer = players.find(player => player.name == accusee);

	const isAccuserAllowed = accuserPlayer.allowedToAccuse[alignment];
	if (!isAccuserAllowed) {
		return players;
	}

	const isAccuserCorrect = accuseePlayer.alignment[alignment] == team;
	const isAccuseeAlreadyRevealed = isAccuserCorrect && accuseePlayer.revealed[alignment];

	if (isAccuseeAlreadyRevealed) {
		return players;
	}

	return players.map(player => {
		if (player.name == accuser) {
			return {
				...player,
				allowedToAccuse: {
					...player.allowedToAccuse,
					[alignment]: accuseePlayer.alignment[alignment] == team,
				},
			};
		}

		if (player.name == accusee) {
			return {
				...player,
				revealed: {
					...player.revealed,
					[alignment]: isAccuserCorrect,
				},
			};
		}
	});
}

function getPoints(player, pieces) {
	const { friend, foe } = player.alignment;
	const friendPoints = teams.getPointsForTeam(friend, pieces);
	const foePoints = teams.getPointsForTeam(foe, pieces);

	return friendPoints - foePoints;
}

function getWinner(players, pieces) {
	return players.reduce((winner, player) => {
		const score = py.getPoints(player, pieces);
		if (winner.score > score) {
			return winner;
		} else {
			return {
				...player,
				score,
			};
		}
	}, NO_PLAYER);
}

export default {
	init,
	nextTurn,
	setAlignment,
	getTurn,
	isRevealActive,
	isOwnFriendRevealed,
	isOwnFoeRevealed,
	revealFriend,
	revealFoe,
	isPlayerTurn,
	accuse,
	getPoints,
	getWinner,
};
