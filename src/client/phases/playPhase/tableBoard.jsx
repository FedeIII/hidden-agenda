import React, { useContext } from 'react';
import pz from 'Shared/pz';
import { areCoordsEqual } from 'Shared/utils';
import { StateContext } from 'State';
import { TableBoardStyled, BoardRow } from './components';
import Hexagon from './hexagon';

const ROW_NUMBERS = [0, 1, 2, 3, 4, 5, 6];
const CELLS_BY_ROW = [4, 5, 6, 7, 6, 5, 4];

function renderHexagon({ row, cell, pieces, highlightedCells }) {
  const piece = pieces.find(
    ({ position }) => position && position[0] === row && position[1] === cell,
  );

  const highlighted = !!highlightedCells.find(coords =>
    areCoordsEqual(coords, [row, cell]),
  );

  return (
    <Hexagon
      key={`${row}${cell}`}
      row={row}
      cell={cell}
      piece={piece}
      highlighted={highlighted}
      onClick={() => {}}
      onMouseEnter={() => {}}
    />
  );
}

function TableBoard() {
  const [{ pieces }] = useContext(StateContext);
  const highlightedCells = pz.getHighlightedCells(pieces);

  return (
    <TableBoardStyled>
      {ROW_NUMBERS.map(row => {
        const numberOfCells = CELLS_BY_ROW[row];
        const cells = [];

        for (let cell = 0; cell < numberOfCells; cell++) {
          cells.push(renderHexagon({ row, cell, pieces, highlightedCells }));
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
