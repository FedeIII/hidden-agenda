import { CELLS_BY_ROW, ROW_NUMBERS } from 'Domain/cells';
import { TYPES } from 'Domain/pieces/constants';

// Where everything sits in 3D, in board units. Pure arithmetic, no three.js — the scene builds
// from it and so does the DOM overlay, which is the whole reason it lives on its own: the
// invisible hexagon a click lands on and the tile a player sees have to be the same hexagon.
//
// The grid is pointy-top: a vertex at the top, flat sides left and right, so the six neighbours
// sit E, W, NE, NW, SE, SW. That is not a guess — it is what the game already encodes. The CSS
// rotations in pieceStyled.js put direction [0,0] (right) at 90deg and [1,0] (up-right) at 30deg,
// i.e. neighbours every 60deg starting 30deg off north, which is exactly a pointy-top ring.

const { AGENT, CEO, SPY, SNIPER } = TYPES;

// Circumradius: centre to vertex. Everything else is expressed as a multiple of it, so changing
// this one number rescales the board without moving anything relative to anything else.
export const R = 1;

// Centre-to-centre along a row, and between rows. For a pointy-top hexagon these are the short
// diagonal and three quarters of the long one.
export const COLUMN_PITCH = Math.sqrt(3) * R;
export const ROW_PITCH = 1.5 * R;

const MIDDLE_ROW = 3;

// The board renders one cell either side of every row and one row above and below, so a piece on
// the border can still be pointed off the board. Those cells are real positions in the grid, they
// are just not playable — deriving them from the same formula as the rest is what keeps a hover
// over one of them resolving to the direction the player meant.
export function cellsInRow(row) {
	return CELLS_BY_ROW[row] !== undefined ? CELLS_BY_ROW[row] : 7 - Math.abs(row - MIDDLE_ROW);
}

// Row 3 is the widest at 7, and every row above or below loses one cell per step — including the
// two phantom rows, which is why the edge ring lands where a player expects it to.
export function cellToWorld(row, cell) {
	const count = cellsInRow(row);

	return {
		x: (cell - (count - 1) / 2) * COLUMN_PITCH,
		z: (row - MIDDLE_ROW) * ROW_PITCH,
	};
}

// Everything the board renders, edge ring included, as a box in board units. The ring is not
// scenery — it is clickable, so it has to stay inside the container with everything else.
export const BOARD_EXTENT = {
	width: 9 * COLUMN_PITCH,
	depth: 9 * ROW_PITCH,
};

// Degrees above the board plane. Flat enough that a tile's extrusion and a token's rim catch the
// light; steep enough that no piece can hide behind the one in front of it.
export const BOARD_ELEVATION = 52;

// The HQ trays are looked at from lower down. Partly because a rack reads better at an angle than
// from above, and partly arithmetic: the eight sockets make a cluster taller than it is wide, and
// their boxes are wider than they are tall. Foreshortening is what reconciles the two.
export const TRAY_ELEVATION = 44;

// How wide the board is for its height once it has been tilted: tilting foreshortens the rows and
// leaves the columns alone. The box the board is given has to be that shape too, or it sits in a
// band of empty space — which is where the phone layout takes its height from.
//
// It lives here rather than with the camera because a styled-component reads it, and this module
// and palette.js are deliberately the two that a component can import without dragging in three.
export const BOARD_ASPECT = BOARD_EXTENT.width / (BOARD_EXTENT.depth * Math.sin((BOARD_ELEVATION * Math.PI) / 180));

export function isPlayableCell(row, cell) {
	return row >= 0 && row < ROW_NUMBERS.length && cell >= 0 && cell < CELLS_BY_ROW[row];
}

// Every cell the board renders, playable and phantom alike, in the order TableBoard renders them:
// top row first, left to right. DOM order matters — a nearer row must come later so it paints
// over the one behind it.
export function allRenderedCells() {
	const rendered = [];
	const rows = [-1, ...ROW_NUMBERS, ROW_NUMBERS.length];

	for (const row of rows) {
		const count = cellsInRow(row);

		for (let cell = -1; cell <= count; cell++) {
			rendered.push({ row, cell, playable: isPlayableCell(row, cell), ...cellToWorld(row, cell) });
		}
	}

	return rendered;
}

// A direction [v, h] as an angle in the XZ plane. v: 1 up / 0 sideways / -1 down, h: 1 left /
// 0 right. Up is -z, so the token's nose points at -z when it faces [1, 0]... which it does not:
// [1, 0] is up-RIGHT. Hence the 30deg offsets, matching directionTransformMap in pieceStyled.js
// exactly, so a piece faces the same way in both renderers.
const DIRECTION_ANGLES = {
	'1,0': 30,
	'1,1': -30,
	'0,0': 90,
	'0,1': -90,
	'-1,0': 150,
	'-1,1': -150,
};

export function directionToAngle(direction) {
	if (!direction) {
		return 0;
	}

	const angle = DIRECTION_ANGLES[`${direction[0]},${direction[1]}`];

	return angle === undefined ? 0 : angle;
}

/**
 * HQ STORE
 */

// The eight sockets a team's undeployed pieces sit in, as a hex cluster of 1 / 2 / 3 / 2. These
// are the same relative positions the CSS store has always used (positionInHQ in pieceStyled.js),
// read back off its percentages and onto the grid they were drawn from.
const STORE_SLOTS = [
	{ type: AGENT, number: '3', column: 0, row: 0 },
	{ type: AGENT, number: '2', column: -0.5, row: 1 },
	{ type: AGENT, number: '4', column: 0.5, row: 1 },
	{ type: AGENT, number: '1', column: -1, row: 2 },
	{ type: CEO, number: '', column: 0, row: 2 },
	{ type: AGENT, number: '5', column: 1, row: 2 },
	{ type: SPY, number: '', column: -0.5, row: 3 },
	{ type: SNIPER, number: '', column: 0.5, row: 3 },
];

const STORE_ROWS = 4;

export function storeSlots() {
	return STORE_SLOTS.map(slot => ({
		key: `${slot.type}${slot.number}`,
		x: slot.column * COLUMN_PITCH,
		z: (slot.row - (STORE_ROWS - 1) / 2) * ROW_PITCH,
	}));
}

// Which socket a piece belongs in. Pieces keep their socket whether or not they are still in it,
// so the store never reshuffles as it empties — the sniper is always bottom right.
export function slotKeyForPiece(pieceId) {
	return pieceId.slice(2);
}
