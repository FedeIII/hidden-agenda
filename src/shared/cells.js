
//           0,0  0,1  0,2  0,3
//        1,0  1,1  1,2  1,3  1,4
//     2,0  2,1  2,2  2,3  2,4  2,5
//  3,0  3,1  3,2  3,3  3,4  3,5  3,6
//     4,0  4,1  4,2  4,3  4,4  4,5
//        5,0  5,1  5,2  5,3  5,4
//           6,0  6,1  6,2  6,3

const cellsByRow = [4, 5, 6, 7, 6, 5, 4];
const cells = [];

function inBoard ([r, c]) {
    if (r >= 0 && r < 7) {
        if (c >= 0 && c < cellsByRow[r]) {
            return true;
        }
    }
}

function createGetPositionInDirection (r, c) {
    return function getPositionInDirection ([v, h]) {
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
            direction => nextPosition = nextPosition && API.get(nextPosition).getPositionInDirection(direction)
        );
    }
}

function getVerticalDirection (from, to) {
    if (from[0] > to[0]) {return 1;}

    if (from[0] === to[0]) {return 0}

    if (from[0] < to[0]) {return -1}
}

function getHorizontalDirection (from, to) {
    if (from[1] > to[1]) {return 1;}

    if (from[1] === to[1]) {return 0;}

    if (from[1] < to[1]) {return 0;}
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
            getPositionsInDirections: createGetPositionsInDirections(r, c)
        });

        allCells.push([r, c]);
    }

    cells.push(row);
});

const API = {
    get([r, c] = [-1, -1]) {
        if (inBoard([r, c])) {
            return cells[r][c];
        }
    },

    getAllAvailableCells() {
        return allCells;
    },

    getDirection(from, to) {
        const v = getVerticalDirection(from, to);
        const h = getHorizontalDirection(from, to);

        return [v, h];
    }
};

export default API;
