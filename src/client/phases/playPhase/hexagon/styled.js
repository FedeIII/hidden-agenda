import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import { ROW_NUMBERS, CELLS_BY_ROW } from 'Domain/cells';
import { previewStep } from 'Client/three/palette';
import { getHexGradient } from './styledHelpers';

const HEX_MARGIN = 4;
const MAX_NUMBER_OF_CELLS = 7;
const TOTAL_MARGIN = MAX_NUMBER_OF_CELLS * HEX_MARGIN;

const CELL = 0;
const CELL_BEFORE = 1;
const CELL_AFTER = 2;
const CELL_HOVER = 3;
const CELL_HOVER_BEFORE = 4;
const CELL_HOVER_AFTER = 5;

// A legal cell is `red`, exactly and literally: the suite reads that computed string, and it is the
// one piece of vocabulary a returning player owns.
//
// A cell a spy could only reach on a LATER move takes that step's own colour instead — teal for the
// second, gold for the third — so which move a cell belongs to is legible on its own rather than by
// comparison with the cell next to it, and no shade of red means anything but "you may go here".
// Only the colour changes: the width stays 2px, because these boxes are what the 3D board is
// clicked through and box-sizing keeps the border out of the layout either way.
const highlightColor = preview => {
	if (!preview) {
		return 'red';
	}

	const { color, fade } = previewStep(preview);

	return rgba(color, fade);
};

// The pointer is the other half of the difference: a preview cell says where the walk could get to
// and is not somewhere you may click yet, so it does not offer itself as a target.
const onHighlighted = ({ highlighted, preview }) => {
	if (highlighted || preview) {
		const color = highlightColor(highlighted ? 0 : preview);
		const cursor = highlighted
			? css`
					&:hover {
						cursor: pointer;
					}
				`
			: '';

		return css`
			box-sizing: border-box;
			border-left: 2px solid ${color};
			border-right: 2px solid ${color};

			${cursor}

			&:before {
				box-sizing: border-box;
				border-left: 2px solid ${color};
				border-right: 2px solid ${color};

				${cursor}
			}

			&:after {
				box-sizing: border-box;
				border-left: 2px solid ${color};
				border-right: 2px solid ${color};

				${cursor}
			}
		`;
	}
};

const SEPARATION_STEP = 7;

const getSeparation = row => {
	return {
		'-1': 2 * SEPARATION_STEP,
		0: SEPARATION_STEP,
		1: 0,
		2: -1 * SEPARATION_STEP,
		3: -2 * SEPARATION_STEP,
		4: -1 * SEPARATION_STEP,
		5: 0,
		6: SEPARATION_STEP,
		7: 2 * SEPARATION_STEP,
	}[row];
};

const isEdgeRow = row => row < 0 || row >= ROW_NUMBERS.length;
const isEdgeCell = (row, cell) => {
	return cell < 0 || cell >= (CELLS_BY_ROW[row] || 3);
};

const isBeforeOrAfter = cellState => {
	return [CELL_BEFORE, CELL_AFTER, CELL_HOVER_BEFORE, CELL_HOVER_AFTER].includes(cellState);
};

const getPosition = (row, cell, cellState) => {
	if (isBeforeOrAfter(cellState) || isEdgeCell(row, cell)) {
		return 'absolute';
	}

	return 'relative';
};

const getLeft = (row, cell) => {
	if (isEdgeRow(row) && !isEdgeCell(row, cell)) {
		return 'initial';
	}

	if (cell >= 0) {
		return 'unset';
	}

	return `${getSeparation(row)}%`;
};

const getRight = (row, cell) => {
	if (isEdgeRow(row) && !isEdgeCell(row, cell)) {
		return 'initial';
	}

	if (cell < 0) {
		return 'unset';
	}

	return `${getSeparation(row)}%`;
};

const getHexagonProperties =
	cellState =>
	({ row, cell, edge }) => {
		if (edge) {
			return css`
				background: none;
				position: ${getPosition(row, cell, cellState)};
				left: ${getLeft(row, cell)};
				right: ${getRight(row, cell)};
				z-index: 1;
			`;
		}

		return css`
			background: ${getHexGradient(cellState)({ row, cell })};
		`;
	};

// In 3D the hexagon stops drawing itself and becomes the thing you click: an invisible box laid
// exactly over the tile the renderer painted.
//
// A box, not a hexagon — one column pitch wide and one row pitch tall, which tiles the plane
// exactly. A cell's right edge is its neighbour's left edge to the pixel, and its bottom edge is
// the next row's top edge, so every point on the board belongs to exactly one cell. Using the
// hexagons' true bounding boxes instead would overlap adjacent rows by a quarter of their height,
// and which of two invisible boxes a click landed on would come down to DOM order.
//
// It stays opacity: 0 rather than hidden. Invisible either way, but a transparent element is
// still laid out, still hit-tested by elementFromPoint, still reports its computed border, and is
// still visible as far as the DOM is concerned — none of which is true of visibility: hidden.
//
// Where the box actually IS arrives through the style prop, not through here: styled-components
// mints and keeps a class for every distinct value it is interpolated with, so a projected pixel
// offset in this template would leak a rule per hexagon per layout, forever.
const onProjected = ({ projected }) => {
	if (projected) {
		return css`
			position: absolute;
			padding-bottom: 0;
			margin: 0;
			opacity: 0;
			background: none;

			/* The two rotated copies that made the hexagon shape. They stick out past the box,
			   which for something being hit-tested is a liability rather than a look. */
			&:before,
			&:after {
				display: none;
			}
		`;
	}
};

const HexagonStyled = styled.div`
	width: calc((100% - ${TOTAL_MARGIN}px) / ${MAX_NUMBER_OF_CELLS});
	height: 0;
	padding-bottom: 7.8%;
	position: relative;
	margin-right: ${HEX_MARGIN}px;

	${onHighlighted}
	${getHexagonProperties(CELL)};

	&:before,
	&:after {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
	}

	&:before {
		transform: rotate(60deg);
		${getHexagonProperties(CELL_BEFORE)};
	}

	&:after {
		transform: rotate(-60deg);
		${getHexagonProperties(CELL_AFTER)};
	}

	&:hover {
		${getHexagonProperties(CELL_HOVER)};

		&:before {
			${getHexagonProperties(CELL_HOVER_BEFORE)};
		}

		&:after {
			${getHexagonProperties(CELL_HOVER_AFTER)};
		}
	}

	/* Last, so it wins — but deliberately without touching the red border onHighlighted sets.
	   That border is invisible under opacity: 0 and is read by the suite to tell a legal cell
	   from an illegal one; box-sizing: border-box keeps it from resizing the box either way. */
	${onProjected}
`;

export default HexagonStyled;
