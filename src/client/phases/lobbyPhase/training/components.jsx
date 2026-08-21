import styled, { css, keyframes } from 'styled-components';
import { narrow, narrowOrShort, short } from 'Client/components/breakpoints';
import { Button } from 'Client/components/button';
import HQs from 'Client/components/hqs';
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
// none` and no box in this tree paints a fill over the table — the WebGL canvas is a sibling of
// `.game` and sits *under* it, so a fill there is a filter over the table rather than a surface
// behind it. The mat below is therefore an outline and nothing more.
//
// The screen holds two things, and a learner must never confuse them:
//
// - **The folder** is the course. It is paper: manila stock, a tab, a shadow. It says what to do and
//   what just happened. Its controls are BLACK INK.
// - **The mat** is the game. It is an outline on the desk with a dark tab, and it holds the real
//   turn strip, the real board, the real HQ cards and the real action buttons. Its controls are RED,
//   because they are the game's own.
//
// **Red is the game. Ink is the course.** That is the whole of the vocabulary, and it costs nothing
// to keep: a control reads its colour from the `--ha-control-*` tokens, so `Cta` and `NavLink` below
// re-declare those tokens on themselves rather than restyling the shared `Button`. The record boxes
// and the coach marks were already ink, so the rule was half true before it was written down.

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

/* ── The folder ────────────────────────────────────────────────────────────────────────────
 * The course, as one sheaf of paper on the desk.
 *
 * Before this, the course was four loose bands of type directly on the ground: three stamp buttons,
 * a title, a record and a slip. Nothing said where the tutorial stopped and the game started,
 * because the tutorial had no edges. It has edges now, and everything it owns is inside them.
 *
 * It carries a tab and no punch holes, unlike the card backs and the rules index's training file.
 * The holes are a fixed 22% and 78% along the top of whatever they are on, and on a box this wide
 * and this shallow both of them landed in the head row — one of them directly over the first letter
 * of the exercise's title.
 * ------------------------------------------------------------------------------------------- */

export const Briefing = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	/* Centred, not stretched. The head, the foot and the placard all ask for the full width anyway;
	   what needs this is the card that closes the course, which is 520px inside an 820px folder and
	   sat against the left edge while the folder stretched it. */
	align-items: center;
	gap: 4px;
	width: 100%;
	/* Wide enough that the longest step in either language keeps its order and its note on one line.
	   The widest is Spanish — DESPLEGAR beside a 38-character note — and it needs 764px of line. Below
	   that the note wraps onto a second line, which the placard slides the board down for rather than
	   jumping. (No backticks in a comment inside a styled template: they close it.) */
	max-width: 820px;
	margin-top: 9px;
	padding: 9px 18px 6px;
	background: var(--ha-panel);
	border: 1px solid var(--ha-panel-edge);
	box-shadow: var(--ha-panel-shadow);

	${narrowOrShort} {
		gap: 3px;
		padding: 9px 10px 5px;
	}
`;

// The tab of the folder, on the top edge the way the finding's stamp is. It names the room the
// learner is in, so the title below is free to name only the exercise.
export const BriefingTab = styled.span`
	position: absolute;
	top: -10px;
	left: 16px;
	padding: 2px 10px 1px;
	background: var(--ha-panel);
	border: 1px solid var(--ha-panel-edge);
	border-bottom: 0;
	color: var(--ha-ink-dim);
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;

	${narrowOrShort} {
		left: 10px;
	}
`;

// Which exercise this is, and how the course is going. One row, because every band above the board
// is a band taken off it — and on the 800x600 screen the specs are pinned to the board has none to
// spare.
export const BriefingHead = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
	flex-wrap: wrap;
	width: 100%;
`;

export const BriefingWho = styled.div`
	display: flex;
	align-items: baseline;
	gap: 8px;
	flex-wrap: wrap;
	min-width: 0;
`;

export const Eyebrow = styled.span`
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-faint);
	white-space: nowrap;
`;

export const TrainingHead = styled(Subtitle)`
	padding: 0;
	color: var(--ha-ink);
	font-weight: bold;
	font-size: 17px;
	text-align: left;

	${narrowOrShort} {
		padding: 0;
		font-size: 14px;
	}
`;

// The way out, at the foot of the folder and under a rule of its own.
//
// These were three rubber stamps at the top of the screen, the same red and the same size as SNIPE
// and NEXT TURN — so the loudest controls on a lesson were the three that leave it. They are quiet
// ink links now, which is what a way out should be: findable, and never mistaken for the task.
export const BriefingFoot = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	flex-wrap: wrap;
	width: 100%;
	padding-top: 4px;
	border-top: 1px solid var(--ha-rule);
`;

export const NavLink = styled.button`
	padding: 1px 2px;
	background: transparent;
	border: 0;
	border-bottom: 1px solid var(--ha-rule);
	color: var(--ha-ink-dim);
	font-family: var(--ha-face-data);
	font-size: 11px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	cursor: pointer;

	&:hover {
		color: var(--ha-ink);
		border-bottom-color: var(--ha-ink);
	}

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 2px;
	}
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
 * Ten boxes, initialled as they are passed, and the way back to any of them. It is the pager as
 * well as the progress: the rule pages step one at a time because they are a book, and this is a
 * course, where the exercise you want next is not always the one after this one.
 *
 * It is deliberately the quietest thing in the folder. Ten small squares are ten controls, and the
 * one control that matters on a lesson is out on the board — so these are hairlines until they are
 * passed, and the boxes are smaller than they were.
 * ------------------------------------------------------------------------------------------- */

export const Record = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
	flex-wrap: wrap;
	justify-content: flex-end;
`;

export const RecordLabel = styled.span`
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-faint);
`;

// The initials box off the routing slip, made into a control. Filled in ink once an exercise has
// been passed, ruled in ink while it is the one on the desk.
//
// The current one used to be outlined in the accent, which put a red mark in the folder — and red is
// the game's colour here, so the box read as one of the board's own controls.
const recordState = ({ $done, $current }) => {
	if ($current) {
		return css`
			color: var(--ha-ink);
			border-color: var(--ha-ink);
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
	font-size: 10px;
	line-height: 1;
	width: 18px;
	height: 17px;
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
 * What to do, and why. The typed order in the middle of the folder, and the one thing on the screen
 * a learner has to read — so it is the largest thing the folder holds.
 *
 * The hint used to be twelve pixels of dim italic tucked in beside the stamp, which made it the
 * smallest type on a screen carrying nine controls. It is fourteen pixels of full-strength ink now,
 * and it is the sentence that says what the stamped verb means.
 *
 * Wide, the pair share a line and the stamp is the tallest thing on it, so the box is the same
 * height on every step of every exercise. Narrow, the hint takes a line of its own — and that line
 * is **kept whether or not the step has a hint**. It is seventeen pixels of nothing on the steps
 * that do not, and the price of taking them back is the whole board stepping up and down the screen
 * between one click and the next.
 *
 * The line is set from the left, not centred, and the step count has a width of its own. Centred, the
 * stamp moved a hundred and sixty pixels sideways between a step with a hint and a step without one,
 * and seventeen more between step 9 and step 10. It is the loudest thing on the screen and it should
 * be in the same place every time it is read. A form's fields are left-aligned anyway.
 *
 * On a screen too narrow for the pair — a phone, or a window under about 900px with the Spanish
 * catalog on — the hint wraps to its own line and the box grows by one. That is a movement rather
 * than a jump, because the placard measures it and slides the board with it, and it happens between
 * one step and the next rather than under a click. It is why `Briefing` is as wide as it is.
 * ------------------------------------------------------------------------------------------- */

export const Slip = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	padding: 1px 0 3px;
`;

export const SlipLine = styled.div`
	display: flex;
	align-items: center;
	gap: 6px 14px;
	flex-wrap: wrap;
	width: 100%;
`;

// A width of its own, so STEP 10 / 12 leaves the stamp exactly where STEP 1 / 12 did.
export const SlipKey = styled.span`
	flex: none;
	min-width: 86px;
	text-align: right;
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-faint);
	font-variant-numeric: tabular-nums;

	${narrowOrShort} {
		min-width: 74px;
	}
`;

// The verb, stamped. Written in capitals in the script rather than uppercased here, so what a spec
// reads with `textContent` and what a player reads off the screen are the same string.
//
// Stamped in INK, not in the accent the other stamps in this skin use. A red stamp here sat two
// inches above the red stamp that says SNIPE and looked like a second one of it. The double rule is
// the same one `--ha-stamp-edge` draws, in the folder's own colour.
export const Verb = styled.strong`
	padding: 3px 16px 2px;
	font-size: 24px;
	font-weight: 400;
	letter-spacing: var(--ha-track);
	color: var(--ha-ink);
	border: 2px double var(--ha-ink);
	transform: rotate(var(--ha-stamp-rotate));
	white-space: nowrap;

	${narrowOrShort} {
		font-size: 18px;
		padding: 2px 10px 1px;
	}
`;

// Beside the stamp where there is room for it, and on a line of its own where there is not — a line
// that is there whether or not this step has a hint. See the note above `Slip`.
// `narrow` and not `narrowOrShort`: what decides whether the hint fits beside the stamp is the width
// of the screen, and a phone on its side has plenty. Stacking it there cost twenty pixels of the
// shortest screen the game runs on.
export const HintSlot = styled.div`
	display: flex;
	align-items: center;
	min-width: 0;

	${narrow} {
		/* Its own line, and the full width of it. Indented under the stamp instead, the longest hint
		   in either language came two pixels short of fitting and wrapped — which moves the board. */
		flex: 0 0 100%;
		min-height: 17px;
	}
`;

export const Hint = styled.em`
	max-width: 46ch;
	font-style: italic;
	font-size: 14px;
	line-height: 1.25;
	color: var(--ha-ink);

	${narrowOrShort} {
		font-size: 13px;
	}
`;

/* ── The mat ───────────────────────────────────────────────────────────────────────────────
 * The game, ruled off from the course.
 *
 * Everything inside this box is real: the real turn strip, the real board, the real HQ cards, the
 * real SNIPE, REVEAL, ACCUSE and CLAIM. Everything outside it belongs to the tutorial. That line was
 * not drawn anywhere before, and without it a red NEXT TURN and a red START OVER were the same
 * control to anybody meeting the game for the first time.
 *
 * It is an outline and a tab and nothing else. A fill here would paint over the WebGL canvas, which
 * sits under `.game` and is where the board's dark recess is drawn — see the note at the top of this
 * file. The inset ring is safe because it paints inside the padding, which the board never reaches.
 * ------------------------------------------------------------------------------------------- */

export const Mat = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	/* Wide enough for HQ | board | HQ, and no wider. The lesson with no board at all is snug instead —
	   an empty three-foot mat behind two playing cards reads as a mistake. (No backticks in this
	   comment: they close the template, and the parse error names the CSS rather than the quote.) */
	max-width: ${({ $snug }) => ($snug ? '560px' : '1010px')};
	/* The top padding clears the tab on the edge above it *and* the file tab an HQ card wears on its
	   own top corner, which overhangs the card by a few pixels. The lesson with four HQ cards stands
	   them flush with the top of the mat, and at 9px the two labels sat on top of each other. */
	padding: 15px 10px 8px;
	border: 1px solid var(--ha-well-edge);
	box-shadow: inset 0 0 0 2px rgba(28, 43, 37, 0.11);

	${narrowOrShort} {
		padding: 13px 6px 7px;
	}
`;

// The dark chip that names the table, on the mat's own top edge the way the folder's tab and the
// finding's stamp are on theirs. On the edge rather than in a row of its own because a row here is
// twenty pixels off a board that fits an 800x600 window with nothing to spare.
//
// Well colour and cream type, which is the board's own pairing — so the label looks like the thing it
// labels.
export const MatTab = styled.span`
	position: absolute;
	top: -9px;
	left: 14px;
	display: inline-flex;
	align-items: center;
	gap: 7px;
	max-width: calc(100% - 28px);
	padding: 2px 9px 1px;
	background: var(--ha-well);
	border: 1px solid var(--ha-well-edge);
	color: var(--ha-ink-on-accent);
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	white-space: nowrap;
	overflow: hidden;

	${narrowOrShort} {
		left: 8px;
		gap: 5px;
		padding: 2px 7px 1px;
		max-width: calc(100% - 16px);
	}
`;

// The legend, and the only one on the screen: a ring in the coach marks' own cream, on the coach
// marks' own dark ground. It says what the rings out on the board are without naming them.
export const MatRing = styled.span`
	display: block;
	flex: none;
	width: 9px;
	height: 9px;
	border: 1.5px solid var(--ha-ink-on-accent);
	border-radius: 50%;
`;

// The standing instruction, in the same chip as the label and dimmer than it. One sentence, said
// once, rather than a word added to every step: the marks are the vocabulary the course teaches by
// using, and this is the only place it is spelled out.
export const MatNote = styled.span`
	padding-left: 7px;
	border-left: 1px solid rgba(240, 228, 204, 0.35);
	color: rgba(240, 228, 204, 0.62);
	overflow: hidden;
	text-overflow: ellipsis;
`;

/* ── The table ─────────────────────────────────────────────────────────────────────────────
 * The real board, in a shorter box. `Board` is 90vw by 75vh because a game is the whole screen;
 * here it shares the screen with the folder above it and with the mat's own edges.
 * ------------------------------------------------------------------------------------------- */

export const TrainingBoard = styled(Board)`
	width: 100%;
	max-width: 1000px;
	margin-bottom: 4px;

	/* Whatever the chrome above and below it is not using, measured rather than guessed.
	   318px sits above the board on every lesson: the lobby's title band, the folder, the mat's top
	   edge and the turn strip. What is below it depends on the lesson — 12px of mat edge, plus 32px
	   more where there is an action bar — so $bar carries the difference rather than every lesson
	   paying for a button seven of them do not have.

	   That makes the whole of a lesson visible at 800x600, including the one control it presses. The
	   old single figure claimed as much and missed it by 37 pixels: SNIPE was below the fold on the
	   one exercise that asks for it.

	   Deliberately NOT in the subtraction: the lobby's own 24px of bottom padding. Buying that back
	   costs board on every small screen, and what falls past the fold instead is a margin.

	   The cap is the old board's height, so nothing above 800px tall changed. */
	${({ $bar }) => css`
		height: clamp(200px, calc(100vh - ${$bar ? 362 : 330}px), 416px);

		/* Repeated rather than inherited: Board sets its own height inside both breakpoints, and a
		   rule out here would be beaten by the more specific media block it came from. A phone on its
		   side has no room above the board at all, so it gets the minimum whatever the lesson. */
		${short} {
			height: clamp(170px, calc(100vh - ${$bar ? 320 : 288}px), 416px);
			margin-bottom: 2px;
		}
	`}

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

	/* A lesson that uses one team a side puts both trays *under* the board on a phone, rather than
	   one above it and one below. Stacked the game's way, the tray on top is the full width of the
	   screen — and an HQ card is square, so it is also the full height of one, which pushed the very
	   table the lesson is about off the bottom of the screen.

	   Each tray is half the row whether the lesson uses one or two, so the card is the same width,
	   and therefore the same height, in every lesson: the board sits at one place on the screen for
	   the whole course. A lesson that uses four is already two halves above and two below and is
	   left alone. */
	${({ $compact }) =>
		$compact &&
		css`
			${narrow} {
				flex-flow: row wrap;
				align-items: flex-start;
				column-gap: 8px;

				${TableBoardStyled} {
					order: 1;
				}

				${HQs} {
					order: 2;
					width: calc(50% - 4px);
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
	gap: 10px;
	justify-content: center;
`;

/* ── The one loud control ──────────────────────────────────────────────────────────────────
 * A finished exercise has exactly one thing to press, and this is it: NEXT, or FINISH on the last
 * one, or PLAY NOW on the card that closes the course.
 *
 * It is the game's own `Button`, so it keeps the `active` gate, the disabled semantics and the focus
 * ring every other control in the app has. What it changes is the four tokens that decide the
 * colour, and it changes them ON ITSELF — a filled block of ink instead of an outlined red stamp.
 * Two reasons, and both are the point of this screen:
 *
 * - Red belongs to the game. This button is the course speaking.
 * - It is the only filled control in the folder, so it cannot be missed, and nothing beside it
 *   competes: READ THE FILE and the two page links are `QuietLink`s.
 * ------------------------------------------------------------------------------------------- */

export const Cta = styled(Button)`
	--ha-control-ink: var(--ha-ink-on-accent);
	--ha-control-bg: var(--ha-ink);
	--ha-control-edge: 2px solid var(--ha-ink);
	--ha-control-ink-shadow: none;
	--ha-control-shadow: 2px 2px 0 rgba(44, 38, 32, 0.28);
	--ha-control-shadow-hover: 3px 3px 0 rgba(44, 38, 32, 0.34);
	--ha-control-rotate: -0.7deg;
	/* The press. Inherited by nothing, since the button holds only its own word. */
	--ha-accent-wash: rgba(44, 38, 32, 0.65);

	font-size: 19px;
	padding: 7px 22px;

	${narrowOrShort} {
		font-size: 16px;
		padding: 6px 18px;
	}
`;

// Everything else the course offers: read the page this came from, go back to the index, open one of
// the two pages the course never covered. All of them are worth having and none of them is the task,
// so all of them are a line of type with a rule under it.
export const QuietLink = styled.button`
	padding: 1px 2px;
	background: transparent;
	border: 0;
	border-bottom: 1px solid var(--ha-rule);
	color: var(--ha-ink-dim);
	font-family: var(--ha-face-data);
	font-size: 12px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	cursor: pointer;

	&:hover {
		color: var(--ha-ink);
		border-bottom-color: var(--ha-ink);
	}

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 2px;
	}
`;

// The CTA and its quiet neighbours, stacked rather than in a row: side by side at the same height
// they read as a pair of choices, which is what this card is trying to stop doing.
export const FindingActions = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	padding-top: 2px;
`;

export const Finding = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	width: 100%;
	max-width: 520px;
	margin-top: 4px;
	padding: 18px 20px 14px;
	/* Cream, not manila. The card lands inside the folder now, and manila on manila was a sheet with
	   an edge drawn round it rather than a sheet. */
	background: var(--ha-ink-on-accent);
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
	${FindingActions} {
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
		${FindingActions} {
			animation: none;
		}
	}
`;

// The stamp that lands on a passed exercise, overlapping the top edge the way the CEO-buff badge
// does on a rule page. In ink, like the verb it replaces and for the same reason.
export const FindingStamp = styled.span`
	position: absolute;
	top: -12px;
	padding: 3px 12px 2px;
	background: var(--ha-ink-on-accent);
	color: var(--ha-ink);
	border: 2px double var(--ha-ink);
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

/* ── The game's own action bar ─────────────────────────────────────────────────────────────── */

// The action bar of the real game, cut down to the one control an exercise needs. `Actions` itself
// is 90vw and three groups wide, which is a bar for a game rather than for a lesson.
//
// It sits inside the mat, under the board, where the real bar sits. That is the whole reason the mat
// exists: SNIPE used to float on the desk below the table, the same red stamp and the same size as
// the three tutorial buttons at the top of the screen.
export const ExerciseActions = styled.div`
	display: flex;
	justify-content: center;
	gap: 10px;
	width: 100%;
	padding-top: 2px;
	z-index: 10;
`;
