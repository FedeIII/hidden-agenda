import { pz, POINTS_PER_PIECE_TYPE } from 'Domain/pieces';

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

// A team is claimable only while its CEO is still in its HQ, because claiming it is deploying that
// CEO. `pz.canClaimControl` is that rule, and the pieces half of the same action asks it too — they
// used to disagree, and the disagreement was a bug: the claim was refused here while the CEO was
// selected anyway, which handed somebody else's team to whoever clicked.
function claimControl(playerName, team, { pieces, teamControl, hasTurnEnded }) {
	if (hasTurnEnded || !pz.canClaimControl(team, pieces)) {
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
				// True by definition: claimControl above refused if this team's CEO was on the board.
				claimEnabled: true,
				controlling,
			};
		}

		if (player == playerName) {
			// A player holds one team at a time, so taking this one lets the last one go.
			return {
				player: null,
				prevPlayer: player,
				claimEnabled: pz.canClaimControl(teamIndex, pieces),
				controlling: false,
			};
		}

		return teamControl;
	};
}

function cancelControl(team, { pieces, teamControl }) {
	return teamControl.map(removeControlFor(team, pieces));
}

function removeControlFor(team, pieces) {
	return function mapTeamControl(teamControl, teamIndex) {
		const { prevPlayer, controlling } = teamControl;
		if (teamIndex == team) {
			return {
				player: prevPlayer,
				prevPlayer: null,
				claimEnabled: pz.canClaimControl(team, pieces),
				controlling,
			};
		}

		return teamControl;
	};
}

// A player who leaves takes no team with them. Whatever they held goes back to being unheld — and
// `claimEnabled` is derived from the one predicate that decides it rather than carried through, the
// way every other writer in this file does it, because a team whose CEO is already on the board is
// not claimable by anybody. So a team abandoned with its CEO deployed becomes nobody's and stays
// unclaimable, which is right: its pieces keep playing, moved by whoever is on turn, as ever.
function releasePlayer(playerName, { teamControl, pieces }) {
	return teamControl.map((control, teamIndex) => {
		const heldByThem = control.player === playerName;

		if (!heldByThem && control.prevPlayer !== playerName) {
			return control;
		}

		return {
			player: heldByThem ? null : control.player,
			// Cleared too, or CANCEL_CONTROL would hand the team back to somebody who is not at the
			// table any more.
			prevPlayer: control.prevPlayer === playerName ? null : control.prevPlayer,
			claimEnabled: pz.canClaimControl(teamIndex, pieces),
			controlling: heldByThem ? false : control.controlling,
		};
	});
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
		const { player } = teamControl;

		if (teamIndex == ceoTeam) {
			return {
				player,
				prevPlayer: null,
				// The CEO is landing on the board as this runs, so nobody can claim this team again —
				// whether or not the deployment was a claim. It used to carry `claimEnabled` through
				// unchanged, which left a controlled team offering a claim that the rules refuse.
				claimEnabled: false,
				controlling: !!player,
			};
		}

		return teamControl;
	};
}

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

// Revealing an alignment takes that team at once — no CEO to deploy, which is what a reveal buys.
// Note the team stays claimable if its CEO is still in its HQ: somebody else may take it back off you
// by deploying that CEO, and that is the trade a reveal makes.
function controlRevealedTeam(playerName, team, pieces) {
	return function setControlledTeam(teamControl, teamIndex) {
		const { player } = teamControl;

		if (teamIndex == team) {
			return {
				player: playerName,
				prevPlayer: null,
				claimEnabled: pz.canClaimControl(team, pieces),
				controlling: true,
			};
		}

		if (player == playerName) {
			// The team this player was holding before, let go — a player holds one at a time. Two
			// things were wrong here and both were invisible: it asked whether the REVEALED team's CEO
			// was in play rather than this one's, and it wrote `controlled` where every other branch
			// writes `controlling`, so a released team came away with no such field at all.
			return {
				player: null,
				prevPlayer: null,
				claimEnabled: pz.canClaimControl(teamIndex, pieces),
				controlling: false,
			};
		}

		return teamControl;
	};
}

export default {
	initControl,
	claimControl,
	cancelControl,
	releasePlayer,
	getPointsForTeam,
	movePieceForControl,
	revealFriend,
	revealFoe,
};
