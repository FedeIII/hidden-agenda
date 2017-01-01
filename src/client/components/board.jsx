import React, {PropTypes} from 'react';

import cells from 'shared/cells';
import Hexagon from 'components/hexagon';

function getHighlightedCells (selectedPiece) {
    const highlightedCells = [];

    if (selectedPiece) {
        const selectedPieceCell = cells.get(
            selectedPiece.position[0],
            selectedPiece.position[1]
        );

        highlightedCells.push(
            selectedPieceCell.getCoordsInDirection(selectedPiece.direction)
        );
    }

    return highlightedCells;
}

function Board ({
    pieces,
    selectedPiece,
    onHexagonClick
}) {

    const highlightedCells = getHighlightedCells(selectedPiece);

    function renderHexagon (r, c) {
        const piece = pieces.find(({position}) =>
            position &&
            position[0] === r &&
            position[1] === c
        );

        const highlighted = !!highlightedCells.find(
            coords => coords[0] === r && coords[1] === c
        );

        return (
            <Hexagon
                key={`${r}${c}`}
                row={r} cell={c}
                piece={piece}
                highlighted={highlighted}
                onClick={() => onHexagonClick([r, c])}
            />
        );
    }

    const rowNumbers = [0, 1, 2, 3, 4, 5, 6];
    const cellsByRow = [4, 5, 6, 7, 6, 5, 4];

    const rows = rowNumbers.map(row => {
        const className = `board-row board-row-${row}`;
        const numberOfCells = cellsByRow[row];
        const cells = [];

        for (let cell = 0; cell < numberOfCells; cell++) {
            cells.push(renderHexagon(row, cell));
        }

        return (
            <div key={row} className={className}>
                {cells}
            </div>
        );
    });

    return (
        <div>
            {rows}
        </div>
    );
}

Board.propTypes = {
    pieces: PropTypes.arrayOf(PropTypes.shape({
        position: PropTypes.arrayOf((coords) => {
            if (coords.length !== 2) {
                return new Error('wrong coords, bro');
            }
        })
    })).isRequired
};

export default Board;
