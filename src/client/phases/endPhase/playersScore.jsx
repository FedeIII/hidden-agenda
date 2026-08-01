import { useContext } from 'react';
import { StateContext } from 'State';
import py from 'Domain/py';
import teams, { TEAM_NAMES } from 'Domain/teams';
import {
	PointsTable,
	ScoreList,
	ScoreRow,
	Breakdown,
	BreakdownHead,
	PlayerName,
	Base,
	AlignmentGroup,
	AlignmentPill,
	Amount,
	RevealCost,
	Total,
	Winner,
	PlayerWinner,
} from './components';

const BASE_POINTS = 100;
const REVEAL_COST = 50;

// A friend's team always adds and a foe's always subtracts, so the sign comes from which
// alignment it is rather than from the number. Otherwise a foe worth zero reads as "+ 0", which
// says the opposite of what it means.
function signed(alignment, points) {
	return `${alignment === 'friend' ? '+' : '−'} ${points}`;
}

// One alignment: which team it was, what that team's board score contributed, and — inside the
// same frame — what revealing it cost. Grouping the cost with its own alignment is the whole
// point: which of the two a −50 was paid for was otherwise guesswork.
function Alignment({ alignment, team, points, revealed }) {
	return (
		<AlignmentGroup alignment={alignment} data-alignment={alignment}>
			<AlignmentPill team={team}>{TEAM_NAMES[team]}</AlignmentPill>
			{/* data-term marks every signed contribution so a spec can add them up and check they
			    really do make the total — the breakdown claiming to explain the score is only
			    worth anything if it agrees with it. */}
			<Amount data-term={alignment === 'friend' ? points : -points}>{signed(alignment, points)}</Amount>
			{revealed && <RevealCost data-term={-REVEAL_COST}>− {REVEAL_COST}</RevealCost>}
		</AlignmentGroup>
	);
}

function PlayerScore({ player }) {
	const [{ pieces }] = useContext(StateContext);

	// Read from the same helpers that compute the score, so the breakdown cannot drift from the
	// total sitting next to it.
	const friendPoints = teams.getPointsForTeam(player.alignment.friend, pieces);
	const foePoints = teams.getPointsForTeam(player.alignment.foe, pieces);

	return (
		<ScoreRow data-player={player.name}>
			<Breakdown>
				<BreakdownHead>
					<PlayerName>{player.name}</PlayerName>
					<Base data-term={BASE_POINTS}>{BASE_POINTS}</Base>
				</BreakdownHead>

				<Alignment
					alignment="friend"
					team={player.alignment.friend}
					points={friendPoints}
					revealed={player.revealed.friend}
				/>
				<Alignment alignment="foe" team={player.alignment.foe} points={foePoints} revealed={player.revealed.foe} />
			</Breakdown>

			<Total data-total={py.getPoints(player, pieces)}>{py.getPoints(player, pieces)}</Total>
		</ScoreRow>
	);
}

function PlayersScore() {
	const [{ players, pieces }] = useContext(StateContext);

	return (
		<PointsTable>
			<ScoreList>
				{py.sortByPoints(players, pieces).map(player => (
					<PlayerScore player={player} key={player.name} />
				))}
			</ScoreList>

			<Winner big>Winner: </Winner>
			<PlayerWinner big>{py.getWinner(players, pieces).name}</PlayerWinner>
		</PointsTable>
	);
}

export default PlayersScore;
