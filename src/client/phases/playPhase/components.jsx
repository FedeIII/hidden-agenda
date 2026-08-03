import styled, { css } from 'styled-components';
import { Button } from 'Client/components/button';
import { narrow, short, narrowOrShort } from 'Client/components/breakpoints';
import { BOARD_ASPECT } from 'Client/three/layout';

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
	/* The controls used to be one segmented strip held together by shared borders. Each direction
	   now gives a control an edge of its own — a stamp outline, a cut corner, a bevel — so they
	   need air between them instead. */
	gap: 8px;
	align-items: center;
	cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};

	/* An action holds more than one button: the middle one grows to ACCUSE + the alignment cards
	   the player has revealed + REVEAL. Without wrapping it outgrew the screen, and since it is
	   centred it hung off *both* edges at once — with .game clipping horizontally, ACCUSE and
	   REVEAL were not merely ugly but unreachable. */
	${narrowOrShort} {
		flex-basis: auto;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 5px;
		max-width: 100%;
	}
`;

export const ActionCancelButton = styled(Button)`
	cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};
`;

export const AlignmentWarningStyled = styled.div`
	color: var(--ha-ink);
	text-align: center;
`;

export const AlignmentWarningMessage = styled.span`
	display: block;
	margin-bottom: 8px;
	letter-spacing: var(--ha-track-label);
`;

// The board's own height, now that its rows have none. A spacer rather than a height, because
// wherever Board has a height of its own the board is a stretched flex item and this must not
// fight it — the landscape phone layout has exactly zero slack before the action bar falls off
// the bottom. It only bites in the stacked layout, which is the one where Board is auto and the
// board would otherwise collapse to nothing. The ratio is the tilted board's, so no band of empty
// space is reserved above and below it.
const withBoardHeight = ({ dimensional }) => {
	if (dimensional) {
		return css`
			&:before {
				content: '';
				display: block;
				flex: none;
				padding-top: ${100 / BOARD_ASPECT}%;
			}
		`;
	}
};

// Deliberately no background, in any skin. The canvas is a sibling of .game and sits UNDER it, so
// anything painted here is a filter over every tile the renderer drew — which is why the well a
// direction seats its board in is the 3D plinth (three/palette.js#boardColors) and not a CSS fill.
export const TableBoardStyled = styled.div`
	position: relative;
	width: 45%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 20px;

	${withBoardHeight}

	/* Stacked, the board gets the full width — which is what makes it usable with a thumb. */
	${narrow} {
		width: 100%;
		max-width: 96vw;
		padding: 0;
		margin: 4px 0;
	}
`;

// Rendered in 3D the hexagons leave the flow, laid on the projection of their own tiles, and take
// the board's height with them — the nine rows were what gave it any. So the row stops being a
// row: it contributes nothing, and stops being a positioned ancestor too, so a hexagon inside it
// is placed against the board rather than against its row.
const asBoardSpacer = ({ dimensional }) => {
	if (dimensional) {
		return css`
			position: static;
			height: 0;
			margin: 0;
		`;
	}
};

export const BoardRow = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	margin-top: 4.7%;
	justify-content: center;

	${asBoardSpacer}
`;

// The hexgrid is drawn in the tray now, as sockets that have depth to them. The store's box is
// left exactly as it was: it decides how big a socket projects, and therefore how big a target a
// thumb has. Letting it flex to fill the card looked better on a desktop and shrank it to 34px on
// a phone held sideways, where a piece then came out eleven pixels across.
const asRack = ({ dimensional }) => {
	if (dimensional) {
		return css`
			background-image: none;
			/* A hairline where the rack ends, so the cementery below it reads as the shelf under
			   the rack rather than as the panel running out of content. */
			box-shadow: 0 1px 0 var(--ha-rule);
		`;
	}
};

export const HqStore = styled.div`
	position: relative;
	width: 100%;
	height: 80%;
	background-image: url('img/hexgrid.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	margin-top: 53px;
	margin-bottom: 8px;

	${asRack}

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
	color: var(--ha-ink);
	margin-bottom: 8px;
	letter-spacing: var(--ha-track-label);
`;

// A card you press, so it takes the control tokens rather than a fill of its own.
export const RevealCard = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: var(--ha-face);
	letter-spacing: var(--ha-track);
	text-transform: uppercase;
	color: var(--ha-control-ink);
	background: var(--ha-control-bg);
	border: var(--ha-control-edge);
	border-radius: var(--ha-control-radius);
	clip-path: var(--ha-control-clip);
	text-shadow: var(--ha-control-ink-shadow);
	cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};
	padding: 8px 12px;
	min-width: 30%;
`;

export const RevealActions = styled.div`
	display: flex;
	flex-direction: row;
	gap: 8px;
	align-items: center;

	/* Same shape as an Action: two cards and CANCEL side by side, which is more than a phone is
	   wide once a card carries a revealed team name instead of "Friend". */
	${narrowOrShort} {
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 5px;
		max-width: 100%;
	}
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
	cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};
`;

// Accusing names a team, so the button wears that team's colour as a filled chip rather than as
// text. Coloured text meant team 0 had to be faked as darkgray to be legible at all, and it still
// disappeared against a dark panel; a chip with the team's own rim as a hairline works on manila,
// on cyanotype and on gunmetal alike — the same problem the tokens solve for the cards.
export const AccuseTeam = styled(ActionButton)`
	background: var(--ha-team-${({ team }) => team});
	color: var(--ha-team-${({ team }) => team}-ink);
	border: 1px solid var(--ha-team-${({ team }) => team}-line);
	text-shadow: none;
`;
