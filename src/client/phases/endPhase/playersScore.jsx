import React, { useContext } from 'react';
import { StateContext } from 'State';
import py from 'Domain/py';
import teams from 'Domain/teams';
import { PointsTable, Row, Cell, Winner, PlayerWinner } from './components';

function PlayerScore(props) {
	const { player } = props;
	const [{ pieces }] = useContext(StateContext);

	const friendPoints = teams.getPointsForTeam(player.alignment.friend, pieces);
	const foePoints = teams.getPointsForTeam(player.alignment.foe, pieces);
	const revealPoints = (() => {
		if (player.revealed.friend && player.revealed.foe) {
			return '- 100';
		}

		if (player.revealed.friend || player.revealed.foe) {
			return '- 50';
		}

		return '';
	})();

	return (
		<Row>
			<Cell big>{player.name}:</Cell>
			<Cell>100</Cell>
			<Cell>{revealPoints}</Cell>
			<Cell team={player.alignment.friend}>
				{friendPoints >= 0 && '+ '}
				{friendPoints}
			</Cell>
			<Cell team={player.alignment.foe}>- {foePoints}</Cell>
			<Cell>=</Cell>
			<Cell>{py.getPoints(player, pieces)} pts.</Cell>
		</Row>
	);
}

function PlayersScore() {
	const [{ players, pieces }] = useContext(StateContext);

	return (
		<PointsTable>
			<table>
				<tbody>
					{py.sortByPoints(players, pieces).map(player => (
						<PlayerScore player={player} key={player.name} />
					))}
				</tbody>
			</table>
			<Winner big>Winner: </Winner>
			<PlayerWinner big>{py.getWinner(players, pieces).name}</PlayerWinner>
		</PointsTable>
	);
}

export default PlayersScore;
