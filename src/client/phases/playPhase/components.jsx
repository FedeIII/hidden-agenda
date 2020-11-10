import styled from 'styled-components';
import { Button } from 'Client/components/button';

export const PlayPhaseContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10px 40px 60px;
	width: 100%;
`;

export const Board = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	margin-bottom: 20px;
	width: 90vw;
	height: 75vh;
`;

export const Actions = styled.div`
	width: 90vw;
	display: flex;
	justify-content: space-evenly;
	padding: 0;
`;

export const Action = styled.div`
	flex-basis: 33%;
	display: flex;
	justify-content: center;
`;

export const AlignmentWarningStyled = styled.div`
	color: white;
	text-align: center;
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
	margin-top: 53px;
	margin-bottom: 8px;
`;

export const HqButton = styled(Button)`
	position: absolute;
	font-size: 16px;
	width: calc(100% - 16px);
`;
export const HqMessage = styled.span`
	position: absolute;
	font-size: 16px;
	top: 40px;
	letter-spacing: -0.5px;
`;

export const RevealContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	margin: 0;
`;

export const RevealMessage = styled.span`
	color: white;
	margin-bottom: 8px;
`;

export const RevealCard = styled.div`
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: black;
	cursor: pointer;
	margin-right: 8px;
	padding: 8px;
	min-width: 30%;
`;

export const RevealActions = styled.div`
	display: flex;
	flex-direction: row;
`;

export const RevealCancelButton = styled(Button)`
	margin-left: 8px;
`;
