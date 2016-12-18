const cells = {};

const cellsByRow = [4, 5, 6, 7, 6, 5, 4];
const cellsProps = [];

const getCellProps = function getCellProps (r, c) {
    const upperCells = (r <= 3) ?
        [[r - 1, c - 1], [r - 1, c]] :
        [[r - 1, c], [r - 1, c + 1]];
    const rowCells = [[r, c - 1], [r, c + 1]];
    const lowerCells = (r < 3) ?
        [[r + 1, c], [r + 1, c + 1]] :
        [[r + 1, c - 1], [r + 1, c]];
    const adjacentCells = [].concat(upperCells, rowCells, lowerCells);

    return {
        adjacentCells
    };
};

cellsByRow.forEach((numberOfCells) => {
    const row = [];
    for (let i = 0; i < numberOfCells; i++) {
        row.push(getCellProps(cellsProps.length, i));
    }

    cellsProps.push(row);
});

cells.getAdjacentCells = function getAdjacentCells (r, c) {
    return cellsProps[r][c].adjacentCells;
}

export default cells;
