import React from 'react';

import Hexagon from './hexagon';

function renderHexagon (r, c, pieces) {
    const piece = pieces.find(({position}) =>
        position &&
        position[0] === r &&
        position[1] === c
    );

    return (
        <Hexagon
            key={`${r}${c}`}
            row={r} cell={c}
            piece={piece}
        />
    );
}

function Board ({pieces}) {

    const rowNumbers = [0, 1, 2, 3, 4, 5, 6];
    const cellsByRow = [4, 5, 6, 7, 6, 5, 4];

    const rows = rowNumbers.map(row => {
        const className = `board-row board-row-${row}`;
        const numberOfCells = cellsByRow[row];
        const cells = [];

        for (let cell = 0; cell < numberOfCells; cell++) {
            cells.push(renderHexagon(row, cell, pieces));
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

export default Board;
