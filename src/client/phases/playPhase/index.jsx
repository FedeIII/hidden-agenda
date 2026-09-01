import HQs from 'Client/components/hqs';
import { PlayPhaseContainer, Board } from './components';
import HQ from './hq';
import TableBoard from './tableBoard';
import PlayActions from './playActions';
import TurnStrip from './turnStrip';

function PlayPhase() {
	return (
		<PlayPhaseContainer>
			{/* `announce` is the real table's: a turn changing hands here is carried in from the middle
			    of the board. The training course renders the same strip without it — see turnStrip. */}
			<TurnStrip announce />

			<Board>
				<HQs>
					<HQ team="0" />
					<HQ team="1" />
				</HQs>
				<TableBoard />
				<HQs>
					<HQ team="2" />
					<HQ team="3" />
				</HQs>
			</Board>

			<PlayActions />
		</PlayPhaseContainer>
	);
}

export default PlayPhase;
