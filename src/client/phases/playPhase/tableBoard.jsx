import React, { useContext } from 'react';
import { pz } from 'Domain/pieces';
import { areCoordsInList } from 'Domain/utils';
import { CELLS_BY_ROW, ROW_NUMBERS } from 'Domain/cells';
import { StateContext } from 'State';
import { TableBoardStyled, BoardRow } from './components';
import Hexagon from './hexagon';

// One cell either side of every row, plus a row above and below the board, so a piece on the
// border can still be pointed outwards.
const EDGE_ROW_CELLS = 3;

function renderRow(row, numberOfCells, board) {
	const hexagons = [];

	for (let cell = -1; cell <= numberOfCells; cell++) {
		hexagons.push(
			<Hexagon
				key={`hex-${row}-${cell}`}
				row={row}
				cell={cell}
				edge={cell === -1 || cell === numberOfCells || row < 0 || row >= ROW_NUMBERS.length}
				piece={pz.getPieceAtPosition([row, cell], board.pieces)}
				highlighted={areCoordsInList([row, cell], board.highlightedPositions)}
				aim={board.aim}
			/>,
		);
	}

	return <BoardRow key={`row-${row}`}>{hexagons}</BoardRow>;
}

function TableBoard() {
	const [{ pieces, pieceState }] = useContext(StateContext);

	// Worked out once for the whole board. This used to live in a function called for each of
	// the 53 cells, which recomputed the highlights every time and — because that function also
	// held useContext and useCallback — called hooks in a loop.
	const highlightedPositions = pz.getHighlightedPositions(pieces, pieceState);
	const selectedPiece = pz.getSelectedPiece(pieces);

	// Pointing is only offered once the selected piece has nowhere left to move, which is what
	// keeps a hover from hijacking a move. A piece still in its HQ has no position to aim from.
	const canAim = !!selectedPiece && !!selectedPiece.position && !highlightedPositions.length;

	const board = {
		pieces,
		highlightedPositions,
		aim: canAim
			? {
					from: selectedPiece.position,
					directions: pz.getPossibleDirections(selectedPiece, pieces, pieceState),
				}
			: null,
	};

	return (
		<TableBoardStyled>
			{renderRow(-1, EDGE_ROW_CELLS, board)}

			{ROW_NUMBERS.map(row => renderRow(row, CELLS_BY_ROW[row], board))}

			{renderRow(ROW_NUMBERS.length, EDGE_ROW_CELLS, board)}
		</TableBoardStyled>
	);
}

export default TableBoard;
