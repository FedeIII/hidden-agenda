import { pz, POINTS_PER_PIECE_TYPE } from 'Domain/pieces';
import cells from 'Domain/cells';

export const TEAM_NAMES = {
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
				enabled: true,
			};
		}

		if (player == playerName) {
			const ceo = pz.getCeo(pieces, teamIndex);

			return {
				player: null,
				enabled: !cells.inBoard(ceo.position),
			};
		}

		return { player, enabled };
	};
}

function cancelControl(team, { pieces, teamControl }) {
	return teamControl.map(removeControlFor(team, pieces));
}

function removeControlFor(team, pieces) {
	return function mapTeamControl({ player, enabled }, teamIndex) {
		if (teamIndex == team) {
			return {
				player: null,
				enabled: true,
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

	return function setTeamControl({ player, enabled }, teamIndex) {
		if (teamIndex == ceoTeam) {
			return {
				player,
				enabled: false,
			};
		}

		return { player, enabled };
	};
}

function togglePieceForControl(pieceId, { teamControl, pieces }) {
	if (isCeoDeselectionInStore(pieceId, pieces)) {
		return teamControl.map(mapDeselectedCeo(pieceId));
	}

	return teamControl;
}

function isCeoDeselectionInStore(pieceId, pieces) {
	const ceo = pz.getPieceById(pieceId, pieces);
	return pz.isCeo(pieceId) && !ceo.selected && !ceo.position;
}

function mapDeselectedCeo(ceoId) {
	const ceoTeam = pz.getTeam(ceoId);

	return function unsetTeamControl({ player, enabled }, teamIndex) {
		if (teamIndex == ceoTeam) {
			return {
				player: null,
				enabled: true,
			};
		}

		return { player, enabled };
	};
}

export default {
	initControl,
	claimControl,
	cancelControl,
	getPointsForTeam,
	movePieceForControl,
	togglePieceForControl,
};
