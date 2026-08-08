import styled, { css, keyframes } from 'styled-components';
import { narrow, narrowOrShort, short } from 'Client/components/breakpoints';
import { Buttons } from 'Client/components/button';
import { Subtitle, Title } from 'Client/components/title';
import { Board, TableBoardStyled } from 'Phases/playPhase/components';
import { Alignments, AlignmentCardStyled } from 'Client/components/alignments/components';

// The look of the training room.
//
// Same file room as the rest of How to Play, and always Dossier — the lobby never wears another
// direction — so these read the tokens directly the way `RuleNote` next door does, rather than
// carrying a fallback for two skins that will never be on.
//
// One rule governs everything here: **nothing may cover the board**. Every hexagon is a transparent
// DOM element and every click in the game goes through it, so the coach marks are `pointer-events:
// none` and the panel has no background of its own — the WebGL canvas is a sibling of `.game` and
// sits *under* it, so a fill anywhere in this tree would be a filter over the table rather than a
// surface behind it.

export const TrainingPanel = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	width: 100%;
	padding: 0 28px;

	${narrowOrShort} {
		gap: 5px;
		padding: 0 10px;
	}
`;

// The title and the record share a line. Every band of chrome above the board is a band taken off
// it, and on an 800x600 screen — the one the specs are pinned to — the board had run out of room
// before this pair were put together.
export const HeadRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 14px;
	flex-wrap: wrap;
	width: 100%;
`;

export const TrainingHead = styled(Subtitle)`
	padding: 2px 0;
	color: var(--ha-ink);
	font-weight: bold;
	white-space: nowrap;
`;

// The turn strip, in a lesson's proportions. It is the game's own component and says the game's own
// things; what it does not need here is the padding of a band that owns the top of the screen.
export const Strip = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;

	${Title} {
		width: auto;
		max-width: 100%;
		padding: 4px 12px;
	}
`;

/* ── The training record ───────────────────────────────────────────────────────────────────
 * Eight boxes, initialled as they are passed, and the way back to any of them. It is the pager as
 * well as the progress: the rule pages step one at a time because they are a book, and this is a
 * course, where the exercise you want next is not always the one after this one.
 * ------------------------------------------------------------------------------------------- */

export const Record = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	flex-wrap: wrap;
	justify-content: center;
	padding-bottom: 2px;
`;

export const RecordLabel = styled.span`
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-faint);
`;

// The initials box off the routing slip, made into a control. Filled once an exercise has been
// passed, outlined in the accent while it is the one on the desk.
const recordState = ({ $done, $current }) => {
	if ($current) {
		return css`
			color: var(--ha-accent);
			border-color: var(--ha-accent);
			border-width: 2px;
		`;
	}

	if ($done) {
		return css`
			color: var(--ha-ink-on-accent);
			background: var(--ha-ink);
			border-color: var(--ha-ink);
		`;
	}
};

export const RecordBox = styled.button`
	font-family: var(--ha-face-data);
	font-size: 11px;
	line-height: 1;
	width: 22px;
	height: 20px;
	padding: 0;
	text-align: center;
	background: transparent;
	border: 1px solid var(--ha-rule);
	color: var(--ha-ink-faint);
	cursor: pointer;

	${recordState}

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 2px;
	}
`;

/* ── The slip ──────────────────────────────────────────────────────────────────────────────
 * What to do, in one word. The routing slip the turn strip is set on, carrying a rubber-stamped
 * verb instead of a name — because the answer to "what now?" should be readable across a room and
 * take no reading at all.
 * ------------------------------------------------------------------------------------------- */

export const Slip = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 14px;
	flex-wrap: wrap;
	width: 100%;
	max-width: 620px;
	padding: 6px 14px;
	border-top: 1px dashed var(--ha-accent);
	border-bottom: 2px solid var(--ha-ink);

	${narrowOrShort} {
		gap: 8px;
		padding: 4px 8px;
	}
`;

export const SlipKey = styled.span`
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-faint);
	font-variant-numeric: tabular-nums;
`;

// The verb, stamped. Written in capitals in the script rather than uppercased here, so what a spec
// reads with `textContent` and what a player reads off the screen are the same string.
export const Verb = styled.strong`
	padding: 3px 14px 2px;
	font-size: 21px;
	font-weight: 400;
	letter-spacing: var(--ha-track);
	color: var(--ha-stamp-ink);
	border: var(--ha-stamp-edge);
	transform: rotate(var(--ha-stamp-rotate));
	text-shadow: var(--ha-control-ink-shadow);
	white-space: nowrap;

	${narrowOrShort} {
		font-size: 16px;
		padding: 2px 9px 1px;
	}
`;

export const Hint = styled.em`
	font-style: italic;
	font-size: 12px;
	color: var(--ha-ink-dim);
`;

/* ── The table ─────────────────────────────────────────────────────────────────────────────
 * The real board, in a shorter box. `Board` is 90vw by 75vh because a game is the whole screen;
 * here it shares the screen with the slip and the record above it, and with the way out.
 * ------------------------------------------------------------------------------------------- */

export const TrainingBoard = styled(Board)`
	width: 100%;
	max-width: 1000px;
	/* Whatever the chrome above and below it is not using. The subtraction is the height of that
	   chrome at its tallest — the record, the slip, the turn strip and the way out — so the board
	   fills an 800x600 window without a scroll and grows with anything larger. */
	height: clamp(200px, calc(100vh - 310px), 420px);
	margin-bottom: 6px;

	/* Repeated rather than inherited: Board sets its own height inside both breakpoints, and a rule
	   in here would otherwise be beaten by the more specific media block it came from. */
	${short} {
		height: clamp(180px, calc(100vh - 250px), 420px);
		margin-bottom: 4px;
	}

	${narrow} {
		height: auto;
	}

	/* With no HQ either side the board would sit at 45% of the panel and read as a postage stamp,
	   so it takes the room the trays are not using. A component selector rather than an id, because
	   what this is styling is the board *inside this box* and not a particular element. */
	${({ $solo }) =>
		$solo &&
		css`
			${TableBoardStyled} {
				width: 68%;

				${narrow} {
					width: 100%;
				}
			}
		`}
`;

/* ── The two cards ─────────────────────────────────────────────────────────────────────────
 * The first exercise has no board: what it teaches is the pair of cards everything else is played
 * for. They are dealt face down and turned over by hand, at the size the game deals them at.
 * ------------------------------------------------------------------------------------------- */

// A card is 200x324, which is a card dealt to a table with nothing else on it. Here it shares the
// screen with a record, a slip and a way out, so both sides of the pair are scaled to the same
// smaller stock rather than the real card being cropped by the fold.
const CARD = { width: '170px', height: '276px' };
const SMALL_CARD = { width: '134px', height: '218px' };

export const CardTable = styled(Alignments)`
	/* Alignments carries 40px all round for the phase it belongs to, which is a whole band of
	   nothing on a screen that also has a record, a slip and a way out. */
	margin: 6px 0 10px;

	${AlignmentCardStyled} {
		width: ${CARD.width};
		height: ${CARD.height};
	}

	${narrowOrShort} {
		${AlignmentCardStyled} {
			width: ${SMALL_CARD.width};
			height: ${SMALL_CARD.height};
		}
	}
`;

// The back of a card. Manila rather than the alignment's own green or red, because the colour IS
// the answer and this is the side that does not give it away.
export const CardBack = styled.button`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
	width: ${CARD.width};
	height: ${CARD.height};
	padding: 14px;
	background-color: var(--ha-panel);
	background-image: var(--ha-panel-ornament);
	background-repeat: no-repeat;
	border: var(--ha-card-edge);
	box-shadow: var(--ha-card-shadow);
	transform: rotate(var(--ha-card-rotate));
	cursor: pointer;

	&:hover {
		filter: brightness(1.04);
	}

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 2px;
	}

	${narrowOrShort} {
		width: ${SMALL_CARD.width};
		height: ${SMALL_CARD.height};
	}
`;

// The round stamp a file carries when it is not for reading. Same shape as the SNIPE control, which
// is the other authorisation in this game.
export const CardSeal = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 104px;
	height: 104px;
	border-radius: 50%;
	border: var(--ha-stamp-edge);
	color: var(--ha-stamp-ink);
	font-size: 12px;
	letter-spacing: var(--ha-track-label);
	text-align: center;
	transform: rotate(-8deg);
	opacity: 0.85;
`;

export const CardWord = styled.span`
	font-family: var(--ha-face-data);
	font-size: 10px;
	letter-spacing: var(--ha-track-label);
	color: var(--ha-ink-dim);
`;

/* ── The placard ───────────────────────────────────────────────────────────────────────────
 * The slip and the finding take turns in this one box, and they are nothing like the same height — a
 * line of chrome against a card. Swapped straight over, the whole board jumped down the screen in a
 * single frame, which reads as a glitch rather than as an answer.
 *
 * So the box measures whatever is in it and travels between the two heights, and the card inside is
 * at full size from the first frame: what clips is the **bottom edge only**, so the sheet is revealed
 * top-down as the room for it opens, the way a document comes out of a folder.
 *
 * Two things about that clip are deliberate. It is `clip-path` rather than `overflow: hidden`, which
 * would need padding to spare the stamp's overhang and the card's shadow — and padding here is height
 * taken off a board that fits an 800x600 window with nothing to spare. And the height travels without
 * overshooting, because every hexagon below is a transparent box projected onto a tile: a box that
 * springs past its mark and comes back moves all 61 of them twice.
 * ------------------------------------------------------------------------------------------- */

// Long enough to read as a movement rather than a jump, short enough that nobody waits for it. A
// number rather than a string because the frame pump that keeps the board in step with it needs the
// same figure — see `StepPlacard`.
export const TRAVEL_MS = 360;

export const Placard = styled.div`
	display: flex;
	/* Not the default stretch, which would be a loop: the box is told its height, and a sheet
	   stretched to fill it would then measure that same height straight back. */
	align-items: flex-start;
	justify-content: center;
	width: 100%;
	/* Bottom edge only: the top and sides are where the stamp and the shadow live. */
	clip-path: inset(-40px -40px 0 -40px);
	/* Soft at both ends. An aggressive ease-out was tried and is wrong for this: it puts the board
	   most of the way down the screen inside three frames, which is the jump again with a tail on it. */
	transition: height ${TRAVEL_MS}ms cubic-bezier(0.4, 0, 0.2, 1);

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

// What is measured. The box itself has a height written on it, so the content cannot be asked how
// tall it is — this is the child that still answers honestly.
export const PlacardSheet = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
`;

/* ── The finding ───────────────────────────────────────────────────────────────────────────
 * What the exercise just proved, in one line, with the page that says it at length.
 *
 * It arrives the way a file lands on a desk: dropped in a little high and a little large, squashed
 * flat on impact, and settled — then the stamp comes down on it hard enough to knock the card once.
 * Cartoon timing, in this room's own vocabulary: the overshoot and the recoil are the whole of it,
 * and there is no glow, no flash and no colour that is not already in the file.
 * ------------------------------------------------------------------------------------------- */

// 520ms all in. The opacity is spent in the first tenth of that on purpose: a card that fades up
// slowly while its own lines are still queued is a blank manila box for a beat, which reads as
// something loading rather than something arriving.
const LAND_MS = 520;

const land = keyframes`
	0%   { opacity: 0; transform: translateY(-22px) scale(1.05); }
	8%   { opacity: 1; }
	/* The desk. A squash on the way in, a stretch on the rebound, and smaller each time. */
	25%  { transform: translateY(0) scaleX(1.035) scaleY(0.92); }
	40%  { transform: translateY(-5px) scaleX(0.99) scaleY(1.03); }
	54%  { transform: translateY(0) scaleX(1.01) scaleY(0.993); }
	62%  { transform: translateY(0) scale(1); }
	/* Where the stamp lands, which the card feels. */
	68%  { transform: translateY(1.5px) scaleX(1.006) scaleY(0.988); }
	80%  { transform: translateY(0) scaleX(0.997) scaleY(1.006); }
	100% { transform: translateY(0) scale(1); }
`;

// A rubber stamp, at the size a rubber stamp comes down from: too big, off angle, and hard. It has to
// finish on the rotation the token asks for, or the chip would snap straight after it landed.
//
// It hits at 55% of its own run, and the delay is set so that moment is the one the card recoils on.
const stamp = keyframes`
	0%   { opacity: 0; transform: rotate(-16deg) scale(1.9); }
	55%  { opacity: 1; transform: rotate(var(--ha-stamp-rotate)) scale(0.93); }
	78%  { transform: rotate(var(--ha-stamp-rotate)) scale(1.03); }
	100% { transform: rotate(var(--ha-stamp-rotate)) scale(1); }
`;

const STAMP_MS = 320;
const STAMP_DELAY_MS = 170;

// Each line of the card catches up in turn, which is the whole of the videogame in this. Close
// together on purpose — a stagger long enough to notice is a stagger long enough to wait through.
const rise = keyframes`
	0%   { opacity: 0; transform: translateY(6px); }
	100% { opacity: 1; transform: translateY(0); }
`;

const RISE_MS = 200;

const risesAt = delay => css`
	animation: ${rise} ${RISE_MS}ms ease-out ${delay}ms both;
`;

/* The card's own contents are declared above it because `Finding` staggers them by name, and a
   component selector is resolved when this module is read rather than when a card is rendered — a
   reference below its use is a ReferenceError at import time, not a rule that quietly misses. */

export const FindingLine = styled.p`
	margin: 4px 0 0;
	text-align: center;
	font-size: 18px;
	line-height: 1.35;
	color: var(--ha-ink);

	${narrowOrShort} {
		font-size: 15px;
	}
`;

// The half of a rule the board has no way of showing. Under the stamped line rather than folded into
// it, so the one that has to be read across a room stays one line long.
export const FindingSmall = styled.p`
	margin: 0;
	max-width: 42ch;
	text-align: center;
	font-size: 13px;
	line-height: 1.45;
	font-style: italic;
	color: var(--ha-ink-dim);
`;

export const FindingNote = styled.span`
	font-family: var(--ha-face-data);
	font-size: 10px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-faint);
`;

// The pages the course never covered, on the card that closes it. Here rather than with the way out
// below, because it is one of the card's own lines and is staggered in with the rest of them.
export const DoneList = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	justify-content: center;
`;

export const Finding = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	width: 100%;
	max-width: 520px;
	margin-top: 6px;
	padding: 18px 20px 14px;
	background: var(--ha-panel);
	border: 1px solid var(--ha-panel-edge);
	box-shadow: var(--ha-panel-shadow);
	/* The card is drawn from its top edge down, because that edge is the one the box is not clipping
	   and the one the sheet appears to come out from. */
	transform-origin: top center;
	animation: ${land} ${LAND_MS}ms cubic-bezier(0.3, 0.85, 0.3, 1) both;

	${FindingLine} {
		${risesAt(60)}
	}

	${FindingSmall},
	${FindingNote} {
		${risesAt(110)}
	}

	${DoneList},
	${Buttons} {
		${risesAt(160)}
	}

	/* Continuous motion is one thing; an entrance is another — but a player who has asked for neither
	   gets the card and none of it. */
	@media (prefers-reduced-motion: reduce) {
		animation: none;

		${FindingLine},
		${FindingSmall},
		${FindingNote},
		${DoneList},
		${Buttons} {
			animation: none;
		}
	}
`;

// The stamp that lands on a passed exercise, overlapping the top edge the way the CEO-buff badge
// does on a rule page.
export const FindingStamp = styled.span`
	position: absolute;
	top: -12px;
	padding: 3px 12px 2px;
	background: var(--ha-panel);
	color: var(--ha-stamp-ink);
	border: var(--ha-stamp-edge);
	font-size: 11px;
	letter-spacing: var(--ha-track-label);
	transform: rotate(var(--ha-stamp-rotate));
	animation: ${stamp} ${STAMP_MS}ms cubic-bezier(0.3, 1.1, 0.4, 1) ${STAMP_DELAY_MS}ms both;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}
`;

/* ── The coach marks ───────────────────────────────────────────────────────────────────────
 * A grease pencil ring round the thing to click, the way an analyst rings a detail on a print.
 *
 * Two rules make this safe. It never takes a pointer event — the hexagon underneath IS the game, and
 * an absolutely positioned box over one would quietly eat the click. And it is drawn in the file's
 * own ink over a cream halo rather than in any of the board's colours: red means "you may go here
 * now", teal and gold mean "and later", and a returning player owns that vocabulary.
 * ------------------------------------------------------------------------------------------- */

const seek = keyframes`
	0%   { transform: scale(1);    opacity: 0.9; }
	55%  { transform: scale(1.18); opacity: 0.2; }
	100% { transform: scale(1);    opacity: 0.9; }
`;

// Above the accuse and reveal screens, which are opaque and cover the table at z-index 900 — the
// ring has to reach the answer they are asking for. Below the drag ghost at 1000, which is the piece
// in the player's hand and belongs on top of everything.
export const MarkLayer = styled.div`
	position: fixed;
	inset: 0;
	z-index: 950;
	pointer-events: none;
`;

const HALO = 'drop-shadow(0 0 1px rgba(20, 15, 5, 0.98)) drop-shadow(0 0 4px rgba(20, 15, 5, 0.75))';

// How round the ring is. Written from the frame loop, because it is the target that decides: a
// hexagon's box wants a circle and a whole card wants a rounded corner, and a fixed 999px turns the
// second into a stadium with the card standing inside it.
const RING = 'var(--ha-training-ring, 999px)';

const target = css`
	&::before,
	&::after {
		content: '';
		position: absolute;
		inset: 0;
		border: 2.5px solid var(--ha-ink-on-accent);
		border-radius: ${RING};
		filter: ${HALO};
	}

	&::after {
		animation: ${seek} 1.6s ease-in-out infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		&::after {
			animation: none;
			opacity: 0.5;
		}
	}
`;

// Not this one. A ring with a bar through it, which needs no word and no colour.
const deny = css`
	&::before {
		content: '';
		position: absolute;
		inset: 0;
		border: 2px dashed var(--ha-ink-on-accent);
		border-radius: ${RING};
		opacity: 0.85;
		filter: ${HALO};
	}

	&::after {
		content: '';
		position: absolute;
		left: 6%;
		right: 6%;
		top: 50%;
		height: 2px;
		background: var(--ha-ink-on-accent);
		transform: rotate(-40deg);
		filter: ${HALO};
	}
`;

// Where a sniper is looking. The real board never draws this — you read it off the cells another
// piece is quietly refused — so it is here to be learnt and nowhere else in the game.
const sight = css`
	&::before {
		content: '';
		position: absolute;
		inset: 8%;
		border: 1px dashed rgba(240, 228, 204, 0.75);
		background: repeating-linear-gradient(-45deg, transparent 0 4px, rgba(240, 228, 204, 0.3) 4px 6px);
		filter: drop-shadow(0 0 2px rgba(20, 15, 5, 0.8));
	}
`;

const MARKS = { target, deny, sight };

export const Mark = styled.div`
	position: fixed;
	left: 0;
	top: 0;
	width: 0;
	height: 0;
	opacity: 0;
	pointer-events: none;

	${({ $kind }) => MARKS[$kind]}
`;

// The one caption on the board, naming the thing the marks above are drawing.
export const MarkTag = styled.div`
	position: fixed;
	left: 0;
	top: 0;
	opacity: 0;
	padding: 2px 7px 1px;
	white-space: nowrap;
	/* Above the cell it names rather than on it: the cells are what the caption is pointing at, and
	   a label laid over them hides the very hatching it is explaining. */
	transform: translate(-50%, -180%);
	background: var(--ha-ink);
	color: var(--ha-ink-on-accent);
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	pointer-events: none;
`;

/* ── The way out, and the way on ───────────────────────────────────────────────────────────── */

// The action bar of the real game, cut down to the one control an exercise needs. `Actions` itself
// is 90vw and three groups wide, which is a bar for a game rather than for a lesson.
export const ExerciseActions = styled.div`
	display: flex;
	justify-content: center;
	gap: 10px;
	width: 100%;
	padding-bottom: 4px;
	z-index: 10;
`;
