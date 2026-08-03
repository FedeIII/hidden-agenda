import { test, expect } from '@playwright/test';
import cells, { CELLS_BY_ROW, ROW_NUMBERS } from 'Domain/cells';
import { directions } from 'Domain/utils';
import { cellsInRow, cellToWorld, COLUMN_PITCH, directionToAngle, ROW_PITCH } from 'Client/three/layout';

// The 3D board places its tiles from arithmetic, and the game decides which cell is which way
// from which one somewhere else entirely, in domain/cells.js. If those two ever disagreed the
// board would look right and play wrong: a piece would be drawn one cell away from the cell it
// is actually on, and nothing in the rest of the suite would notice, because everything else
// asserts against the DOM — which would still be correct.
//
// So this is the join checked directly. No browser, no renderer: it is arithmetic either way.

const EDGE_ROWS = [-1, ROW_NUMBERS.length];

test.describe('BOARD LAYOUT', () => {
	test('agrees with the domain about how many cells a row has', () => {
		for (const row of ROW_NUMBERS) {
			expect(cellsInRow(row), `row ${row}`).toEqual(CELLS_BY_ROW[row]);
		}

		// The two phantom rows exist only so a piece on the border can be pointed off the board.
		// They are one narrower than the rows they sit against, which is what the same formula
		// gives when it is extrapolated rather than special-cased.
		for (const row of EDGE_ROWS) {
			expect(cellsInRow(row), `edge row ${row}`).toEqual(3);
		}
	});

	test('puts every neighbour exactly one hexagon away, in the direction the domain says', () => {
		for (const row of ROW_NUMBERS) {
			for (let cell = 0; cell < CELLS_BY_ROW[row]; cell++) {
				const from = cellToWorld(row, cell);

				for (const direction of directions.getAll()) {
					const neighbour = cells.get([row, cell]).getPositionInDirection(direction);

					if (!neighbour) {
						continue;
					}

					const to = cellToWorld(neighbour[0], neighbour[1]);
					const away = Math.hypot(to.x - from.x, to.z - from.z);

					// Centre to centre across a shared edge, which is the column pitch by
					// definition — the same distance in all six directions or it is not a hex grid.
					expect(away, `[${row},${cell}] ${direction} -> [${neighbour}]`).toBeCloseTo(COLUMN_PITCH, 6);

					// And it lies on the bearing the renderer turns a piece to when it faces that
					// way, so a token points at the cell it is about to move into.
					const bearing = (directionToAngle(direction) * Math.PI) / 180;

					expect(to.x - from.x, `x of ${direction} from [${row},${cell}]`).toBeCloseTo(
						COLUMN_PITCH * Math.sin(bearing),
						6,
					);
					expect(to.z - from.z, `z of ${direction} from [${row},${cell}]`).toBeCloseTo(
						-COLUMN_PITCH * Math.cos(bearing),
						6,
					);
				}
			}
		}
	});

	test('gives every one of the six directions its own bearing', () => {
		const bearings = directions.getAll().map(directionToAngle);

		expect(new Set(bearings).size).toEqual(6);

		// Thirty degrees off north and every sixty after that: a pointy-topped grid, which is what
		// the flat renderer's CSS rotations have always described.
		for (const bearing of bearings) {
			expect(Math.abs(bearing) % 60, `bearing ${bearing}`).toEqual(30);
		}
	});

	test('stacks the rows at three quarters of a hexagon, not a whole one', () => {
		// The row pitch is what makes hexagons interlock instead of sitting in a square grid, and
		// it is also the height of every cell's invisible click box. Getting it wrong tiles the
		// board with gaps or with overlaps, and the overlaps are the dangerous half.
		expect(ROW_PITCH).toBeCloseTo(1.5, 10);
		expect(COLUMN_PITCH).toBeCloseTo(Math.sqrt(3), 10);

		const above = cellToWorld(2, 2);
		const below = cellToWorld(3, 2);

		expect(below.z - above.z).toBeCloseTo(ROW_PITCH, 10);
	});
});
