import { pz, POINTS_PER_PIECE_TYPE } from 'Domain/pieces';
import cells from 'Domain/cells';

export const TEAM_COLORS = {
	0: 'black',
	1: 'red',
	2: 'white',
	3: 'yellow',
};

export const TEAM_NAMES = {
	0: TEAM_COLORS[0].toUpperCase(),
	1: TEAM_COLORS[1].toUpperCase(),
	2: TEAM_COLORS[2].toUpperCase(),
	3: TEAM_COLORS[3].toUpperCase(),
};

function initControl() {
	return [
		{ player: null, prevPlayer: null, claimEnabled: true, controlling: false },
		{ player: null, prevPlayer: null, claimEnabled: true, controlling: false },
		{ player: null, prevPlayer: null, claimEnabled: true, controlling: false },
		{ player: null, prevPlayer: null, claimEnabled: true, controlling: false },
	];
}

function claimControl(playerName, team, { pieces, teamControl }) {
	const ceo = pz.getCeo(pieces, team);

	if (cells.inBoard(ceo.position)) {
		return teamControl;
	}

	return teamControl.map(setControlFor(playerName, team, pieces));
}

function setControlFor(playerName, team, pieces) {
	return function mapTeamControl(teamControl, teamIndex) {
		const { player, controlling } = teamControl;

		if (teamIndex == team) {
			return {
				player: playerName,
				prevPlayer: player,
				claimEnabled: true,
				controlling,
			};
		}

		if (player == playerName) {
			const ceo = pz.getCeo(pieces, teamIndex);

			return {
				player: null,
				prevPlayer: player,
				claimEnabled: !cells.inBoard(ceo.position),
				controlling: false,
			};
		}

		return teamControl;
	};
}

function cancelControl(team, { teamControl }) {
	return teamControl.map(removeControlFor(team));
}

function removeControlFor(team) {
	return function mapTeamControl(teamControl, teamIndex) {
		const { prevPlayer, controlling } = teamControl;
		if (teamIndex == team) {
			return {
				player: prevPlayer,
				prevPlayer: null,
				claimEnabled: true,
				controlling,
			};
		}

		return teamControl;
	};
}

function getPointsFromKills(team, pieces) {
	return Object.entries(pz.getKilledPiecesByTeam(team, pieces)).reduce(
		(score, [pieceType, pieceCount]) => score + POINTS_PER_PIECE_TYPE[pieceType] * pieceCount,
		0,
	);
}

function getPointsFromSurvivors(team, pieces) {
	return pieces
		.filter(piece => pz.getTeam(piece.id) === team && piece.position && !piece.killed)
		.reduce((score, piece) => score + POINTS_PER_PIECE_TYPE[pz.getType(piece.id)], 0);
}

function getPointsForTeam(team, pieces) {
	return getPointsFromKills(team, pieces) + getPointsFromSurvivors(team, pieces);
}

function movePieceForControl(pieceId, { teamControl, pieces }) {
	if (isCeoPlacement(pieceId, pieces)) {
		return teamControl.map(mapDeployedCeo(pieceId));
	}

	return teamControl;
}

function isCeoPlacement(pieceId, pieces) {
	return pz.isCeo(pieceId) && !pz.getPieceById(pieceId, pieces).position;
}

function mapDeployedCeo(ceoId) {
	const ceoTeam = pz.getTeam(ceoId);

	return function setTeamControl(teamControl, teamIndex) {
		const { player, claimEnabled } = teamControl;

		if (teamIndex == ceoTeam) {
			return {
				player,
				prevPlayer: null,
				claimEnabled,
				controlling: !!player,
			};
		}

		return teamControl;
	};
}

// function togglePieceForControl(pieceId, { teamControl, pieces }) {
// 	if (isCeoDeselectionInStore(pieceId, pieces)) {
// 		return teamControl.map(mapDeselectedCeo(pieceId));
// 	}

// 	return teamControl;
// }

// function isCeoDeselectionInStore(pieceId, pieces) {
// 	const ceo = pz.getPieceById(pieceId, pieces);
// 	return pz.isCeo(pieceId) && !ceo.selected && !ceo.position;
// }

// function mapDeselectedCeo(ceoId) {
// 	const ceoTeam = pz.getTeam(ceoId);

// 	return function unsetTeamControl(teamControl, teamIndex) {
// 		const { prevPlayer } = teamControl;

// 		if (teamIndex == ceoTeam) {
// 			return {
// 				player: null,
// 				prevPlayer,
// 				claimEnabled: true,
// 				controlling: false,
// 			};
// 		}

// 		return teamControl;
// 	};
// }

function revealFriend(players, { teamControl, pieces }) {
	const player = players.find(p => p.turn);

	return teamControl.map(controlRevealedTeam(player.name, player.alignment.friend, pieces));
}

function revealFoe(players, { teamControl, pieces }) {
	const player = players.find(p => p.turn);

	return teamControl.map(controlRevealedTeam(player.name, player.alignment.foe, pieces));
}

function controlRevealedTeam(playerName, team, pieces) {
	return function setControlledTeam(teamControl, teamIndex) {
		const { player } = teamControl;
		const ceo = pz.getCeo(pieces, team);

		if (teamIndex == team) {
			return {
				player: playerName,
				prevPlayer: null,
				claimEnabled: !cells.inBoard(ceo.position),
				controlling: true,
			};
		}

		if (player == playerName) {
			return {
				player: null,
				prevPlayer: null,
				claimEnabled: !cells.inBoard(ceo.position),
				controlled: false,
			};
		}

		return teamControl;
	};
}

export default {
	initControl,
	claimControl,
	cancelControl,
	getPointsForTeam,
	movePieceForControl,
	// togglePieceForControl,
	revealFriend,
	revealFoe,
};
