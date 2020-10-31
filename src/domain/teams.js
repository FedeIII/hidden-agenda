import { pz, POINTS_PER_PIECE_TYPE } from 'Domain/pieces';

const TEAM_NAMES = {
	0: 'BLACK TEAM',
	1: 'RED TEAM',
	2: 'WHITE TEAM',
	3: 'YELLOW TEAM',
};

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

export default { getPointsForTeam };

export { TEAM_NAMES };
