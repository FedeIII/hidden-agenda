import styled, { css } from 'styled-components';

const containerMargin = ({ small }) => {
	if (small) {
		return css`
			margin: 0;
		`;
	}

	return css`
		margin: 60px 40px;
	`;
};

const cardColor = ({ alignment }) => (alignment === 'friend' ? 'mediumseagreen' : 'indianred');

const brightness = ({ disabled }) => {
	if (!disabled) {
		return css`
			filter: brightness(1.2);
		`;
	}
};

const size = ({ small }) => {
	if (small) {
		return css`
			width: initial;
			height: initial;
		`;
	}

	return css`
		width: 200px;
		height: 324px;
	`;
};

const innerSize = ({ small }) => {
	if (small) {
		return css`
			width: calc(100% - 16px);
	    height: calc(100% - 16px);
		`;
	}

	return css`
		width: 66%;
		height: 33%;
	`;
};

const cardTeamColor = ({ team }) => {
	switch (team) {
		default:
		case '0':
			return css`
				background-color: black;
				color: white;
			`;
		case '1':
			return css`
				background-color: red;
				color: white;
			`;
		case '2':
			return css`
				background-color: white;
			`;
		case '3':
			return css`
				background-color: yellow;
			`;
	}
};

export const Alignments = styled.div`
	display: flex;
	justify-content: space-evenly;
	${containerMargin}
`;

export const AlignmentCardStyled = styled.div`
	${size}
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${cardColor};
	cursor: pointer;

	&:hover {
		${brightness}
	}
`;

export const AlignmentTeam = styled.span`
	font-weight: bold;
	${innerSize}
	display: flex;
	align-items: center;
	text-align: center;
	justify-content: center;
	${cardTeamColor}
`;
