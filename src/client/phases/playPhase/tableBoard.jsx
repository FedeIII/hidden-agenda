import React, { useContext, useCallback } from 'react';
import pz from 'Shared/pz';
import { areCoordsEqual, areCoordsInList } from 'Shared/utils';
import cells from 'Shared/cells';
import { togglePiece, movePiece, directPiece } from 'Client/actions';
import { StateContext } from 'State';
import { TableBoardStyled, BoardRow } from './components';
import Hexagon from './hexagon';

const ROW_NUMBERS = [0, 1, 2, 3, 4, 5, 6];
const CELLS_BY_ROW = [4, 5, 6, 7, 6, 5, 4];

function renderHexagon({ row, cell }) {
  const [{ pieces, followMouse, pieceState }, dispatch] = useContext(
    StateContext,
  );
  const highlightedCells = pz.getHighlightedCells(pieces);
  const selectedPiece = pz.getSelectedPiece(pieces);

  const piece = pieces.find(
    ({ position }) => position && position[0] === row && position[1] === cell,
  );

  const highlighted = !!highlightedCells.find(coords =>
    areCoordsEqual(coords, [row, cell]),
  );

  const onHexagonClick = useCallback(() => {
    if (followMouse) {
      const selectedPiece = pz.getSelectedPiece(pieces);
      if (selectedPiece) {
        dispatch(togglePiece(selectedPiece.id));
      }
    } else if (areCoordsInList([row, cell], highlightedCells)) {
      dispatch(movePiece(selectedPiece.id, [row, cell]));
    }
  }, [dispatch, pieces, followMouse, row, cell]);

  const onMouseEnter = useCallback(() => {
    if (!highlightedCells.length && selectedPiece) {
      const possibleDirections = pz.getPossibleDirections(
        selectedPiece,
        pieces,
        pieceState,
      );
      const intendedDirection = cells.getDirection(selectedPiece.position, [
        row,
        cell,
      ]);
      if (areCoordsInList(intendedDirection, possibleDirections)) {
        dispatch(directPiece(intendedDirection));
      }
    }
  }, [pieces, followMouse, pieceState, row, cell]);

  return (
    <Hexagon
      key={`${row}${cell}`}
      row={row}
      cell={cell}
      piece={piece}
      highlighted={highlighted}
      onClick={onHexagonClick}
      onMouseEnter={onMouseEnter}
    />
  );
}

function TableBoard() {
  return (
    <TableBoardStyled>
      {ROW_NUMBERS.map(row => {
        const numberOfCells = CELLS_BY_ROW[row];
        const cells = [];

        for (let cell = 0; cell < numberOfCells; cell++) {
          cells.push(renderHexagon({ row, cell }));
        }

        return (
          <BoardRow key={row} className={`board__row-${row}`}>
            {cells}
          </BoardRow>
        );
      })}
    </TableBoardStyled>
  );
}

export default TableBoard;
