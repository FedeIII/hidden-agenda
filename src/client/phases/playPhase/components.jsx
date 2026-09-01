import styled, { css, keyframes } from 'styled-components';
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
//
// `$hushed` empties the cell of what it says without emptying its place in the strip: the turn is
// being carried in from the middle of the table (see `TurnAnnounce` below) and would otherwise be
// readable in two places at once. It dims the cell's CONTENTS rather than the cell, because the
// cell's own ground is a segment of the rail in two directions and a hole in it is not a hush.
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

	${({ $hushed }) =>
		$hushed &&
		css`
			> * {
				opacity: 0;
			}
		`}
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

/* ── The turn, delivered ───────────────────────────────────────────────────────────────────
 * Whose turn it is used to change silently in a 9px key at the top of the screen, which is the one
 * fact at this table nobody may miss. So it is handed over instead: it arrives in the middle of the
 * table, is held there long enough to read, and is carried up into the cell it belongs in.
 *
 * It IS that cell — `styled(Cell)`, not a card that resembles one. Everything that makes the strip's
 * first cell look the way it does is inherited, so at the end of the flight the two are the same
 * object at the same size in the same place and the swap has nothing to show. A second set of rules
 * kept in step by hand would have drifted the first time the strip's padding changed.
 *
 * What it travels ON is the card stock every direction already owns — a manila slip, a cyanotype
 * sheet, a milled plate — laid on an opaque piece of that direction's own table. Two layers rather
 * than one because a panel is a token designed to sit ON the ground and two of the three are
 * see-through: over the board, one of them is a line of type read through a hexagon. And the whole
 * of it DISSOLVES on the way up, so what seats itself in the rail is the type and not a box laid
 * over the strip.
 *
 * Three rules:
 *   - `pointer-events: none`, like every other mark this game lays over the table. It crosses the
 *     whole board on its way up and the cells under it stay live — the drag controller resolves a
 *     drop with `elementFromPoint`, and playwright verifies its own hit target the same way.
 *   - Every offset comes through the `style` prop, never a styled-components template. Four values
 *     that differ per viewport would mint a class per viewport and reclaim none — the same leak the
 *     projected-pixel rule and the token table exist to prevent.
 *   - Under `prefers-reduced-motion` it is not rendered at all, and the cell is never hushed. There
 *     is no still version of "carried in from somewhere"; the end state is the whole of the news.
 * ------------------------------------------------------------------------------------------- */

// Long enough to read at a glance, short enough to sit through forty times an evening: it settles
// in ~165ms, is held for ~200ms, and takes ~400ms to travel.
export const DELIVER_MS = 760;

// `--ha-fly-x`, `--ha-fly-y` and `--ha-fly-k` are the offsets and the scale, measured off the strip's
// own cell and written on the element by `TurnStrip`. The rotation is the direction's own: a slip
// lands a degree out of square on the desk and squares up as it seats, and the two directions that
// are machined rather than typed say so with a rotation of zero.
const deliver = keyframes`
	0% {
		opacity: 0;
		transform: translate(var(--ha-fly-x), var(--ha-fly-y)) scale(calc(var(--ha-fly-k) * 1.06))
			rotate(var(--ha-control-rotate));
		animation-timing-function: cubic-bezier(0.16, 0.84, 0.24, 1);
	}
	8% {
		opacity: 1;
	}
	22% {
		transform: translate(var(--ha-fly-x), var(--ha-fly-y)) scale(var(--ha-fly-k))
			rotate(var(--ha-control-rotate));
		animation-timing-function: linear;
	}
	48% {
		transform: translate(var(--ha-fly-x), var(--ha-fly-y)) scale(var(--ha-fly-k))
			rotate(var(--ha-control-rotate));
		animation-timing-function: cubic-bezier(0.55, 0, 0.2, 1);
	}
	100% {
		opacity: 1;
		transform: translate(0px, 0px) scale(1) rotate(0deg);
	}
`;

// The panel is under the type for as long as the type is out over the board, and gone by the time it
// reaches the rail. It leaves a little early on purpose: a ground that is still fading at the moment
// the cell takes over is a second edge over the strip's own.
const dissolve = keyframes`
	0%   { opacity: 1; }
	48%  { opacity: 1; }
	88%  { opacity: 0; }
	100% { opacity: 0; }
`;

export const TurnAnnounceStyled = styled(Cell)`
	position: fixed;
	z-index: 700;
	pointer-events: none;
	transform-origin: 50% 50%;
	will-change: transform;
	animation: ${deliver} ${DELIVER_MS}ms both;

	/* A cell's divider is the rule between it and the cell on its left, and out here there is no cell
	   on its left. Left in, two directions would fly a stray 1px rule across the board and — because
	   the width is the target's border box — lose a pixel of the line's own room on the way. */
	border-left: none;

	/* Both layers sit behind the type and in front of the cell's own ground: within this stacking
	   context a negative z-index paints over the element's background and under its content, which is
	   exactly the order wanted — the card covers a rail segment while it is out over the board and
	   uncovers it as it goes. ::after paints over ::before at equal z-index, so the stock is on the
	   table and not under it. */
	&::before,
	&::after {
		content: '';
		position: absolute;
		inset: -10px -18px;
		z-index: -1;
		border-radius: var(--ha-panel-radius);
		animation: ${dissolve} ${DELIVER_MS}ms both;
	}

	/* The table, opaque, so nothing of the board reads through the line. A literal drop shadow rather
	   than --ha-panel-shadow, and not composed with it either: a direction that wants no shadow sets
	   that token to the keyword none, and the keyword none inside a comma-separated shadow list is a
	   parse error that would take the whole declaration down in silence. No direction has an opinion
	   about this anyway — none of them has a card that flies.

	   And no backtick anywhere in this block, for the reason the token file gives at length: one
	   closes the template literal, and the build says "expected a semicolon" thirty lines away. */
	&::before {
		background-color: var(--ha-ground);
		box-shadow: 0 7px 20px rgba(0, 0, 0, 0.4);
	}

	/* The stock, in the direction's own hand: a manila slip, a cyanotype sheet, a milled plate. The
	   background shorthand and nothing beside it, because the token is a flat colour in one direction
	   and a gradient in another — a background-image line after this one would fill the same slot and
	   quietly empty the plate. --ha-panel-texture is deliberately absent for that reason: it is a 5px
	   band at the foot of a panel, and claiming the slot costs the plate. */
	&::after {
		background: var(--ha-panel);
		border: 1px solid var(--ha-panel-edge);
	}

	@media (prefers-reduced-motion: reduce) {
		display: none;
	}
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

/* A player, and what they are on. Grouped so the pair of alignments stays on the right of the row
   however long a name is, and so the two facts about the same person wrap together. */
export const LedgerWho = styled.span`
	display: flex;
	align-items: baseline;
	gap: 8px;
`;

export const LedgerName = styled.span`
	font-size: 13px;
	letter-spacing: var(--ha-track-label);
	color: var(--ha-ink);
	white-space: nowrap;
`;

/* What a player is on before the teams are counted — a hundred, less fifty for each alignment of
   theirs that is public. Tinted with the accent once some of it has gone, because the interesting
   thing about the number is that it has moved.

   Small caps rather than `text-transform`, which is the rule for anything a spec reads: innerText
   applies a transform and textContent does not, so uppercasing here would make the row's own text
   depend on which of the two a helper happened to use. The number a spec acts on is `data-base`. */
export const LedgerScore = styled.span`
	display: inline-flex;
	align-items: baseline;
	gap: 5px;
	font-family: var(--ha-face-data);
	font-size: 11px;
	font-variant-caps: all-small-caps;
	font-variant-numeric: tabular-nums;
	letter-spacing: var(--ha-track-label);
	white-space: nowrap;
	color: ${({ $spent }) => ($spent ? 'var(--ha-accent)' : 'var(--ha-ink)')};
`;

/* Where the number comes from and what it is not, said once under the table rather than left for a
   player to infer from a figure that only ever goes down. */
export const LedgerNote = styled.p`
	margin: 0;
	max-width: 460px;
	text-align: center;
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-faint);
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

// The board is a section of the page and says so: a rule around it, and a recess inside it darker
// than the ground so the table is the one lit thing on the screen. Both are what divide it from the
// turn strip above and the controls below.
//
// The rule is a DOM border, which only ever paints its own hairline. The fill cannot be: the canvas
// is a sibling of .game and sits UNDER it, so a background here would be a filter over every tile
// the renderer drew rather than a surface beneath them. In 3D the recess is therefore painted by the
// renderer, which clears this element's own rectangle with it before drawing (three/stage.js, and
// SKIN_PLINTH.well in theme/tokens.js). Flat, there is no canvas to get in front of and the same
// colour arrives as an ordinary background.
const asWell = ({ dimensional }) => {
	if (!dimensional) {
		return css`
			background: var(--ha-well);
		`;
	}
};

export const TableBoardStyled = styled.div`
	position: relative;
	width: 45%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 20px;
	/* A colour, never a width: 1px in all three directions, so a cell's box within the board is
	   identical whichever one is on. skin.test.js asserts exactly that. */
	border: 1px solid var(--ha-well-edge);

	${asWell}
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

// The rack takes everything the card has left, which since the claim button came off the top of it is
// nearly twice what it had: the button was absolute, so what reserved its room was 53px of margin
// here — 26px on a phone — and both are gone. That box is what a socket projects from and therefore
// how big a target a thumb has, which is the whole reason to give it the space rather than centre a
// smaller tray in it.
export const HqStore = styled.div`
	position: relative;
	width: 100%;
	flex: 1;
	min-height: 0;
	background-image: url('img/hexgrid.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	margin-bottom: 8px;

	${asRack}
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

// The foot of an HQ card: who holds the team, and the control that takes it.
//
// It was a button across the top of the rack plus a separate note underneath. The button was the
// widest thing on the card and said what the note said, so they are one line — and the rack got the
// button's 53px back. Then the line was the control itself, with the unclaimed words doing double duty
// as the thing you click, which turns out to read as a label whatever the cursor does. So: the words
// say the state, and a control of the direction's own next to them says what you can do about it.
//
// A file logs CONTROL, a drawing has it SIGNED OFF, a case has it CLAIMED, and all three say so when
// nobody has claimed it either — a state that used to be nothing at all on screen.
//
// The row's height is fixed and the same in all three directions, and that is not cosmetic: the rack
// above it takes what is left over, and a socket projects from the rack's box. A line that measured
// one thing on a typed page and another on a drawing would be a skin changing how big a target a
// thumb has.
export const HqFoot = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	flex: none;
	height: 20px;
	margin-top: 3px;
	/* The rule the line hangs under. A colour, never a width — Blueprint is the one direction that
	   draws it, and it draws it dashed. */
	border-top: var(--ha-claim-rule);
`;

// The held state wears the direction's ornament — a stamp on the file, tape across the tray. Its frame
// is a box-shadow rather than a border because the row's border-top is spoken for, and a shorthand
// `border` in here knocked it out once, leaving Blueprint's dashed rule transparent.
const claimStatement = ({ $held, $flat }) => {
	if ($held) {
		return css`
			background: var(--ha-claim-bg);
			color: var(--ha-claim-ink);
			box-shadow: var(--ha-claim-frame);
			transform: rotate(var(--ha-claim-rotate));

			&::before {
				content: var(--ha-claim-key);
			}
		`;
	}

	return css`
		/* Over the 3D rack the card is smoked glass and the skin's own faint ink is right. On the flat
		   path the card is painted in a raw team colour and states its own ink — the same reason
		   pieceCount picks its colour from the card rather than from the tokens. */
		color: ${$flat ? 'inherit' : 'var(--ha-ink-faint)'};

		&::before {
			content: var(--ha-claim-empty);
		}
	`;
};

// Only the holder's NAME is text in the DOM; the words around it are the direction's and arrive as
// `content` on the ::before, which textContent does not see. That split is what keeps the specs
// honest: claimControl.test.js asks who holds a team and reads a name, while which words each
// direction puts around it is asserted in skin.test.js where it belongs.
//
// No text-transform anywhere in here, and that is not a stylistic preference: innerText applies it and
// claimControl.test.js reads the holder's name through that. The ::before words are already written in
// the case they should print in.
export const HqStatement = styled.span`
	flex: 1;
	min-width: 0;
	text-align: var(--ha-claim-align);
	font-family: var(--ha-face-data);
	font-size: 9px;
	line-height: 12px;
	letter-spacing: var(--ha-track-label);
	padding: 2px 0 1px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	${claimStatement}
`;

// The claim itself, as the control this direction makes controls out of — a rubber stamp, a drafted
// rectangle with its corner cut, a brass switch. It is the app's Button, at the size a card's foot has
// room for, so a skin never has to say twice what a control looks like.
export const HqClaim = styled(Button)`
	flex: none;
	font-size: 8px;
	letter-spacing: var(--ha-track-label);
	/* Fixed, so the three directions' different border widths cannot make three different heights out
	   of the row the rack is measured against. */
	height: 15px;
	line-height: 13px;
	padding: 0 6px;

	/* The tracking goes rather than the type: this is the one control on the card and 7px of it is not
	   a target. The statement beside it ellipsises instead — it is saying something the button is
	   already offering. */
	${narrowOrShort} {
		letter-spacing: 0;
		padding: 0 4px;
	}
`;

// The holder's name, which each direction marks as the one word on the line that is a person:
// underlined in the file, ferro red on the drawing, left alone under the tape.
export const HqHolder = styled.b`
	font-weight: inherit;
	color: var(--ha-claim-holder-ink, inherit);
	border-bottom: var(--ha-claim-holder-rule);
`;

export const ActionButton = styled(Button)`
	cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};
`;

// Whose shot it is, beside the button, in hot-seat only. A line of small caps rather than a chip:
// the bar is already three groups of controls, and this is a caption on one of them and not a
// fourth thing to press. `font-variant-caps` rather than `text-transform`, for the reason the claim
// message uses it — Playwright's toHaveText reads textContent, which a transform does not touch.
//
// It is set large and bold for a caption, because it is the only thing on a hot-seat screen that
// says a control the whole table can press belongs to one person this turn. Read late, the shot is
// already taken and cannot be given back.
export const SnipeNote = styled.span`
	font-family: var(--ha-face-data);
	font-size: 18px;
	font-weight: bold;
	font-variant-caps: all-small-caps;
	letter-spacing: 0.08em;
	color: var(--ha-ink-dim);
	max-width: 14ch;
	overflow-wrap: anywhere;
	line-height: 1.15;
`;

/* ── Marks laid over one cell ───────────────────────────────────────────────────────────────
 * Two cells are worth saying something about, and they say it the same way: a tag over the cell
 * with an arrow into it. One is the cell a fallen sniper is fired from — a sniper killed by the
 * very move it saw is lit for a shot with no token left on the board, so the cell it stood in
 * answers for it, and it wears a ring as well because that cell is a control. The other is where
 * the last player's move ended, which is a caption and nothing more.
 *
 * Three rules, the first two borrowed from the training coach marks for the same reasons. A mark
 * never takes a pointer event: the cell underneath IS the control, and an absolutely positioned box
 * over one would quietly eat the click it is advertising. It is drawn in the skin's accent rather
 * than in any of the board's feedback colours — red on a cell means "you may go here", and teal and
 * gold mean "and later". And every offset is a proportion of the cell, so one mark works both ways
 * the board is drawn: flat, as a child of its hexagon, and projected, laid on the board at the box
 * the renderer gave that cell.
 * ------------------------------------------------------------------------------------------- */

const sniperSeek = keyframes`
	0%   { opacity: 1;    transform: scale(1); }
	55%  { opacity: 0.45; transform: scale(1.08); }
	100% { opacity: 1;    transform: scale(1); }
`;

// Laid over one cell. Flat, it is a child of that hexagon and fills it; in 3D the projected box
// arrives through the `style` prop, which is why all four offsets are here rather than an `inset`
// the inline width and height would then be over-constraining.
export const HexMark = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 4;
`;

// The fallen sniper's own addition: a ring round the cell, because that cell is a thing to click
// and the label alone does not say where.
export const FallenSniperMark = styled(HexMark)`
	&::before {
		content: '';
		position: absolute;
		/* Round the token rather than under it. A token is drawn standing on its tile — about a
		   fifth of a cell up the screen, which is why TOKEN_BOX is offset the same way — so a ring
		   centred on the cell is mostly hidden by the piece it is ringing. */
		left: 0;
		right: 0;
		top: -12%;
		bottom: 4%;
		border: 2px dashed var(--ha-accent);
		border-radius: 50%;
		/* The same halo the training coach marks wear, for the same reason: what this ring goes
		   round is a piece, and the piece that killed a sniper is as often as not the red team's —
		   which is the accent, on the accent. A dark outline reads on any token and any tile. */
		filter: drop-shadow(0 0 1px rgba(20, 15, 5, 0.95)) drop-shadow(0 0 3px rgba(20, 15, 5, 0.7));
		animation: ${sniperSeek} 1.6s ease-in-out infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		&::before {
			animation: none;
		}
	}
`;

// The label, and the arrow that ties it to the cell. Above the cell rather than on it: what either
// mark points at has a piece standing on it — the one that did the killing, or the one that has just
// moved — and a label laid over that hides the piece it is about.
export const HexTag = styled.b`
	position: absolute;
	left: 50%;
	bottom: 100%;
	transform: translate(-50%, -9px);
	display: block;
	white-space: nowrap;
	text-align: center;
	padding: 3px 8px 2px;
	background: var(--ha-accent);
	color: var(--ha-ink-on-accent);
	font-family: var(--ha-face-data);
	font-size: 9px;
	font-weight: 400;
	letter-spacing: 0.08em;
	line-height: 1.4;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);

	i {
		display: block;
		font-style: normal;
		opacity: 0.85;
	}

	&::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 100%;
		width: 0;
		height: 0;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-top: 9px solid var(--ha-accent);
		transform: translateX(-50%);
	}
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
