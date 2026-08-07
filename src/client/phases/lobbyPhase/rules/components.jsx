import styled, { css } from 'styled-components';
import { narrow } from 'Client/components/breakpoints';
import { Subtitle } from 'Client/components/title';

// The rules read as their own small publication inside the file room — unlike the narrow forms
// either side of them, this one is meant to fill whatever the device gives it: a page of prose
// and photographs reads better wide than boxed into the same 760px a name field was happy with.
//
// The gap is tighter than the rest of the lobby's, and on a phone tighter again: this panel stacks
// four things before the first line of text, so every step of the rhythm here is paid four times.
export const RulesPanel = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	width: 100%;
	padding: 0 28px;

	${narrow} {
		gap: 6px;
		padding: 0 12px;
	}
`;

// The running head: the page's own title with the way on and back either side of it, rather than a
// band of its own for each. A rule page on a phone had 210px of chrome above its first line of
// text — nearly a third of the screen — and this is the largest single piece of that back.
export const PageHead = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	width: 100%;
`;

// The three sit together in the middle rather than the glyphs being pushed to the page's edges: on
// a wide screen the content is 1100px across, and a pair of buttons in the far corners reads as two
// stray controls rather than as the way to turn this page. It shrinks instead of stretching, so a
// long title takes what it needs and the glyphs stay beside it.
export const PageHeadTitle = styled(Subtitle)`
	min-width: 0;
	padding-top: 0;
	padding-bottom: 0;
`;

// Equal on both sides whether or not there is a page to go to, so the title sits on the centre line
// rather than wandering by half a button at the two ends of the book.
const STEP_WIDTH = '34px';

export const HeadStep = styled.span`
	flex: 0 0 ${STEP_WIDTH};

	> button {
		width: 100%;
		padding-left: 0;
		padding-right: 0;
	}
`;

export const RulesIntro = styled.p`
	max-width: 520px;
	text-align: center;
	color: var(--ha-ink-dim);
	font-size: 15px;
	line-height: 1.5;
	margin: 0;
`;

// The one door out of the grouped index, to the summary rather than to a topic — sized and set
// apart so it reads as "the whole game at a glance" rather than a seventh group.
export const CheatSheetLink = styled.button`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2px;
	width: 100%;
	max-width: 420px;
	padding: 10px 16px;
	background: var(--ha-accent-wash);
	border: 1px solid var(--ha-accent);
	border-radius: var(--ha-panel-radius);
	cursor: pointer;
	text-align: center;

	&:hover {
		filter: brightness(1.05);
	}

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 2px;
	}
`;

export const CheatSheetLinkTitle = styled.span`
	font-weight: bold;
	font-size: 15px;
	letter-spacing: var(--ha-track-label);
	color: var(--ha-accent);
`;

export const CheatSheetLinkTeaser = styled.span`
	font-size: 12px;
	color: var(--ha-ink-dim);
`;

// The cheat sheet itself: every rule at a glance rather than start to finish, so it is a grid of
// short sections rather than the single floated column the narrative pages read as. Three columns
// on a desktop-width screen is what keeps eight sections inside one fold; `narrow` drops that back
// to one column and lets a phone scroll, which the "no scrolling" requirement was only ever about
// a desktop window for.
export const CheatGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 8px 20px;
	width: 100%;
	max-width: 1100px;

	${narrow} {
		grid-template-columns: 1fr;
	}
`;

// Every section reads as its own clipping, torn from the sheet above it rather than merely
// spaced apart — a dashed cut line with a small stamped mark riding it, the same "nothing sits
// perfectly square" logic as the exhibit's tape. The grid's rows share a top edge, so this one
// rule reads as a single perforation running under an entire row, not per-section noise.
export const CheatSection = styled.div`
	position: relative;
	break-inside: avoid;
	padding-top: 11px;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		border-top: 1px dashed var(--ha-accent);
		opacity: 0.55;
	}

	&::after {
		content: '✦';
		position: absolute;
		top: -7px;
		left: 50%;
		width: 18px;
		margin-left: -9px;
		background: var(--ha-ground);
		font-size: 10px;
		line-height: 1;
		text-align: center;
		color: var(--ha-accent);
	}
`;

export const CheatHeading = styled.div`
	font-weight: bold;
	font-size: 12px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-accent);
	border-bottom: 1px solid var(--ha-rule);
	padding-bottom: 3px;
	margin-bottom: 4px;
`;

// A lead-in line above a section's list, for the rare section whose bullets are all conditioned
// on one shared clause ("standing next to your own CEO") — saying it once here rather than
// repeating it in every bullet.
export const CheatIntro = styled.p`
	margin: 0 0 3px;
	font-size: 12px;
	line-height: 1.35;
	color: var(--ha-ink);
`;

export const CheatList = styled.ul`
	margin: 0;
	padding-left: 1.1em;
	font-size: 12px;
	line-height: 1.35;
	color: var(--ha-ink);

	li + li {
		margin-top: 3px;
	}

	strong {
		color: var(--ha-accent);
	}

	em {
		font-style: italic;
		color: var(--ha-ink-dim);
	}
`;

export const GroupHeading = styled.div`
	width: 100%;
	padding-top: 10px;
	margin-top: 4px;
	border-top: 1px solid var(--ha-rule);
	font-weight: bold;
	font-size: 13px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink);
	text-align: center;
`;

// The index itself: a stack of file-tab cards, one per topic, each just a door to open.
//
// The groups are deliberately uneven — five pieces, two ways to win — and a grid divides the row
// it is given between however many cards are in it, so *Winning*'s two doors came out nearly three
// times the width of *The Pieces*' five: the same kind of thing twice, reading as two different
// offers. A card sizes itself instead. It takes its share of the row, but no more than a little
// over its own basis, so every group widens together and a short one centres its cards at the
// width the long one arrived at rather than inflating to fill. The gap between those two numbers
// is the whole of the room to expand — widen it and the two-card groups start drifting apart from
// the five again.
export const RuleCardList = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 10px;
	width: 100%;
`;

export const RuleCard = styled.button`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 4px;
	flex: 1 1 220px;
	max-width: 250px;
	text-align: left;
	padding: 10px 12px;
	background: var(--ha-panel);
	border: 1px solid var(--ha-panel-edge);
	border-radius: var(--ha-panel-radius);
	box-shadow: var(--ha-panel-shadow);
	cursor: pointer;
	min-width: 0;

	&:hover {
		border-color: var(--ha-accent);
	}

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 2px;
	}

	/* A phone fits one card a row whatever the numbers say, and there the cap only insets it from
	   the panel it is the only thing in — so it is lifted rather than leaving a card narrower than
	   the cheat-sheet button above it for no reason a reader could see. */
	${narrow} {
		flex-basis: 100%;
		max-width: none;
	}
`;

export const RuleCardTitle = styled.span`
	font-weight: bold;
	font-size: 15px;
	letter-spacing: var(--ha-track-label);
	color: var(--ha-ink);
`;

export const RuleCardTeaser = styled.span`
	font-size: 12px;
	color: var(--ha-ink-dim);
	line-height: 1.4;
`;

// One topic: the photograph floated to one side, the words reading straight past it the way a
// magazine page would rather than boxed off in a column of their own. `overflow: hidden` is a
// plain clearfix — a float contributes nothing to its parent's height on its own, and without
// this the buttons after it would climb up underneath a tall exhibit instead of sitting below it.
export const RuleContent = styled.div`
	width: 100%;
	overflow: hidden;
`;

// Plain block flow on purpose, not a flex column: a flex container is its own formatting context,
// which CSS sizes to clear a float rather than letting the float sit inside it — exactly the
// wrap-around this exists for. Normal paragraphs are what a float actually narrows line by line.
// Margins do the spacing a flex `gap` would otherwise have.
export const RuleBody = styled.div`
	color: var(--ha-ink);
	font-size: 15px;
	line-height: 1.55;

	> * {
		margin: 0 0 10px;
	}

	> *:last-child {
		margin-bottom: 0;
	}

	strong {
		color: var(--ha-accent);
	}

	em {
		font-style: italic;
		color: var(--ha-ink-dim);
	}
`;

// A plain list, not a flex column — list items are already block boxes and stack on their own,
// and \`display: flex\` here would cost this list the same float wrap-around \`RuleBody\` needs.
export const RuleList = styled.ul`
	margin: 0;
	padding-left: 1.1em;

	li + li {
		margin-top: 6px;
	}
`;

// The index's own main menu is always Dossier (see the skins note in CLAUDE.md), and these pages
// only ever render there, so \`--ha-ink\` is not a "some skin" colour here — it is Dossier's own
// near-black ink, every time. That is what "black text" means for a token-driven note.
export const RuleNote = styled.div`
	position: relative;
	/* A block's own background spans its full declared width regardless of a float beside it —
	   only its *inline* content (text) actually narrows to avoid one. \`clear: both\` fixed the
	   overlap that fell out of that (the coloured band painting straight across the exhibit) but
	   overcorrected: it forced the note below the float even when there was room beside it, so it
	   stopped reading as part of the same page. \`display: flow-root\` is the same "establish a
	   new block formatting context" fix — a BFC box shrinks to fit the space beside a float
	   rather than ignoring the float's width outright, so the note sits alongside the exhibit
	   exactly the way a paragraph's *text* does — but unlike \`overflow: hidden\`, a BFC from
	   \`flow-root\` is not also a clipping box, so it does not cut off the CEO Buff badge, which
	   deliberately pokes above the note's own top edge.
	   Stacked explicitly above the exhibit rather than left to \`z-index: auto\`: a positioned
	   box like this one paints after a float by default regardless of DOM order, so without this
	   the badge's overhang could still end up drawn on top of an exhibit it happens to sit near. */
	z-index: 0;
	display: flow-root;
	padding: 8px 12px;
	background: var(--ha-accent-wash);
	border-left: 2px solid var(--ha-accent);
	font-size: 13px;
	font-style: italic;
	color: var(--ha-ink);
`;

// A small stamp overlapping the note's top edge, the same "torn from its own drawer" logic as the
// exhibit's corners of tape — it marks a note as describing the CEO-buff mechanic specifically,
// rather than the game's other asides, without needing a second sentence to say so.
export const BuffBadge = styled.span`
	position: absolute;
	top: -10px;
	left: 14px;
	padding: 2px 9px;
	background: var(--ha-panel);
	border: 1px solid var(--ha-accent);
	border-radius: 3px;
	box-shadow: var(--ha-panel-shadow);
	font-size: 10px;
	font-weight: bold;
	font-style: normal;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-accent);
	transform: rotate(-4deg);
`;

export const RuleTable = styled.table`
	width: 100%;
	border-collapse: collapse;
	font-size: 13px;

	th,
	td {
		padding: 7px 8px;
		border: 1px solid var(--ha-rule);
		text-align: left;
	}

	th {
		background: var(--ha-panel);
		letter-spacing: var(--ha-track-label);
		text-transform: uppercase;
		font-size: 11px;
		color: var(--ha-ink-dim);
	}

	td:first-child {
		font-weight: bold;
		white-space: nowrap;
	}

	strong {
		color: var(--ha-accent);
	}

	em {
		font-style: italic;
		color: var(--ha-ink-dim);
	}
`;

// ─── The exhibit ────────────────────────────────────────────────────────────────────────────────
//
// A screenshot from a real game, mounted the way a file keeps a photograph: a cream card behind
// it standing in for a mat, corners of "tape" holding it down, tilted very slightly off true the
// way nothing in a drawer of case files ever sits perfectly straight, and a typed caption under it
// reading like the note clipped to the back of a print. `$reverse` both leans the tilt the other
// way and floats it the other side, so a page's own photograph doesn't lean toward — or sit on —
// the same side twenty times running, and the paragraphs after it read past it like a magazine
// page rather than sitting boxed off in a column of their own.
export const ExhibitFrame = styled.figure`
	position: relative;
	/* Above a note's own z-index: 0 on purpose — a photograph is the page's primary content, and
	   if the two ever end up close enough to touch (a badge's overhang, a narrow viewport), the
	   exhibit should be the thing left intact rather than whatever happened to paint last. */
	z-index: 1;
	float: ${({ $reverse }) => ($reverse ? 'right' : 'left')};
	width: 380px;
	max-width: 100%;
	margin: ${({ $reverse }) => ($reverse ? '4px 0 14px 22px' : '4px 22px 14px 0')};
	/* No reserved strip at the foot for the caption. This was a flat 68px with the tag absolutely
	   positioned into it — a fixed height for text that wraps, so a caption needing a fourth line
	   simply grew upwards over the photograph, which two pages did on a phone. The tag flows now
	   and the mat sizes to whatever it is actually carrying. */
	padding: 10px;
	background: var(--ha-panel);
	border: 1px solid var(--ha-panel-edge);
	box-shadow:
		var(--ha-panel-shadow),
		3px 5px 12px rgba(20, 15, 5, 0.35);
	transform: rotate(${({ $reverse }) => ($reverse ? '1.1deg' : '-1.1deg')});

	${narrow} {
		float: none;
		width: 100%;
		margin: 4px 0 14px;
		transform: rotate(${({ $reverse }) => ($reverse ? '0.6deg' : '-0.6deg')});
	}
`;

export const ExhibitTape = styled.span`
	position: absolute;
	top: -7px;
	${({ $side }) => ($side === 'left' ? 'left: 14px;' : 'right: 14px;')}
	width: 34px;
	height: 16px;
	background: rgba(241, 224, 213, 0.82);
	border: 1px solid rgba(90, 70, 36, 0.35);
	box-shadow: 1px 1px 2px rgba(20, 15, 5, 0.25);
	transform: rotate(${({ $side }) => ($side === 'left' ? '-6deg' : '6deg')});
`;

export const ExhibitImage = styled.img`
	display: block;
	width: 100%;
	height: auto;
	border: 1px solid rgba(44, 38, 32, 0.4);
	cursor: zoom-in;
`;

// The fullscreen reading of a print — every exhibit here is a crop, small on purpose, and small
// on purpose still means "too small to read the board from" on a phone. A dark scrim rather than
// the page's own manila, since the photograph needs the contrast, not another texture behind it.
export const LightboxOverlay = styled.div`
	position: fixed;
	inset: 0;
	z-index: 100;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 32px;
	background: rgba(10, 8, 4, 0.86);
	cursor: zoom-out;
`;

export const LightboxImage = styled.img`
	display: block;
	max-width: min(92vw, 1100px);
	max-height: 86vh;
	width: auto;
	height: auto;
	border: 1px solid rgba(0, 0, 0, 0.4);
	box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
	cursor: default;
`;

export const LightboxHint = styled.div`
	position: fixed;
	left: 0;
	right: 0;
	bottom: 18px;
	z-index: 101;
	text-align: center;
	font-size: 12px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: rgba(240, 230, 210, 0.75);
	pointer-events: none;
`;

// A short run of tightly-cropped plays mounted in one wider mat instead of scattered separate
// prints — a piece's page wants "how it moves" and "how it kills" (or a whole four-beat sequence)
// read together, not scattered to opposite margins of the paragraph. Everything else about the
// mat (the tape, the tilt, the caption tag) is the same `ExhibitFrame` shape, just wide enough for
// however many frames this page needs — two side by side, or a 2×2 block once there are more.
// \`$full\`: some pages (a five-beat sequence, a whole board) read better as a strip spanning the
// full column, after the words rather than floated beside them — the pictures ARE the point on
// those pages, not an illustration accompanying prose. Not floated, no tilt: a full-width print
// reads as a filmstrip, and a filmstrip that leans is just crooked.
export const ExhibitPairFrame = styled(ExhibitFrame)`
	width: ${({ $count, $full }) => {
		if ($full) return 'auto';
		if ($count === 3) return '660px';
		if ($count >= 4) return '560px';
		return '460px';
	}};

	${({ $full }) =>
		$full &&
		css`
			float: none;
			/* \`auto\` rather than a fixed 100% — a lone full-width exhibit still fills its block
			   container the way any block-level \`<figure>\` does with no width set, but this is
			   also what lets several of them share a row: inside \`ExhibitGroupRow\`'s flex context,
			   \`flex: 1\` divides the space evenly instead of every one of them claiming 100% and
			   wrapping onto its own line. */
			flex: 1 1 0;
			min-width: 0;
			margin: 16px 0 4px;
			transform: none;
		`}
`;

// Several full-width exhibits sharing one row instead of stacking — Taking Control's claim-and-
// deploy beat and its reveal beat are two independent stories, not one long filmstrip, so they
// read better side by side than one on top of the other. Narrow screens still stack: two halved
// board photographs would otherwise be too small to read.
export const ExhibitGroupRow = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 16px;
	width: 100%;

	${narrow} {
		flex-direction: column;
	}
`;

// Three sits in one row, same as two — it is four that wants a 2×2 block instead of a strip too
// narrow for its own captions. \`$full\` has the room to just lay every frame in one row.
export const ExhibitPairRow = styled.div`
	display: grid;
	grid-template-columns: repeat(${({ $count, $full }) => ($full ? $count : $count >= 4 ? 2 : $count)}, 1fr);
	gap: 8px;
`;

export const ExhibitPairColumn = styled.div`
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

export const ExhibitPairLabel = styled.span`
	font-size: 10px;
	font-weight: bold;
	text-align: center;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-dim);
`;

export const ExhibitTag = styled.figcaption`
	display: flex;
	flex-direction: column;
	gap: 1px;
	margin-top: 10px;
`;

export const ExhibitLabel = styled.span`
	font-size: 10px;
	font-weight: bold;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-accent);
`;

export const ExhibitCaption = styled.span`
	font-size: 11px;
	color: var(--ha-ink-dim);
	line-height: 1.3;
`;
