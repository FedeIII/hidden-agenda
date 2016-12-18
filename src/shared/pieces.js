// direction:
//  [0]: horizontal:
//      1: left
//      0: right
//  [1]: vertical:
//      1: up
//      0: horizontal
//      -1: down

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

        if (v > 0) {
            h = (hDiff === 0) ? 0 : 1;
        } else if (v === 0) {
            h = (hDiff === -1) ? 0 : 1;
        } else if (v < 0) {
            h = (hDiff === 0) ? 1 : 0;
        }

        if (to[0] > 3 || (to[0] === 3 && v > 0)) {
            if (v > 0) {
                h = (hDiff === 0) ? 1 : 0;
            } else if (v === 0) {
                h = (hDiff === -1) ? 0 : 1;
            } else if (v < 0) {
                h = (hDiff === 0) ? 0 : 1;
            }
        }

        return this.create(to, [v, h]);
    },

    getAvailableCells(adjacentCells) {
        return adjacentCells;
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
        return agent.getAvailableCells(adjacentCells);
    }
};

export default pieces;
