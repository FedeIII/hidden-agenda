import React, { useContext, useCallback } from 'react';
import { pz } from 'Domain/pieces';
import { areCoordsEqual, areCoordsInList } from 'Domain/utils';
import cells from 'Domain/cells';
import { togglePiece, movePiece, directPiece } from 'Client/actions';
import { StateContext } from 'State';
import { TableBoardStyled, BoardRow } from './components';
import Hexagon from './hexagon';

export const ROW_NUMBERS = [0, 1, 2, 3, 4, 5, 6];
export const CELLS_BY_ROW = [4, 5, 6, 7, 6, 5, 4];

function renderHexagon({ row, cell, edge }) {
	const [{ pieces, followMouse, pieceState }, dispatch] = useContext(StateContext);
	const highlightedPositions = pz.getHighlightedPositions(pieces);
	const selectedPiece = pz.getSelectedPiece(pieces);

	const piece = pieces.find(
		({ position }) =>
			position && position[0] >= 0 && position[1] >= 0 && position[0] === row && position[1] === cell,
	);

	const highlighted = !!highlightedPositions.find(coords => areCoordsEqual(coords, [row, cell]));

	const onHexagonClick = useCallback(() => {
		if (followMouse) {
			const selectedPiece = pz.getSelectedPiece(pieces);
			if (selectedPiece) {
				dispatch(togglePiece(selectedPiece.id));
			}
		} else if (areCoordsInList([row, cell], highlightedPositions)) {
			dispatch(movePiece(selectedPiece.id, [row, cell]));
		}
	}, [dispatch, pieces, followMouse, row, cell]);

	const onMouseEnter = useCallback(() => {
		if (!highlightedPositions.length && selectedPiece) {
			const possibleDirections = pz.getPossibleDirections(selectedPiece, pieces, pieceState);
			const intendedDirection = cells.getDirection(selectedPiece.position, [row, cell]);
			if (areCoordsInList(intendedDirection, possibleDirections)) {
				dispatch(directPiece(intendedDirection));
			}
		}
	}, [pieces, followMouse, pieceState, row, cell]);

	return (
		<Hexagon
			key={`hex-${row}-${cell}`}
			row={row}
			cell={cell}
			piece={piece}
			highlighted={highlighted}
			edge={edge}
			onClick={onHexagonClick}
			onMouseEnter={onMouseEnter}
		/>
	);
}

function renderRow(row, numberOfCells) {
	const cells = [renderHexagon({ row, cell: -1, edge: true })];

	for (let cell = 0; cell < numberOfCells; cell++) {
		cells.push(
			renderHexagon({
				row,
				cell,
				edge: row < 0 || row >= ROW_NUMBERS.length,
			}),
		);
	}

	cells.push(renderHexagon({ row, cell: numberOfCells, edge: true }));

	return <BoardRow key={`row-${row}`}>{cells}</BoardRow>;
}

function TableBoard() {
	return (
		<TableBoardStyled>
			{renderRow(-1, 3)}

			{ROW_NUMBERS.map(row => {
				const numberOfCells = CELLS_BY_ROW[row];
				return renderRow(row, numberOfCells);
			})}

			{renderRow(ROW_NUMBERS.length, 3)}
		</TableBoardStyled>
	);
}

export default TableBoard;
