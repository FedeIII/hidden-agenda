import styled, { css } from 'styled-components';
import { narrowOrShort } from 'Client/components/breakpoints';
import { TEAM_COLORS } from 'Domain/teams';

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
			margin-right: 8px;

			${narrowOrShort} {
				margin-right: 4px;
			}
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
			margin: 6px 8px;
			padding: 2px 8px;

			/* A small card is a label with 40px of chrome around it, and two of them sit inline
			   between ACCUSE and REVEAL. At "YELLOW" that row was wider than a phone. */
			${narrowOrShort} {
				font-size: 12px;
				letter-spacing: 1px;
				margin: 4px;
				padding: 2px 4px;
				white-space: nowrap;
			}
		`;
	}

	return css`
		min-width: 50%;
		min-height: 20%;
		padding: 8px;
	`;
};

const cardTeamColor = ({ team }) => {
	switch (team) {
		default:
		case '0':
			return css`
				background-color: ${TEAM_COLORS[team]};
				color: white;
			`;
		case '1':
			return css`
				background-color: ${TEAM_COLORS[team]};
				color: white;
			`;
		case '2':
			return css`
				background-color: ${TEAM_COLORS[team]};
			`;
		case '3':
			return css`
				background-color: ${TEAM_COLORS[team]};
			`;
	}
};

export const Alignments = styled.div`
	display: flex;
	justify-content: space-evenly;
	${containerMargin}

	${narrowOrShort} {
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		max-width: 100%;
	}
`;

export const AlignmentCardStyled = styled.div`
	${size}
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${cardColor};
	cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};

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
