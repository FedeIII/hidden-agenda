import {areCoordsEqual} from 'Shared/utils';

//           0,0  0,1  0,2  0,3
//        1,0  1,1  1,2  1,3  1,4
//     2,0  2,1  2,2  2,3  2,4  2,5
//  3,0  3,1  3,2  3,3  3,4  3,5  3,6
//     4,0  4,1  4,2  4,3  4,4  4,5
//        5,0  5,1  5,2  5,3  5,4
//           6,0  6,1  6,2  6,3

const cellsByRow = [4, 5, 6, 7, 6, 5, 4];
const cells = [];
const outPosition = [-1, -1];

function createGetPositionInDirection (r, c) {
    return function getPositionInDirection ([v, h] = []) {
        let hDiff = (h === 0) ? 1 : -1;
        if (r < 3) {
            if (v > 0) {
                hDiff = -h;
            } else if (v < 0) {
                hDiff = +!h;
            }
        } else if (r === 3) {
            if (v !== 0) {
                hDiff = -h;
            }
        } else if (r > 3) {
            if (v > 0) {
                hDiff = +!h;
            } else if (v < 0) {
                hDiff = -h;
            }
        }

        const coords = [r - v, c + hDiff];

        if (inBoard(coords)) {
            return coords;
        }
    }
};

function createGetPositionsInDirections (r, c) {
    return function getPositionsInDirections (...directions) {
        let nextPosition = [r, c];
        return directions.map(
            direction => nextPosition = nextPosition && get(nextPosition).getPositionInDirection(direction)
        );
    }
}

function createGetPositionAfterDirections (r, c) {
    return function getPositionAfterDirections (...directions) {
        return this.getPositionsInDirections(...directions).slice(-1)[0];
    }
}

function createGetPositionsInDirection (r, c) {
    return function getPositionsInDirection ([v, h] = [], positions = []) {
        const currentPosition = positions[positions.length - 1] || [r, c];
        const nextPosition = get(currentPosition).getPositionInDirection([v, h]);
        if (!inBoard(nextPosition)) {
            return positions;
        }

        return this.getPositionsInDirection([v, h], positions.concat([nextPosition]));
    }
}

function getVerticalDirection (from, to) {
    if (from[0] > to[0]) {return 1;}

    if (from[0] === to[0]) {return 0}

    if (from[0] < to[0]) {return -1}
}

function getHorizontalDirection (from, to, v) {
    if (v === 0) {
        return goingLeftDecreasesHorizontal(from, to);
    }

    if (from[0] < 3) {
        return getUpperHalfDirection(from, to, v);
    }

    if (from[0] === 3) {
        return goingLeftDecreasesHorizontal(from, to);
    }

    if (from[0] > 3) {
        return getLowerHalfDirection(from, to, v);
    }
}

function getUpperHalfDirection (from, to, v) {
    if (v === 1) {
        return goingLeftDecreasesHorizontal(from, to);
    }

    if (v === -1) {
        return goingRightIncreasesHorizontal(from, to);
    }
}

function getLowerHalfDirection (from, to, v) {
    if (v === 1) {
        return goingRightIncreasesHorizontal(from, to);
    }

    if (v === -1) {
        return goingLeftDecreasesHorizontal(from, to);
    }
}

function goingLeftDecreasesHorizontal (from, to) {
    return +(from[1] > to[1]);
}

function goingRightIncreasesHorizontal (from, to) {
    return +(from[1] >= to[1]);
}

// function getAdjacentCells (r, c) {
//     const upperCells = (r <= 3) ?
//         [[r - 1, c - 1], [r - 1, c]] :
//         [[r - 1, c], [r - 1, c + 1]];
//     const rowCellLeft = [[r, c - 1]];
//     const rowCellRight = [[r, c + 1]];
//     const lowerCells = (r < 3) ?
//         [[r + 1, c + 1], [r + 1, c]] :
//         [[r + 1, c], [r + 1, c - 1]];
//
//     return [].concat(upperCells, rowCellRight, lowerCells, rowCellLeft);
// };

const allCells = [];

cellsByRow.forEach((numberOfCells) => {
    const row = [];
    for (let c = 0; c < numberOfCells; c++) {
        const r = cells.length;
        row.push({
            // adjacentCells: getAdjacentCells(r, c),
            position: [r, c],
            getPositionInDirection: createGetPositionInDirection(r, c),
            getPositionsInDirections: createGetPositionsInDirections(r, c),
            getPositionAfterDirections: createGetPositionAfterDirections(r, c),
            getPositionsInDirection: createGetPositionsInDirection(r, c)
        });

        allCells.push([r, c]);
    }

    cells.push(row);
});

function get ([r, c] = outPosition) {
    if (inBoard([r, c])) {
        return cells[r][c];
    }

    return {
        position: outPosition,
        getPositionInDirection: () => outPosition,
        getPositionsInDirections: () => [outPosition],
        getPositionAfterDirections: () => outPosition,
        getPositionsInDirection: () => [outPosition]
    };
}

function getAllAvailableCells () {
    return allCells;
}

function getDirection (from, to) {
    const v = getVerticalDirection(from, to);
    const h = getHorizontalDirection(from, to, v);

    return [v, h];
}

function inBoard ([r, c] = outPosition) {
    if (r >= 0 && r < 7) {
        if (c >= 0 && c < cellsByRow[r]) {
            return true;
        }
    }
}

function getMovementCells (from, to) {
    if (from && from.length) {
        return (function concatCell (acc, cell) {
            if (areCoordsEqual(cell, to)) {
                return acc.concat([cell]);
            }

            return concatCell(acc.concat([cell]), get(cell).getPositionInDirection(getDirection(cell, to)));
        })([from], get(from).getPositionInDirection(getDirection(from, to)));
    }

    return [to];
}

export default {
    get,
    getAllAvailableCells,
    getDirection,
    inBoard,
    getMovementCells
};
