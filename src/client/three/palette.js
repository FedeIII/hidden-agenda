// The look, in one place.
//
// Nothing here is invented from scratch. The board colour is the #a1abb7 the CSS hexagons have
// always used, the page sits on #445873, and every team colour is sampled from the edge of that
// team's own token art in public/img — so an extruded token's sides continue the PNG on its face
// instead of arguing with it. The 3D layer is meant to look like the game it replaces, lit.

// No three.js import here on purpose: styled-components read these too, and a palette is not a
// reason to drag a renderer into the flat path. theme/tokens.js is safe for the same reason — it is
// a table of strings and imports nothing but the skin names.
import { DEFAULT_SKIN } from 'Domain/skins';
import { SKIN_PLINTH } from 'Client/theme/tokens';

export const BACKDROP = '#445873';

/**
 * BOARD
 */

export const BOARD = {
	// The tray the tiles are seated in, and the lip around it.
	plinth: '#1a222d',
	plinthEdge: '#42546b',
	// Row 3 cell 3 is the only cell the flat board draws differently — a radial gradient where
	// every other cell is linear. It keeps a mark of its own here.
	centre: '#d8c188',
};

// The plinth is the ONE thing about the board that a skin changes: the surface the tiles are
// seated in, so a blotter, a cyanotype and a milled recess each read as their own table. The tiles,
// the tokens and the trays are settled and identical in all three — and so are the feedback
// colours, because where a piece may go is vocabulary a returning player already owns.
export function boardColors(skin) {
	return { ...BOARD, ...(SKIN_PLINTH[skin] || SKIN_PLINTH[DEFAULT_SKIN]) };
}

// Straight out of hexagon/styledHelpers.js: DARKEN_LEVEL_BY_CELL, applied as level * 6 / 100.
// prettier-ignore
const DARKEN_LEVEL_BY_CELL = [
      [0,  3,  3,  6],
    [3,  2,  4,  2,  3],
  [3,  4,  3,  0,  4,  3],
[6,  2,  0,  0,  3,  2,  0],
  [3,  4,  3,  0,  4,  3],
    [3,  2,  4,  2,  3],
      [0,  3,  3,  6],
];

// The five shades the flat board actually uses, as polished's darken(level * 6 / 100, '#a1abb7')
// resolves them. These are ALBEDO — what the surface is, not what it comes out as. A tile's top
// face now lands within a few percent of its own value, which is the intent: the lit board is the
// flat board with sides on it, and the chequer separates further than the flat one's does because
// the chamfers and walls sit either side of the face. Everything on the board is authored this way,
// so if the whole scene looks too dark or too bright the answer is in lighting.js, not here — this
// is where the colours are decided, not where they are dimmed.
//
// Written out rather than computed, and — more to the point — never applied by multiplying a
// Color: under three.js colour management a Color's channels are LINEAR, so multiplying by 0.64
// does not darken by 36% in the space the value was authored in. It renders the darkest cell at
// roughly #838c96 against an intended #464f5b, and the chequer comes out almost flat.
const TILE_SHADES = {
	0: '#a1abb7',
	2: '#7e8c9c',
	3: '#6d7d8f',
	4: '#606d7d',
	6: '#464f5b',
};

function channels(hex) {
	return [1, 3, 5].map(at => parseInt(hex.slice(at, at + 2), 16));
}

// A plain sRGB blend, which is where these colours were picked.
function mix(from, to, amount) {
	const a = channels(from);
	const b = channels(to);

	return `#${a
		.map((value, i) =>
			Math.round(value + (b[i] - value) * amount)
				.toString(16)
				.padStart(2, '0'),
		)
		.join('')}`;
}

export function tileColors(row, cell) {
	const level = (DARKEN_LEVEL_BY_CELL[row] || [])[cell] || 0;
	const face = TILE_SHADES[level] || TILE_SHADES[0];

	return {
		face,
		// The chamfer runs as one bright unbroken ring around every tile and is most of what says
		// "machined" rather than "coloured shape"; the wall drops well below the face so the two
		// never read as the same surface at different angles.
		chamfer: mix(face, '#dce6f2', 0.34),
		wall: mix(face, '#0b0f14', 0.55),
	};
}

/**
 * TEAMS
 */

// body: sampled from the outer ring of {team}-A.png, so the extruded side continues the face.
// rim: the machined chamfer, and the one place a team gets to be loud — it is what lets a black
// token and a dark red one tell themselves apart across the table.
// collar: the lip at the base. Shared and near-black for three teams and inverted for white,
// because it is not identity, it is separation: a collar wider than the barrel throws a hard dark
// line where the token meets the tile, from every angle, which is what lets a white chip sit on a
// pale tile and a black chip on a dark one. That is a silhouette property, so it survives being
// four pixels tall — where a colour difference does not.
export const TEAM = {
	0: { body: '#3d3843', rim: '#c7d2e3', collar: '#14171d' },
	1: { body: '#4b0313', rim: '#e23048', collar: '#14171d' },
	2: { body: '#bfbcc6', rim: '#2a2d35', collar: '#2a2d35' },
	3: { body: '#3a2f00', rim: '#e9bb1c', collar: '#14171d' },
};

// The HQ card is painted in a team colour today, and that mapping is deliberately contrasted
// rather than literal: the black team's card is white so its pieces read against it. The tray
// keeps that idea.
export const HQ_TRAY = {
	0: { deck: '#8d949f', socket: '#5d646f', frame: '#c8ccd3' },
	1: { deck: '#5e2028', socket: '#3b1219', frame: '#d0293f' },
	2: { deck: '#2a2d34', socket: '#191b20', frame: '#8f959f' },
	3: { deck: '#6b5a1c', socket: '#463a10', frame: '#e9bb1c' },
};

/**
 * FEEDBACK
 */

// Legal destinations are red in the flat board and stay red here: it is the one piece of visual
// vocabulary a returning player already knows.
export const HIGHLIGHT = '#ff3b30';
export const SELECTED = '#ffe9b0';
export const SNIPE = '#ff2d20';
export const BUFF = '#ffd77a';

// The contact shadow tints the shared white fade; the halo tints the same one warm.
export const SHADOW = '#000000';

// Where a piece may be POINTED, which must never share a colour with where it may GO.
export const AIM = '#8fc0ff';

// Which cell the pointer is on. Neutral on purpose: it is not a claim about the game, it is a
// cursor, and it has to coexist with both of the colours above on the same cell.
export const HOVER = '#e8eef7';

// Every coloured ring on a tile gets this immediately outside it. The board runs from #a1abb7 to
// #464f5b, and red on the lightest of those is about 1.5:1 — a bare ring is genuinely hard to see
// on half the cells. One dark shoulder makes one ring work on all of them.
export const KEYLINE = '#161b24';
