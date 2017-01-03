const cellsByRow = [4, 5, 6, 7, 6, 5, 4];
const cells = [];

const mockCell = {
    adjacentCells: [],
    getCoordsInDirection: () => [null, null]
};

function createGetCoordsInDirection (r, c) {
    return function getCoordsInDirection ([v, h]) {
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

        return [r - v, c + hDiff];
    }
};

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
            getCoordsInDirection: createGetCoordsInDirection(r, c)
        });

        allCells.push([r, c]);
    }

    cells.push(row);
});

export default {
    get([r, c]) {
        if (r && c) {
            return cells[r][c];
        } else {
            return mockCell;
        }
    },

    getAllAvailableCells() {
        return allCells;
    }
};
