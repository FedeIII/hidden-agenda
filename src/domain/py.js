import teams from 'Domain/teams';
import py from 'Domain/py';

const NO_PLAYER = { name: null, score: 0 };

// Table size. Lives here rather than in the server or the lobby because it is a rule of the
// game, and both of those need to agree with it.
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 6;

// What it costs to have an alignment become public, however it happens: paid by its owner when they
// reveal it, and paid by them again when somebody accuses correctly. Named because the interface has
// to be able to tell a player what a button is about to cost them.
export const REVEAL_COST = 50;

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
		// Who forced it into the open, if anybody. An alignment becomes public two ways — its owner
		// pays fifty points to reveal it, or somebody accuses correctly — and until now the state
		// recorded only that it happened, not which. They are very different facts at a table: one is
		// a move you made and the other is a move made against you.
		exposed: {
			friend: null,
			foe: null,
		},
		// The accusation this player last made, and how it went. Public, because at a table an
		// accusation is something everybody hears — and it is the only way the accuser finds out what
		// happened, since a wrong guess changes nothing visible about the accusee.
		lastAccusation: null,
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

/**
 * Somebody has left the table mid-game.
 *
 * Nothing on the board is orphaned by this, and that is a property of the game rather than luck:
 * pieces belong to *teams*, every player moves every team's pieces, and a team is only ever claimed.
 * What leaves with a player is a place in the turn order and a pair of cards nobody will score.
 *
 * The turn is the one thing that cannot simply be filtered out. Exactly one player holds it at all
 * times and `getTurn` reads that with no guard, so if it was theirs it moves on to whoever it would
 * have gone to next. The server passes the turn properly first — a turn change is more than a flag,
 * it snapshots the board for the sniper rollback and recomputes the CEO buffs — but the invariant is
 * kept here as well, because this is the function that could break it.
 */
function removePlayer(players, name) {
	const index = players.findIndex(player => player.name === name);

	if (index === -1) {
		return players;
	}

	const remaining = players.filter(player => player.name !== name);

	if (!remaining.length || !players[index].turn) {
		return remaining;
	}

	// Only reachable while somebody is left, so this never lands back on the player being removed.
	const next = players[(index + 1) % players.length].name;

	return remaining.map(player => ({ ...player, turn: player.name === next }));
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
				// A wrong guess costs the right to guess that alignment again, ever. That is the whole
				// risk of accusing and it used to be invisible: the menu simply closed.
				allowedToAccuse: {
					...player.allowedToAccuse,
					[alignment]: isAccuserCorrect,
				},
				lastAccusation: { accusee, alignment, team, correct: isAccuserCorrect },
			};
		}

		if (player.name == accusee) {
			// Defaulted rather than assumed. A room persisted to disk before `exposed` existed comes back
			// without it, and so does any hand-built fixture — neither should throw on the first
			// accusation after a deploy.
			const exposed = player.exposed || { friend: null, foe: null };

			return {
				...player,
				revealed: {
					...player.revealed,
					[alignment]: isAccuserCorrect,
				},
				exposed: {
					...exposed,
					[alignment]: isAccuserCorrect ? accuser : exposed[alignment],
				},
			};
		}

		// Without this every uninvolved player became undefined. Invisible at 2 players,
		// where accuser and accusee are the whole table, and fatal from 3 upwards.
		return player;
	});
}

function getPoints(player, pieces) {
	const { friend, foe } = player.alignment;
	const { friend: isFriendRevealed, foe: isFoeRevealed } = player.revealed;
	const friendPoints = teams.getPointsForTeam(friend, pieces);
	const foePoints = teams.getPointsForTeam(foe, pieces);

	return 100 - REVEAL_COST * isFriendRevealed - REVEAL_COST * isFoeRevealed + friendPoints - foePoints;
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

function sortByPoints(players, pieces) {
	return players.slice().sort((player1, player2) => getPoints(player2, pieces) - getPoints(player1, pieces));
}

export default {
	init,
	nextTurn,
	removePlayer,
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
	sortByPoints,
};
