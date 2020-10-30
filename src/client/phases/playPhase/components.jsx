import styled from 'styled-components';
import { Button } from 'Client/components/button';

export const PlayPhaseContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40px 40px 60px;
	width: 100%;
`;

export const Board = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	margin-bottom: 20px;
	min-width: 80vw;
`;

export const Actions = styled.div`
	width: 80vw;
	display: flex;
	justify-content: space-evenly;
	padding: 20px;
`;

export const Action = styled.div`
	flex-basis: 33%;
	display: flex;
	justify-content: center;
`;

export const AlignmentWarningStyled = styled.div`
	color: white;
`;

export const AlignmentWarningMessage = styled.span`
	display: block;
	margin-bottom: 8px;
`;

export const TableBoardStyled = styled.div`
	position: relative;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 20px;
`;

export const BoardRow = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	margin-top: 4.7%;
	justify-content: center;
`;

export const HqStore = styled.div`
	position: relative;
	width: 100%;
	height: 80%;
	background-image: url('img/hexgrid.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	margin-bottom: 10px;
`;
