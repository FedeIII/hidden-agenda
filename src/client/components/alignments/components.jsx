import styled, { css } from 'styled-components';
import { narrowOrShort } from 'Client/components/breakpoints';

// A card carries THREE facts and needs a channel for each: whether it is the friend or the foe, which
// team it names, and what that does to your score. The green and red are the alignment and have been
// since the first version — that coding is not up for renegotiation — so the team gets marks of its
// own instead of sharing one: a block over the width of the card, and a chip of the colour called out
// underneath the way a material is called out. Each direction puts them where its own material would.
//
// The composition is the study's: the word in the top corner, the team in the middle, and what the
// alignment costs or pays along the bottom. The card is `space-between`, so an unrevealed one — where
// there is no team yet — still reads as a card with a corner label and a footnote rather than as one
// word floating in the middle of a coloured rectangle.
//
// The team colours come from the tokens rather than TEAM_COLORS, which are the raw CSS keywords
// `black` / `red` / `white` / `yellow`. Those are the same four names the *pieces* use, and on a
// card they have the same problem the tokens exist to solve: a black chip and a dark red one do not
// tell themselves apart on fill, which is why every block also carries a hairline of the team's rim.

const cardColor = ({ alignment }) => (alignment === 'friend' ? 'var(--ha-friend)' : 'var(--ha-foe)');

const brightness = ({ disabled }) => {
	if (!disabled) {
		return css`
			filter: brightness(1.2);
		`;
	}
};

const teamTab = ({ team }) => {
	if (team === undefined || team === null) {
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

// The block the team's name is over-printed on. A percentage rather than a colour, for the reason
// spelled out on the label below: Blueprint mixes the fill away to nothing because a drawing cannot
// print a colour — it names it and calls the finish out separately — while the other two fill it.
//
// The ink is the exception that has to be a fallback rather than a token: it is the team's own ink in
// two of the three, and a token on :root cannot reach a per-card variable.
const cardTeamColor = ({ team }) => {
	if (team === undefined || team === null) {
		return;
	}

	return css`
		background-color: color-mix(in srgb, var(--ha-team-${team}) var(--ha-card-team-fill), transparent);
		background-image: var(--ha-team-overlay);
		color: var(--ha-card-team-ink, var(--ha-team-${team}-ink));
	`;
};

// The chip, and the one shadow list in the app assembled from both sides: the hairline needs the
// team, so the component writes it, and the bevel and the glow are the direction's, so they arrive as
// tokens. Every entry is a real shadow even where a direction wants none — `none` inside a
// comma-separated list is a parse error, which would take the hairline down with it.
const chipColor = ({ team }) => {
	if (team === undefined || team === null) {
		return;
	}

	return css`
		background-color: var(--ha-team-${team});
		box-shadow:
			inset 0 0 0 1px var(--ha-team-${team}-line),
			var(--ha-card-chip-inner),
			0 0 8px color-mix(in srgb, var(--ha-team-${team}) var(--ha-card-chip-glow), transparent);
	`;
};

export const Alignments = styled.div`
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	gap: 16px;
	/* The phase centres its column, so without a width of its own this row shrinks to its content
	   and space-evenly has nothing to distribute — the two cards end up edge to edge. */
	width: 100%;
	margin: 40px;

	${narrowOrShort} {
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		max-width: 100%;
	}
`;

export const AlignmentCardStyled = styled.div`
	position: relative;
	width: 200px;
	height: 324px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 14px;
	background-color: ${cardColor};
	/* The skin's own material, laid over the alignment colour rather than replacing it: carbon
	   flimsy, a cyanotype sheet, a dark plate. */
	background-image: linear-gradient(var(--ha-card-bg-mix), var(--ha-card-bg-mix));
	border: var(--ha-card-edge);
	box-shadow: var(--ha-card-shadow);
	transform: rotate(var(--ha-card-rotate));
	cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};

	${teamTab}

	&:hover {
		${brightness}
	}
`;

// The word, in the top corner where a file, a sheet and a case all put the thing they are. An <i>
// rather than a <span> so a spec reaching for the team block by tag still finds the team block.
//
// It used to be the same white label in all three directions — the one thing on the card that had no
// look of its own. Each of them now says it the way its own material would: Dossier types it on the
// flimsy and rules it underneath, Blueprint reverses it out of a filled tab and numbers it like a
// figure on a sheet, Vault sets it on a small enamelled tag with a bevel.
//
// The chip IS the alignment colour rather than a colour of its own, which is why the fill and the
// tint are percentages: a direction that types the word instead mixes the fill away to nothing and
// mixes the same colour into its ink. That colour arrives as an interpolation rather than as a token
// because a var() inside a custom property resolves where the property is DECLARED — one written on
// :root would look for the card's alignment on :root, find nothing, and drop the whole declaration
// silently. Same trap the HQ tab's fill is written around.
const figure = ({ alignment }) => (alignment === 'friend' ? 'var(--ha-card-fig-friend)' : 'var(--ha-card-fig-foe)');

export const AlignmentLabel = styled.i`
	align-self: flex-start;
	font-style: normal;
	font-family: var(--ha-face);
	font-weight: var(--ha-card-label-weight);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	background: color-mix(in srgb, ${cardColor} var(--ha-card-label-fill), transparent);
	color: color-mix(in srgb, ${cardColor} var(--ha-card-label-tint), var(--ha-card-label-ink));
	padding: var(--ha-card-label-pad);
	border-radius: var(--ha-card-label-radius);
	/* A colour, never a width: the rule is Dossier's typed underline and the other two set it
	   transparent, so the word occupies the same box in all three. */
	border-bottom: var(--ha-card-label-rule);
	box-shadow: var(--ha-card-label-shadow);

	/* A pseudo-element rather than a word in the component, so the figure number is the direction's
	   business and not the card's. Playwright reads text with textContent, which does not see this. */
	&::before {
		content: ${figure};
	}
`;

// The team and its colour, as one group, so `space-between` puts the pair in the middle of the card
// rather than distributing three things down it.
export const AlignmentBody = styled.div`
	align-self: stretch;
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

export const AlignmentTeam = styled.span`
	display: block;
	font-family: var(--ha-face);
	font-weight: bold;
	font-size: 22px;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	text-align: center;
	padding: 9px 4px;
	/* Ruled above and below and running the full width in two of the three: a typed page and a
	   drawing both rule a field rather than boxing it, and only the case has a bezel all round. */
	border-top: var(--ha-card-team-edge);
	border-bottom: var(--ha-card-team-edge);
	border-left: var(--ha-card-team-side);
	border-right: var(--ha-card-team-side);
	border-radius: var(--ha-card-team-radius);
	box-shadow: var(--ha-card-team-shadow);
	${cardTeamColor}

	${narrowOrShort} {
		font-size: 18px;
	}
`;

// The colour called out as a material: a chip of it with a caption, which is how a colour is named on
// a typed page, on a drawing and on a plate. Each direction captions it its own way — a colour of
// record, a finish reference, an anodising — so the caption is a token and the two lines the caption
// can carry are gated by one.
export const AlignmentSwatch = styled.div`
	display: flex;
	align-items: center;
	gap: 9px;
	font-family: var(--ha-face-data);
	font-size: 7.5px;
	letter-spacing: 0.15em;
	line-height: 1.35;
	text-transform: uppercase;
	color: var(--ha-card-note-ink);
	background: var(--ha-card-swatch-bg);
	border: var(--ha-card-swatch-edge);
	border-radius: var(--ha-card-swatch-radius);
	box-shadow: var(--ha-card-swatch-shadow);
	padding: var(--ha-card-swatch-pad);
`;

// A span rather than the <i> the study used, because the label above is the card's only <i> and a
// spec reaching for the word by tag should not have to know which <i> it wanted.
export const AlignmentChip = styled.span`
	display: block;
	flex: none;
	width: var(--ha-card-chip-size);
	height: var(--ha-card-chip-size);
	border-radius: var(--ha-card-chip-radius);
	/* Half hatched where a direction has to admit it is specifying a colour rather than printing it. */
	background-image: var(--ha-card-chip-overlay);
	transform: rotate(var(--ha-card-chip-rotate));
	${chipColor}
`;

export const AlignmentSwatchLabel = styled.span`
	display: block;

	&::before {
		content: var(--ha-card-swatch-key);
		display: block;
	}
`;

// The second line, which is the same fact said two ways: a drawing references a part by number, a
// plate is engraved with a name. A direction shows one of them or neither.
export const AlignmentSwatchRef = styled.span`
	display: var(--ha-card-swatch-ref);
`;

export const AlignmentSwatchName = styled.span`
	display: var(--ha-card-swatch-name);
`;

// What the alignment does to your score. It is the whole of what friend and foe mean, it is the one
// thing a player meeting the game has no way to infer from a colour, and the card had never said it.
export const AlignmentFoot = styled.span`
	align-self: stretch;
	font-family: var(--ha-face-data);
	font-size: 8.5px;
	letter-spacing: 0.16em;
	line-height: 1.4;
	text-transform: uppercase;
	color: var(--ha-card-note-ink);
`;
