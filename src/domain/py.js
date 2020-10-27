import teams from 'Domain/teams';
import py from 'Domain/py';

const NO_PLAYER = { name: 'NO PLAYER', score: 0 };

function getPoints(player, pieces) {
	const friendPoints = teams.getPointsForTeam(player.friend, pieces);
	const foePoints = teams.getPointsForTeam(player.foe, pieces);

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
	getPoints,
	getWinner,
};
