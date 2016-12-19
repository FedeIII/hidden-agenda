import cells from 'shared/cells';

// direction:
//  [0] vertical:
//      1: up
//      0: horizontal
//      -1: down
//  [1] horizontal:
//      1: left
//      0: right

function isUp (from, to) {
    return from[0] > to[0];
}

function isSideways (from, to) {
    return from[0] === to[0];
}

function isBottomHalf (to) {
    return to[0] > 3;
}

function isUpIntoTheMiddle (from, to) {
    return to[0] === 3 && isUp(from, to);
}

function invertHorizontal (h) {
    return +!h;
}

const agent = {
    create(position, direction) {
        return {
            position,
            direction
        };
    },

    move(from, to) {
        const v = from[0] - to[0];
        const hDiff = from[1] - to[1];
        let h;

        if (isSideways(from, to)) {
            h = (hDiff === -1) ? 0 : 1;
        } else {
            if (isUp(from, to)) {
                h = (hDiff === 0) ? 0 : 1;
            } else {
                h = (hDiff === 0) ? 1 : 0;
            }

            if (isBottomHalf(to) || isUpIntoTheMiddle(from, to)) {
                h = invertHorizontal(h);
            }
        }

        return this.create(to, [v, h]);
    },

    getAvailableCells(piece, adjacentCells) {
        const availableCells = [];

        const currentCell = cells.get(piece.position[0], piece.position[1]);
        const cellInDirection = currentCell.getCellInDirection(piece.direction);
        const cellIndex = adjacentCells.findIndex((cell) => {
            return cell[0] === cellInDirection[0] && cell[1] === cellInDirection[1];
        });

        const indices = [cellIndex - 1, cellIndex, cellIndex + 1].map((value) => {
            if (value < 0) {
                return adjacentCells.length + value;
            } else if (value >= adjacentCells.length) {
                return value - adjacentCells.length;
            } else {
                return value;
            }
        });

        return availableCells.concat([
            adjacentCells[indices[0]],
            adjacentCells[indices[1]],
            adjacentCells[indices[2]]
        ]);
    }
};

const initialState = {
    agent1: agent.create([3, 3], [1, 0]),
    agent2: agent.create([0, 0], [-1, 1])
};

const pieces = {
    getInitialState() {
        return initialState;
    },

    movePiece(pieces, piece, to) {
        const piecesMoved = Object.assign({}, pieces);
        const from = piecesMoved[piece].position;

        piecesMoved[piece] = agent.move(from, to);

        return piecesMoved;
    },

    getAvailableCells(piece, adjacentCells) {
        return agent.getAvailableCells(piece, adjacentCells);
    }
};

export default pieces;
