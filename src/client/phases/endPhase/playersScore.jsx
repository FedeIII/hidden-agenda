import { useContext } from 'react';
import { StateContext } from 'State';
import useSession from 'Hooks/useSession';
import py, { BASE_POINTS, REVEAL_COST } from 'Domain/py';
import teams from 'Domain/teams';
import useT from 'Client/i18n';
import {
	PointsTable,
	ScoreList,
	ScoreRow,
	Breakdown,
	BreakdownHead,
	PlayerName,
	RatingDelta,
	Base,
	AlignmentGroup,
	AlignmentPill,
	Amount,
	RevealCost,
	Total,
	Winner,
	PlayerWinner,
} from './components';

// Both numbers come from the rules rather than being written down again here. The breakdown on this
// sheet and the baseline the friend-and-foe screen shows during play are the same two figures, and a
// local copy of either is a place they can quietly stop agreeing.

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
	const t = useT();

	return (
		<AlignmentGroup alignment={alignment} data-alignment={alignment}>
			<AlignmentPill team={team}>{t(`team.${team}`)}</AlignmentPill>
			{/* data-term marks every signed contribution so a spec can add them up and check they
			    really do make the total — the breakdown claiming to explain the score is only
			    worth anything if it agrees with it. */}
			<Amount data-term={alignment === 'friend' ? points : -points}>{signed(alignment, points)}</Amount>
			{revealed && <RevealCost data-term={-REVEAL_COST}>− {REVEAL_COST}</RevealCost>}
		</AlignmentGroup>
	);
}

/**
 * What this game did to a player's rating.
 *
 * Nothing at all in hot-seat, where there are no ratings — the same reasoning as `SkinPicker` and
 * `LeaveGame`: a control or a figure for something that does not exist here would be worse than its
 * absence. Nothing either while the frame is still in flight, which is the ordinary case for the first
 * moment this screen is on.
 */
function Movement({ name }) {
	const { rated } = useSession();
	const mine = rated?.players?.find(player => player.name === name);

	if (!mine) {
		return null;
	}

	return (
		<RatingDelta data-delta={mine.delta} data-rating={mine.after}>
			{mine.delta >= 0 ? '+' : '−'}
			{Math.abs(mine.delta)} → {mine.after}
		</RatingDelta>
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
					<Movement name={player.name} />
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
	const t = useT();

	return (
		<PointsTable>
			<ScoreList>
				{py.sortByPoints(players, pieces).map(player => (
					<PlayerScore player={player} key={player.name} />
				))}
			</ScoreList>

			<Winner big>{t('end.winner')}</Winner>
			<PlayerWinner big>{py.getWinner(players, pieces).name}</PlayerWinner>
		</PointsTable>
	);
}

export default PlayersScore;
