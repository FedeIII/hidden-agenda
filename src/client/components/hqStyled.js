import styled, { css } from 'styled-components';
import { narrow, short } from './breakpoints';
import { TEAM_COLORS } from 'Domain/teams';
import { HQ_TRAY } from 'Client/three/palette';

// Every branch states its own ink, including the two light cards. They used to leave it inherited
// and got the browser's default black, which stopped being black the moment <body> took a skin's
// colour — and a white 135 on a white card is not a score.
const hqColor = ({ team }) => {
	switch (team) {
		default:
		case '0':
			return css`
				background-color: ${TEAM_COLORS[0]};
				color: white;
			`;
		case '1':
			return css`
				background-color: ${TEAM_COLORS[1]};
				color: white;
			`;
		case '2':
			return css`
				background-color: ${TEAM_COLORS[2]};
				color: #1b1e23;
			`;
		case '3':
			return css`
				background-color: ${TEAM_COLORS[3]};
				color: #2b2410;
			`;
	}
};

// The card is painted in the team's own colour — the black team's card is black — and its pieces
// read against it because the token faces are the other way round. In 3D the rack behind it does
// that job, and the card would only be in the way, so it thins down to smoked glass: enough tint
// to still be a card, little enough to let the tray through, and the team colour moves to the
// frame where it reads as identity rather than as a background.
//
// Thin, and thinner than it looks like it should be, because this glass is in front of the rack
// rather than behind it: the canvas sits under .game, so every pixel the HQ scene draws is seen
// through whatever this says. At the 0.28 it started on it was taking a quarter off a rack that was
// already being lit too dimly, and the two together are what made a tray look nearly black.
const asGlass = ({ dimensional, team }) => {
	if (dimensional) {
		return css`
			background-color: var(--ha-hq-glass);
			background-image: var(--ha-panel-texture);
			background-repeat: no-repeat;
			background-position: bottom;
			background-size: 100% 5px;
			/* The team colour stays on the frame, where it reads as identity. It comes from the
			   tray palette rather than the tokens because it has to match the rack the renderer
			   drew behind it, to the pixel. */
			border-color: ${HQ_TRAY[team].frame};
			border-radius: var(--ha-panel-radius);
			color: var(--ha-ink);
			box-shadow: var(--ha-hq-inner);
		`;
	}
};

const teamVars = ({ team }) => css`
	--ha-hq-team: var(--ha-team-${team});
	--ha-hq-team-ink: var(--ha-team-${team}-ink);
`;

const HqStyled = styled.div`
	position: relative;
	${teamVars}
	height: 50%;
	max-height: 223px;
	display: flex;
	flex-direction: column;
	border: 2px solid gray;
	padding: 8px;
	margin-bottom: 20px;
	justify-content: space-between;
	${hqColor}
	${asGlass}

	${narrow} {
		flex: 1 1 0;
		min-width: 0;
		height: auto;
		aspect-ratio: 1 / 1.08;
		max-height: none;
		margin-bottom: 8px;
		padding: 5px;
	}

	${short} {
		margin-bottom: 8px;
		padding: 5px;
	}
`;

export default HqStyled;
