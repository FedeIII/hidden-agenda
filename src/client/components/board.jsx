import React, {PropTypes} from 'react';

import cells from 'shared/cells';
import Hexagon from 'components/hexagon';

// function getHighlightedCells (selectedPiece) {
//     const highlightedCells = [];
//
//     if (selectedPiece) {
//         const selectedPieceCell = cells.get(selectedPiece.position);
//
//         highlightedCells.push(
//             selectedPieceCell.getCellInDirection(selectedPiece.direction)
//         );
//     }
//
//     return highlightedCells;
// }

const rowNumbers = [0, 1, 2, 3, 4, 5, 6];
const cellsByRow = [4, 5, 6, 7, 6, 5, 4];

function arraysEqual (a, b) {
    return a.reduce((mem, ai, i) => mem && (ai === b[i]), true);
}

class Board extends React.Component {

    // ({
    //     pieces,
    //     selectedPiece,
    //     highlightedCells,
    //     onHexagonClick,
    //     onMouseEnter
    // })

    renderHexagon (r, c) {
        const piece = this.props.pieces.find(({position}) =>
            position &&
            position[0] === r &&
            position[1] === c
        );

        const highlighted = !!this.props.highlightedCells.find(
            coords => coords[0] === r && coords[1] === c
        );

        return (
            <Hexagon
                key={`${r}${c}`}
                row={r} cell={c}
                piece={piece}
                highlighted={highlighted}
                onClick={() => this.props.onHexagonClick([r, c])}
                onMouseEnter={() => this.props.onMouseEnter(r, c)}
            />
        );
    }

    render () {
        this.rows = rowNumbers.map(row => {
            const className = `board-row board-row-${row}`;
            const numberOfCells = cellsByRow[row];
            const cells = [];

            for (let cell = 0; cell < numberOfCells; cell++) {
                cells.push(this.renderHexagon(row, cell));
            }

            return (
                <div key={row} className={className}>
                    {cells}
                </div>
            );
        });

        return (
            <div>
                {this.rows}
            </div>
        );
    }
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
