import { useContext, useCallback } from 'react';
import styled from 'styled-components';
import { StateContext } from 'State';
import { pz } from 'Domain/pieces';
import { artSrc } from 'Client/art';
import PieceStyled from './pieceStyled';

// The cemetery. A typed tally on a file, a hatched write-off on a drawing, a milled recess with
// brass in it — the numbers themselves are untouched, because `x 1` is read back verbatim by
// helpers/get.js and a skin has no business changing what a spec counts.
const PieceCount = styled.div`
	letter-spacing: -3px;
	display: flex;
	min-height: 43px;
	align-items: end;
	justify-content: flex-start;
	width: 100%;
	background: var(--ha-tally-bg);
	border-top: var(--ha-tally-edge);
	border-radius: var(--ha-panel-radius);
`;

// The count sits on the HQ card, so its colour is chosen against that card's team fill. Over the
// 3D tray there is no fill to read against and the card carries a colour of its own, so it
// inherits instead.
function countColor({ team, dimensional }) {
	if (dimensional) {
		return 'inherit';
	}

	// Black and red are the two dark cards; white and yellow are the two light ones.
	return team === '0' || team === '1' ? 'white' : 'black';
}

const PieceTypeCount = styled.span`
	display: flex;
	color: ${countColor};
	flex-flow: column;
	align-items: center;
	flex-basis: 25%;
`;

// The tally shows a piece TYPE, not a piece, so it borrows whichever art reads on this card. Team 0
// owns the pale face and team 2 the dark one, so the two dark cards borrow 0 and the two light ones
// borrow 2 — the same split countColor makes, for the same reason.
function getGenericPieceTeam(team) {
	return team === '0' || team === '1' ? '0' : '2';
}

function PieceType({ type, team }) {
	const image = artSrc(getGenericPieceTeam(team), type);

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
