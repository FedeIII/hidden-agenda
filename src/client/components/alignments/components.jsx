import styled, { css } from 'styled-components';
import { narrowOrShort } from 'Client/components/breakpoints';

// A card carries TWO facts and therefore needs two channels: whether it is the friend or the foe,
// and which team it names. The green and red are the alignment and have been since the first
// version — that coding is not up for renegotiation — so the team gets a mark of its own instead of
// sharing one, and each direction puts it where its own material would: Dossier sticks an index tab
// on the top edge, Blueprint hatches the block like a finish it cannot print, Vault anodises it and
// bezels it in brass.
//
// The team colours come from the tokens rather than TEAM_COLORS, which are the raw CSS keywords
// `black` / `red` / `white` / `yellow`. Those are the same four names the *pieces* use, and on a
// card they have the same problem the tokens exist to solve: a black chip and a dark red one do not
// tell themselves apart on fill, which is why every block also carries a hairline of the team's rim.

const containerMargin = ({ small }) => {
	if (small) {
		return css`
			margin: 0;
		`;
	}

	return css`
		margin: 40px;
	`;
};

const cardColor = ({ alignment }) => (alignment === 'friend' ? 'var(--ha-friend)' : 'var(--ha-foe)');

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

// Only a full card is a card. The small ones sit inline between ACCUSE and REVEAL, where a
// protruding tab and a rotation would collide with their neighbours.
const asPaper = ({ small }) => {
	if (small) {
		return;
	}

	return css`
		border: var(--ha-card-edge);
		box-shadow: var(--ha-card-shadow);
		transform: rotate(var(--ha-card-rotate));
	`;
};

const teamTab = ({ small, team }) => {
	if (small || team === undefined || team === null) {
		return;
	}

	return css`
		&::before {
			content: '';
			display: var(--ha-team-tab);
			position: absolute;
			top: -10px;
			right: 15px;
			width: 42px;
			height: 12px;
			background: var(--ha-team-${team});
			box-shadow: inset 0 0 0 1px var(--ha-team-${team}-line);
			clip-path: polygon(7px 0, 100% 0, 100% 100%, 0 100%);
		}
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
	if (team === undefined || team === null) {
		return;
	}

	return css`
		background-color: var(--ha-team-${team});
		background-image: var(--ha-team-overlay);
		color: var(--ha-team-${team}-ink);
		border: var(--ha-team-bezel);
		box-shadow: inset 0 0 0 1px var(--ha-team-${team}-line);
	`;
};

export const Alignments = styled.div`
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	gap: 16px;
	/* The phase centres its column, so without a width of its own this row shrinks to its content
	   and space-evenly has nothing to distribute — the two cards end up edge to edge. */
	width: ${({ small }) => (small ? 'auto' : '100%')};
	${containerMargin}

	${narrowOrShort} {
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		max-width: 100%;
	}
`;

export const AlignmentCardStyled = styled.div`
	position: relative;
	${size}
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${cardColor};
	/* The skin's own material, laid over the alignment colour rather than replacing it: carbon
	   flimsy, a cyanotype sheet, a dark plate. */
	background-image: linear-gradient(var(--ha-card-bg-mix), var(--ha-card-bg-mix));
	cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};

	${asPaper}
	${teamTab}

  &:hover {
		${brightness}
	}
`;

export const AlignmentTeam = styled.span`
	font-weight: bold;
	font-family: var(--ha-face);
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	${innerSize}
	display: flex;
	align-items: center;
	text-align: center;
	justify-content: center;
	${cardTeamColor}
`;
