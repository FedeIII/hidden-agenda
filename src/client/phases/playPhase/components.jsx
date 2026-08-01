import styled, { css } from 'styled-components';
import { Button } from 'Client/components/button';
import { narrow, short, narrowOrShort } from 'Client/components/breakpoints';
import { TEAM_COLORS } from 'Domain/teams';

export const PlayPhaseContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10px 40px 60px;
	width: 100%;

	${narrowOrShort} {
		padding: 4px 8px 16px;
	}
`;

export const Board = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: center;
	margin-bottom: 20px;
	width: 90vw;
	height: 75vh;

	/* Upright, there is no room for HQ | board | HQ side by side: the HQs end up narrower than
	   their own "Claim Control" button. Stack instead — two HQs, the board, two HQs. */
	${narrow} {
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: auto;
		margin-bottom: 12px;
	}

	/* On its side the board keeps the row layout, just shorter — enough that the action bar
	   lands above the fold instead of just below it. */
	${short} {
		height: 68vh;
		margin-bottom: 6px;
	}
`;

export const Actions = styled.div`
	width: 90vw;
	display: flex;
	justify-content: space-evenly;
	padding: 0;
	z-index: 10;

	/* Was a single non-wrapping row, so on a phone the last button hung off the screen — and
	   with the old overflow: hidden it was simply gone. */
	${narrowOrShort} {
		width: 100%;
		flex-wrap: wrap;
		gap: 6px;
		justify-content: center;
	}
`;

export const Action = styled.div`
	flex-basis: 33%;
	display: flex;
	justify-content: center;
	cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};

	${narrowOrShort} {
		flex-basis: auto;
	}
`;

export const ActionCancelButton = styled(Button)`
	margin-left: 8px;
	cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};
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
	width: 45%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 20px;

	/* Stacked, the board gets the full width — which is what makes it usable with a thumb. */
	${narrow} {
		width: 100%;
		max-width: 96vw;
		padding: 0;
		margin: 4px 0;
	}
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

	/* The pieces are sized from the store's width but positioned down its height, so the store
	   has to keep roughly its desktop proportions or they hang out of the bottom. */
	${narrowOrShort} {
		margin-top: 26px;
		height: calc(100% - 32px);
	}
`;

export const HqButton = styled(Button)`
	position: absolute;
	font-size: 16px;
	width: calc(100% - 16px);

	/* "Claim Control" at 16px with wide letter-spacing is wider than a phone-sized HQ, which is
	   what produced "Claim Contro" cut off mid-word. */
	${narrowOrShort} {
		font-size: 11px;
		letter-spacing: 0;
		padding: 4px 2px;
	}
`;
export const HqMessage = styled.span`
	position: absolute;
	font-size: 16px;
	top: 40px;
	letter-spacing: -0.5px;

	${narrowOrShort} {
		font-size: 10px;
		top: 26px;
	}
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
	cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};
	margin-right: 8px;
	padding: 8px;
	min-width: 30%;
`;

export const RevealActions = styled.div`
	display: flex;
	flex-direction: row;
`;

const onHide = ({ hide }) => {
	if (hide) {
		return css`
			display: none;
		`;
	}
};

export const ActionButton = styled(Button)`
	${onHide}
	border-left: 1px solid darkgray !important;
	cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};

	&:first-of-type {
		border-left: none !important;
	}
`;

export const AccuseTeam = styled(ActionButton)`
	color: ${({ team }) => (team == 0 ? 'darkgray' : TEAM_COLORS[team])};
`;
