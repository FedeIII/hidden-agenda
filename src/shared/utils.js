export function areCoordsEqual (coords1, coords2) {
    if (coords1 && coords1) {
        return !!(coords1[0] === coords2[0] && coords1[1] === coords2[1]);
    }
}

export function areCoordsInList (coords, list) {
    return !!list.find(
        ([x, y]) => areCoordsEqual(coords, [x, y])
    );
};

const possibleDirections = [
    [1,1],
    [1,0],
    [0,0],
    [-1,0],
    [-1,1],
    [0,1]
];

export const directions = {
    findIndex(direction) {
        return possibleDirections.findIndex(
            ([v, h]) => areCoordsEqual([v, h], direction)
        );
    },

    get(index) {
        return [].concat(possibleDirections[index]);
    },

    getAll() {
        return [].concat(possibleDirections);
    },

    getPrevious(index) {
        let i = index - 1;
        if (i < 0) {
            i = possibleDirections.length + i;
        }

        return [].concat(possibleDirections[i]);
    },

    getFollowing(index) {
        let i = index + 1;
        if (i >= possibleDirections.length) {
            i = i - possibleDirections.length;
        }

        return [].concat(possibleDirections[i]);
    }
}
