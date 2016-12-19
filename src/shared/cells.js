const cellsByRow = [4, 5, 6, 7, 6, 5, 4];
const cells = [];

const createGetCellInDirection = function createGetCellInDirection (r, c) {
    return function getCellInDirection ([v, h]) {
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

const getAdjacentCells = function getAdjacentCells (r, c) {
    const upperCells = (r <= 3) ?
        [[r - 1, c - 1], [r - 1, c]] :
        [[r - 1, c], [r - 1, c + 1]];
    const rowCellLeft = [[r, c - 1]];
    const rowCellRight = [[r, c + 1]];
    const lowerCells = (r < 3) ?
        [[r + 1, c + 1], [r + 1, c]] :
        [[r + 1, c], [r + 1, c - 1]];

    return [].concat(upperCells, rowCellRight, lowerCells, rowCellLeft);
};

cellsByRow.forEach((numberOfCells) => {
    const row = [];
    for (let c = 0; c < numberOfCells; c++) {
        const r = cells.length;
        row.push({
            adjacentCells: getAdjacentCells(r, c),
            getCellInDirection: createGetCellInDirection(r, c)
        });
    }

    cells.push(row);
});

export default {
    get(r, c) {
        return cells[r][c];
    }
};
