import React, { useContext } from 'react';
import { StateContext } from 'State';
import py from 'Domain/py';
import teams from 'Domain/teams';
import { Table, Row, Cell } from './components';

function PlayerScore(props) {
	const { player } = props;
	const [{ pieces }] = useContext(StateContext);

	const friendPoints = teams.getPointsForTeam(player.friend, pieces);
	const foePoints = teams.getPointsForTeam(player.foe, pieces);

	return (
		<Row>
			<Cell big>{player.name}:</Cell>
			<Cell>
				{friendPoints} - {foePoints}
			</Cell>
			<Cell>=</Cell>
			<Cell big>{py.getPoints(player, pieces)} pts.</Cell>
		</Row>
	);
}

function PlayersScore() {
	const [{ players, pieces }] = useContext(StateContext);

	return (
		<Table>
			{players.map(player => (
				<PlayerScore player={player} key={player.name} />
			))}
			<Row />
			<Row />
			<Row>
				<Cell big>Winner: </Cell>
				<Cell big>{py.getWinner(players, pieces).name}</Cell>
			</Row>
		</Table>
	);
}

export default PlayersScore;
