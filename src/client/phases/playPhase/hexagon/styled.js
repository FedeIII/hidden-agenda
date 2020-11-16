import styled, { css } from 'styled-components';
import { ROW_NUMBERS, CELLS_BY_ROW } from 'Client/phases/playPhase/tableBoard';
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

const onHighlighted = ({ highlighted }) => {
	if (highlighted) {
		return css`
			box-sizing: border-box;
			border-left: 2px solid red;
			border-right: 2px solid red;

			&:hover {
				cursor: pointer;
			}

			&:before {
				box-sizing: border-box;
				border-left: 2px solid red;
				border-right: 2px solid red;

				&:hover {
					cursor: pointer;
				}
			}

			&:after {
				box-sizing: border-box;
				border-left: 2px solid red;
				border-right: 2px solid red;

				&:hover {
					cursor: pointer;
				}
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

const getHexagonProperties = cellState => ({ row, cell, edge }) => {
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
`;

export default HexagonStyled;
