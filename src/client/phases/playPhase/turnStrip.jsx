import { useContext } from 'react';
import { StateContext } from 'State';
import py from 'Domain/py';
import { pz, NUMBER_OF_PLAYERS_KILLED_FOR_GAME_END } from 'Domain/pieces';
import { Button } from 'Client/components/button';
import { useCanAct } from 'Hooks/useSession';
import { nextTurn } from 'Game/actions';
import { Title } from 'Client/components/title';
import { Cell, CellKey, CellValue, Initials, InitialBox } from './components';

// The strip above the board, as the cells it always wanted to be.
//
// It used to be one sentence — "Player's turn: FEDE" — and a button. The three directions each read
// this same markup as something their own world already has: Dossier types it on a routing slip with
// a box per seat that has had the turn, Blueprint sets it in the ruled cells a drawing keeps its
// facts in, Vault mounts it on the rail across the top of the case. One structure, three readings,
// because moving it would move #next-turn and most of the suite clicks that.
//
// It also finally says how close the game is to over. The game ends when three CEOs are dead and
// nothing on screen has ever mentioned it, which is a strange thing to keep to yourself.
function TurnStrip() {
	const [{ players, pieces, hasTurnEnded }, dispatch] = useContext(StateContext);
	const canAct = useCanAct();

	const turn = py.getTurn(players);
	const ceosDown = pz.getKilledCeoCount(pieces);

	// Which seats have already held the turn this round. In Dossier they are the initials boxes on the
	// slip; the other two directions have no use for them and the token hides them.
	const upTo = players.findIndex(player => player.turn);

	return (
		<Title>
			<Cell>
				<CellKey>on the desk of</CellKey>
				<CellValue id="turn-player">{turn}</CellValue>
				<Initials aria-hidden="true">
					{players.map((player, at) => (
						<InitialBox key={player.name} $on={at < upTo}>
							{player.name.charAt(0)}
						</InitialBox>
					))}
				</Initials>
			</Cell>

			<Cell>
				<CellKey>ceos down</CellKey>
				<CellValue id="ceos-down">
					{ceosDown} / {NUMBER_OF_PLAYERS_KILLED_FOR_GAME_END}
				</CellValue>
			</Cell>

			<Cell>
				<Button
					small
					id="next-turn"
					active={hasTurnEnded && canAct}
					onClick={() => hasTurnEnded && dispatch(nextTurn())}
				>
					NEXT TURN
				</Button>
			</Cell>
		</Title>
	);
}

export default TurnStrip;
