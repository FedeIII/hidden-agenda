import { pz, POINTS_PER_PIECE_TYPE } from 'Domain/pieces';
import cells from 'Domain/cells';

const TEAM_NAMES = {
	0: 'BLACK TEAM',
	1: 'RED TEAM',
	2: 'WHITE TEAM',
	3: 'YELLOW TEAM',
};

function initControl() {
	return [
		{ player: null, enabled: true },
		{ player: null, enabled: true },
		{ player: null, enabled: true },
		{ player: null, enabled: true },
	];
}

function claimControl(playerName, team, { pieces, teamControl }) {
	const ceo = pz.getCeo(pieces, team);

	if (cells.inBoard(ceo.position)) {
		return teamControl;
	}

	if (teamControl[team].player) {
		return teamControl;
	}

	return teamControl.map(setControlFor(playerName, team, pieces));
}

function setControlFor(playerName, team, pieces) {
	return function mapTeamControl({ player, enabled }, teamIndex) {
		if (teamIndex == team) {
			return {
				player: playerName,
				enabled: false,
			};
		}

		if (player == playerName) {
			const ceo = pz.getCeo(pieces, team);

			return {
				player: null,
				enabled: !cells.inBoard(ceo.position),
			};
		}

		return { player, enabled };
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

export default { initControl, claimControl, getPointsForTeam };

export { TEAM_NAMES };
