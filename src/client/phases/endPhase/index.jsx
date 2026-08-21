import { useContext } from 'react';
import { StateContext } from 'State';
import teams from 'Domain/teams';
import HQs from 'Client/components/hqs';
import HqStyled from 'Client/components/hqStyled';
import LeaveGame from 'Client/components/leaveGame';
import { Buttons } from 'Client/components/button';
import { Cementery, Survivors } from 'Client/components/pieceCount';
import useT from 'Client/i18n';
import { EndPhaseContainer, Score, Points, PieceCountTitle, PieceCountContainer, Scores } from './components';
import PieceScore from './pieceScore';
import PlayersScore from './playersScore';

// A component rather than a called function: it reads context, and a plain function that calls
// hooks is only safe by accident.
function TeamPoints({ team }) {
	const [{ pieces }] = useContext(StateContext);
	const t = useT();

	return (
		<Score>
			{teams.getPointsForTeam(team, pieces)}
			<Points>{t('end.points')}</Points>
		</Score>
	);
}

function TeamScore({ team }) {
	const t = useT();

	return (
		<HqStyled team={team}>
			<TeamPoints team={team} />
			<PieceCountContainer>
				<PieceCountTitle>{t('end.killed')}</PieceCountTitle>
				<Cementery team={team} />
			</PieceCountContainer>
			<PieceCountContainer>
				<PieceCountTitle>{t('end.survivors')}</PieceCountTitle>
				<Survivors team={team} />
			</PieceCountContainer>
		</HqStyled>
	);
}

function EndPhase() {
	const t = useT();

	return (
		<EndPhaseContainer>
			<HQs>
				<TeamScore team="0" />
				<TeamScore team="1" />
			</HQs>

			<Scores>
				<PieceScore />
				<PlayersScore />
			</Scores>

			<HQs>
				<TeamScore team="2" />
				<TeamScore team="3" />
			</HQs>

			{/* The only way out of a finished online game. Straight out, with nothing to confirm: the game
			    is over, so there is nothing left to lose by pressing it — and the last player is not turned
			    out from here by somebody else leaving, because the scores are worth reading. */}
			<Buttons>
				<LeaveGame id="end-leave" label={t('end.leaveGame')} />
			</Buttons>
		</EndPhaseContainer>
	);
}

export default EndPhase;
