import styled, { css } from 'styled-components';
import { Button } from 'Client/components/button';
import { narrow, short, narrowOrShort } from 'Client/components/breakpoints';
import { BOARD_ASPECT } from 'Client/three/layout';
import { AlignmentCardStyled } from 'Client/components/alignments/components';

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

// One cell of the turn strip. A divider on the left rather than a box around each, so the strip
// reads as one object subdivided — which is what a title block, a routing slip and a machined rail
// all are — and so the first cell has no stray rule to its left.
export const Cell = styled.div`
	display: flex;
	align-items: baseline;
	gap: 8px;
	flex-wrap: wrap;
	justify-content: center;
	padding: 2px 14px;
	background: var(--ha-cell-bg);
	border-left: var(--ha-cell-divider);

	&:first-child {
		border-left: none;
	}

	${narrowOrShort} {
		padding: 2px 7px;
		gap: 5px;
	}
`;

export const CellKey = styled.span`
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-faint);
	font-weight: 400;

	${narrowOrShort} {
		font-size: 8px;
	}
`;

// The one cell that carries an accent. In Dossier it is a rubber stamp, in Blueprint a ferro-red
// section flag, in Vault a brass-edged plate — and what it stamps is a real fact: how close the
// game is to over.
export const CellMark = styled.span`
	display: inline-flex;
	align-items: baseline;
	gap: 8px;
	padding: 2px 9px 1px;
	color: var(--ha-stamp-ink);
	border: var(--ha-stamp-edge);
	transform: rotate(var(--ha-stamp-rotate));
	text-shadow: var(--ha-control-ink-shadow);
`;

export const CellValue = styled.span`
	font-size: 15px;
	letter-spacing: var(--ha-track-label);
	color: var(--ha-ink);
	font-variant-numeric: tabular-nums;
	white-space: nowrap;

	${narrowOrShort} {
		font-size: 12px;
	}
`;

// The initials boxes on the routing slip: one per seat, filled for the ones that have already had
// the turn this round. Dossier's own idea, so the other two hide them rather than reinterpret them.
export const Initials = styled.span`
	display: var(--ha-mark-initials, inline-flex);
	gap: 3px;
`;

export const InitialBox = styled.i`
	font-style: normal;
	font-family: var(--ha-face-data);
	font-size: 10px;
	line-height: 14px;
	width: 13px;
	text-align: center;
	border: 1px solid var(--ha-rule);
	color: ${({ $on }) => ($on ? 'var(--ha-ink-on-accent)' : 'var(--ha-ink-faint)')};
	background: ${({ $on }) => ($on ? 'var(--ha-ink)' : 'transparent')};
`;

/* ── The full-screen shell ─────────────────────────────────────────────────────────────────
 * The one thing in the game allowed to cover the table, and it earns it by being opaque and modal:
 * a player reading their own two cards has nothing on the board to click. It takes the skin's own
 * ground and wash, so it reads as the same sheet the cards were dealt on rather than as a dialog.
 * ------------------------------------------------------------------------------------------- */
export const ScreenStyled = styled.div`
	position: fixed;
	inset: 0;
	z-index: 900;
	display: flex;
	/* flex-start plus auto margins on the body, not align-items: center. Centring a flex item that is
	   taller than its scroll container puts its top above the scrollable area, where it cannot be
	   reached — and two full-size cards are taller than the 800x600 the specs are pinned to. */
	align-items: flex-start;
	justify-content: center;
	padding: 20px;
	overflow-y: auto;
	background-color: var(--ha-ground);
	background-image: var(--ha-ground-wash);
`;

export const ScreenBody = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	margin: auto 0;
	width: 100%;
	max-width: 720px;
	background-image: var(--ha-panel-ornament);
	background-repeat: no-repeat;
	padding-top: 18px;

	${narrowOrShort} {
		gap: 9px;
		padding-top: 12px;

		/* The cards are the ones the game deals, at the size it deals them. On a short screen that is
		   more height than there is, so they come down rather than the screen scrolling for something
		   that ought to be taken in at a glance. */
		${AlignmentCardStyled} {
			width: 132px;
			height: 208px;
		}
	}
`;

export const ScreenNote = styled.div`
	text-align: center;
	font-family: var(--ha-face-data);
	font-size: 12px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-accent);

	${narrowOrShort} {
		font-size: 10px;
	}
`;

/* Who has admitted to what. An unrevealed alignment is a black bar rather than a blank, because
   "there is something here you may not see" is a better thing to show than nothing — and because
   redaction is the premise of this game, not decoration on it. */
export const Ledger = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	width: 100%;
	max-width: 460px;
`;

export const LedgerRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
	flex-wrap: wrap;
	padding: 5px 9px;
	background: ${({ $own }) => ($own ? 'var(--ha-accent-wash)' : 'transparent')};
	border: 1px solid ${({ $own }) => ($own ? 'var(--ha-accent)' : 'var(--ha-rule)')};
	border-radius: var(--ha-panel-radius);
`;

export const LedgerName = styled.span`
	font-size: 13px;
	letter-spacing: var(--ha-track-label);
	color: var(--ha-ink);
	white-space: nowrap;
`;

export const LedgerPair = styled.span`
	display: flex;
	gap: 6px;
	flex-wrap: wrap;
`;

export const LedgerCell = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 1px 7px;
	font-family: var(--ha-face-data);
	font-size: 10px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink);
	border-left: 3px solid ${({ $alignment }) => ($alignment === 'friend' ? 'var(--ha-friend)' : 'var(--ha-foe)')};
`;

export const LedgerKey = styled.i`
	font-style: normal;
	color: var(--ha-ink-faint);
`;

// A bar, not a blank. Sized in ems so it tracks the type rather than a magic width.
export const Redacted = styled.span`
	display: inline-block;
	width: 4.2em;
	height: 0.95em;
	background: var(--ha-ink);
	opacity: 0.82;
`;

export const ScreenTitle = styled.h2`
	margin: 0;
	text-align: center;
	font-family: var(--ha-face);
	font-size: 20px;
	font-weight: bold;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink);

	${narrowOrShort} {
		font-size: 15px;
	}
`;

export const ScreenChoices = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	justify-content: center;
	width: 100%;
`;

// One thing you can accuse: a player, with everything already known about them printed on it, so the
// choice is made looking at the evidence rather than from memory.
export const Choice = styled.button.attrs(({ active }) => ({ disabled: !active }))`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 6px;
	min-width: 150px;
	padding: 9px 12px;
	font-family: var(--ha-face);
	font-size: 14px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};
	color: ${({ active }) => (active ? 'var(--ha-control-ink)' : 'var(--ha-control-ink-off)')};
	background: ${({ active }) => (active ? 'var(--ha-control-bg)' : 'var(--ha-control-bg-off)')};
	border: ${({ active }) => (active ? 'var(--ha-control-edge)' : 'var(--ha-control-edge-off)')};
	border-radius: var(--ha-control-radius);
	clip-path: var(--ha-control-clip);

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 2px;
	}
`;

// Why a choice is closed to you, said on the choice itself rather than left as a dead button.
export const ChoiceWhy = styled.span`
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	opacity: 0.75;
	max-width: 22ch;
	white-space: normal;
	text-align: left;
`;

/* The result of an accusation, which used to be nothing at all: the menu simply closed and a player
   had to work out from the rest of the table whether they had just been right, and whether they had
   spent their one chance at that alignment. */
export const Verdict = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	padding: 14px 18px;
	text-align: center;
	max-width: 460px;
	border: 2px solid ${({ $correct }) => ($correct ? 'var(--ha-friend)' : 'var(--ha-foe)')};
	background: ${({ $correct }) =>
		$correct
			? 'color-mix(in srgb, var(--ha-friend) 14%, transparent)'
			: 'color-mix(in srgb, var(--ha-foe) 14%, transparent)'};
`;

export const VerdictHead = styled.strong`
	font-family: var(--ha-face);
	font-size: 22px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: ${({ $correct }) => ($correct ? 'var(--ha-friend)' : 'var(--ha-foe)')};

	${narrowOrShort} {
		font-size: 17px;
	}
`;

export const VerdictLine = styled.span`
	font-size: 14px;
	letter-spacing: var(--ha-track-label);
	color: var(--ha-ink);
`;

export const VerdictCost = styled.span`
	font-family: var(--ha-face-data);
	font-size: 11px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-accent);
`;

// How an alignment became public, printed next to it: paid for, or taken.
export const LedgerHow = styled.i`
	font-style: normal;
	font-family: var(--ha-face-data);
	font-size: 8.5px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-faint);
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

// The coordinates and dimension callouts a drawing has, laid over the board.
//
// Two things keep this safe. It never intercepts a pointer — the ring cells it sits on ARE clickable,
// because that is how a piece on the border is pointed off the board, and an absolutely positioned
// label over one would quietly eat that. And every projected pixel arrives through the `style` prop,
// never through this template: styled-components mints a rule per distinct interpolated value and
// reclaims none, so a px offset in here would leak a class per tick per layout, forever.
export const BoardMarks = styled.div`
	display: var(--ha-mark-display);
	position: absolute;
	inset: 0;
	pointer-events: none;
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: 0.1em;
	color: var(--ha-mark-ink);
	z-index: 2;
`;

export const Tick = styled.span`
	position: absolute;
	transform: translate(-50%, -50%);
	white-space: nowrap;
`;

// A part called out on a leader line, the way a drawing names the thing it is pointing at. Only ever
// one at a time — whatever is selected — so it costs a single element and never crowds the board.
export const Callout = styled.span`
	position: absolute;
	transform: translateY(-50%);
	white-space: nowrap;
	padding-left: 34px;
	color: var(--ha-mark-ink);

	&::before {
		content: '';
		position: absolute;
		left: 4px;
		top: 50%;
		width: 26px;
		border-top: 1px solid var(--ha-mark-rule);
	}

	/* Both the bubble and the label sit on a break in the ground, which is what a drawing does with a
	   leader label: the line is interrupted rather than drawn through the text. Without it the label
	   is chalk over slate tiles and unreadable exactly where a piece is. */
	i {
		font-style: normal;
		display: inline-block;
		min-width: 15px;
		height: 15px;
		line-height: 14px;
		text-align: center;
		border: 1px solid var(--ha-mark-rule);
		border-radius: 50%;
		margin-right: 6px;
		background: var(--ha-ground);
	}

	b {
		font-weight: 400;
		padding: 1px 5px;
		background: var(--ha-ground);
	}
`;

// A dimension line with real end ticks, the way a drawing brackets a measurement.
export const Dimension = styled.span`
	position: absolute;
	left: 4%;
	right: 4%;
	top: 2px;
	border-top: 1px solid var(--ha-mark-rule);
	text-align: center;

	&::before,
	&::after {
		content: '';
		position: absolute;
		top: -4px;
		width: 1px;
		height: 9px;
		background: var(--ha-mark-rule);
	}

	&::before {
		left: 0;
	}

	&::after {
		right: 0;
	}

	span {
		position: relative;
		top: -11px;
		padding: 0 6px;
		background: var(--ha-ground);
	}
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

// The team's name, on the thing each direction would put a name on: a file tab cut into the top edge
// of the card, a drawing's reversed-out sheet label, a strip of embossed tape. It protrudes above the
// card so it reads as attached to it rather than printed on it — and it carries the team colour in
// Dossier, where the frame alone is doing that job in the other two.
export const HqLabel = styled.span`
	position: absolute;
	top: -11px;
	left: 6px;
	z-index: 3;
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 2px 10px 1px;
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	/* Dossier leaves these unset so the tab takes the team's own colour; the other two set them,
	   because there the frame is already carrying team identity. The fallback has to live here rather
	   than in the token: see the note in theme/tokens.js. */
	background: var(--ha-hq-label-bg, var(--ha-hq-team));
	color: var(--ha-hq-label-ink, var(--ha-hq-team-ink));
	border: var(--ha-hq-label-edge);
	border-radius: var(--ha-hq-label-radius);
	clip-path: var(--ha-hq-label-clip);
	box-shadow: var(--ha-hq-label-shadow);
	/* A label, never a target. The card below it is full of sockets a thumb has to reach. */
	pointer-events: none;
	white-space: nowrap;

	${narrowOrShort} {
		font-size: 8px;
		padding: 1px 6px;
		top: -9px;
	}
`;

export const HqFile = styled.b`
	font-weight: 400;
	opacity: 0.72;
	font-variant-numeric: tabular-nums;
`;

// Who holds this team. A stamp on the file, a signed-off note, or tamper tape across the tray —
// the words are the same in all three, which they have to be: claimControl.test.js asserts them
// verbatim.
//
// pointer-events: none is not cosmetic. This sits over the top of the rack, and the rack is where
// eight pieces are clicked and dragged from.
export const HqMessage = styled.span`
	position: absolute;
	left: -4px;
	right: -4px;
	top: 38px;
	z-index: 2;
	pointer-events: none;
	text-align: center;
	font-family: var(--ha-face-data);
	font-size: 11px;
	letter-spacing: var(--ha-track-label);
	/* Small caps rather than text-transform, which is not a stylistic preference: innerText applies
	   text-transform and claimControl.test.js asserts this string verbatim through it. A glyph-level
	   feature gives the same look and leaves the text alone. */
	font-variant-caps: all-small-caps;
	padding: 2px 0 1px;
	background: var(--ha-claim-bg);
	color: var(--ha-claim-ink);
	border: var(--ha-claim-edge);
	transform: rotate(var(--ha-claim-rotate));

	${narrowOrShort} {
		font-size: 8px;
		top: 24px;
		letter-spacing: 0;
	}
`;

export const ActionButton = styled(Button)`
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
