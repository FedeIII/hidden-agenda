import styled, { css } from 'styled-components';
import { narrow, short } from './breakpoints';
import { TEAM_COLORS } from 'Domain/teams';
import { HQ_TRAY } from 'Client/three/palette';

const hqColor = ({ team }) => {
	switch (team) {
		default:
		case '0':
			return css`
				background-color: ${TEAM_COLORS[2]};
			`;
		case '1':
			return css`
				background-color: ${TEAM_COLORS[1]};
				color: white;
			`;
		case '2':
			return css`
				background-color: ${TEAM_COLORS[0]};
				color: white;
			`;
		case '3':
			return css`
				background-color: ${TEAM_COLORS[3]};
			`;
	}
};

// The card is painted in a team colour so its pieces read against it — deliberately contrasted
// rather than literal, which is why the black team's card is white. In 3D the rack behind it does
// that job, and the card would only be in the way, so it thins down to smoked glass: enough tint
// to still be a card, little enough to let the tray through, and the team colour moves to the
// frame where it reads as identity rather than as a background.
const asGlass = ({ dimensional, team }) => {
	if (dimensional) {
		return css`
			background-color: rgba(12, 17, 25, 0.28);
			border-color: ${HQ_TRAY[team].frame};
			color: white;
			box-shadow: inset 0 0 18px rgba(0, 0, 0, 0.45);
		`;
	}
};

const HqStyled = styled.div`
	position: relative;
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
