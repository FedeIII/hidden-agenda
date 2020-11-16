import styled from 'styled-components';
import { TEAM_COLORS } from 'Domain/teams';

export const EndPhaseContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	padding: 10px 40px 60px;
	margin-top: 40px;
	align-items: center;
`;

export const Score = styled.div`
	text-align: center;
	font-size: 50px;
	padding: 15px;
`;

export const Points = styled.sup`
	font-size: 16px;
`;

export const PieceCountContainer = styled.div`
	margin-bottom: 8px;

	&:last-child {
		margin-bottom: 0;
	}
`;

export const PieceCountTitle = styled.span`
	display: inline-block;
	margin-bottom: 8px;
`;

export const PieceTable = styled.div`
	background-color: lightslategray;
	border: 2px solid gray;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	padding: 16px 8px;
	margin-bottom: 20px;
	height: 36%;
`;

export const PieceRow = styled.div`
	letter-spacing: -3px;
	display: flex;
	align-items: end;
	justify-content: space-evenly;
	margin: 0 0 8px;
`;

const pointsColor = ({ team }) => TEAM_COLORS[team] || 'white';

export const PieceCell = styled.span`
	display: flex;
	color: ${pointsColor};
	flex-flow: column;
	align-items: center;
	flex-basis: 33%;
	justify-content: space-evenly;
	font-size: 18px;
	font-weight: bold;
	flex-shrink: ${({ big }) => (big ? '0' : 'initial')};
`;

export const Scores = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	width: 40%;
	flex-shrink: 0;
`;

export const PointsTable = styled.div`
	background-color: lightslategray;
	border: 2px solid gray;
	padding: 16px 8px;
	margin-bottom: 20px;
	height: 36%;
	display: flex;
	flex-direction: column;
`;

export const Row = styled.tr`
	margin: 0 0 8px;
	height: 30px;
`;

export const Cell = styled.td`
	color: ${pointsColor};
	filter: brightness(2) saturate(0.9);
	letter-spacing: ${({ big }) => (big ? '-1px' : '-3px')};
	font-size: 18px;
	font-weight: bold;
	text-align: end;
	min-width: 13px;

	&:first-of-type {
		text-align: start;
	}
`;

export const Winner = styled.div`
	color: white;
	align-self: center;
	margin: 30px auto 10px;
	font-size: 18px;
	font-weight: bold;
`;

export const PlayerWinner = styled.div`
	color: white;
	align-self: center;
	font-size: 32px;
	font-weight: bold;
`;
