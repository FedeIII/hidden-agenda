import { useContext, useCallback } from 'react';
import styled from 'styled-components';
import { StateContext } from 'State';
import { pz } from 'Domain/pieces';
import PieceStyled from './pieceStyled';

const PieceCount = styled.div`
	letter-spacing: -3px;
	display: flex;
	min-height: 43px;
	align-items: end;
	justify-content: flex-start;
	width: 100%;
`;

// The count sits on the HQ card, so its colour is chosen against that card's team fill. Over the
// 3D tray there is no fill to read against and the card carries a colour of its own, so it
// inherits instead.
function countColor({ team, dimensional }) {
	if (dimensional) {
		return 'inherit';
	}

	return team === '1' || team === '2' ? 'white' : 'black';
}

const PieceTypeCount = styled.span`
	display: flex;
	color: ${countColor};
	flex-flow: column;
	align-items: center;
	flex-basis: 25%;
`;

function getGenericPieceTeam(team) {
	return team === '1' || team === '2' ? '2' : '0';
}

function PieceType({ type, team }) {
	const image = `img/${getGenericPieceTeam(team)}-${type}.png`;

	return <PieceStyled src={image} killed />;
}

function renderPieceCountList(pieces, team, getPieceCount, dimensional) {
	return getPieceCount(pieces, team)
		.filter(([, pieceCount]) => pieceCount !== 0)
		.map(([pieceType, pieceCount]) => (
			<PieceTypeCount
				key={`piece-count-${team}-${pieceType}`}
				id={`piece-count-${team}-${pieceType}`}
				team={team}
				dimensional={dimensional}
			>
				<PieceType type={pieceType} team={team} /> x {pieceCount}
			</PieceTypeCount>
		));
}

/**
 * CEMENTERY
 */

function useGetKilledPiecesCount(team) {
	const [{ pieces }] = useContext(StateContext);

	const getKilledPiecesCount = useCallback(() => {
		return Object.entries(pz.getKilledPiecesByTeam(team, pieces));
	}, [team, pieces]);

	return [pieces, getKilledPiecesCount];
}

function Cementery({ team, dimensional }) {
	const [pieces, getPiecesKilledCount] = useGetKilledPiecesCount(team);

	return <PieceCount>{renderPieceCountList(pieces, team, getPiecesKilledCount, dimensional)}</PieceCount>;
}

/**
 * SURVIVORS
 */

function useGetSurvivorsCount(team) {
	const [{ pieces }] = useContext(StateContext);

	const getSurvivorCount = useCallback(() => {
		return Object.entries(pz.getSurvivorsForTeam(team, pieces));
	}, [team, pieces]);

	return [pieces, getSurvivorCount];
}

function Survivors({ team }) {
	const [pieces, getSurvivorsCount] = useGetSurvivorsCount(team);

	return <PieceCount>{renderPieceCountList(pieces, team, getSurvivorsCount)}</PieceCount>;
}

export { Cementery, Survivors };
