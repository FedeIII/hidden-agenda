export function areCoordsEqual(coords1, coords2) {
  if (coords1 && coords2) {
    return !!(coords1[0] === coords2[0] && coords1[1] === coords2[1]);
  }
}

export function areCoordsInList(coords, list) {
  return !!list.find(([x, y] = []) => areCoordsEqual(coords, [x, y]));
}

// prettier-ignore
const possibleDirections = [
  [1, 1],
  [1, 0],
  [0, 0],
  [-1, 0],
  [-1, 1],
  [0, 1]
];

export const directions = {
  findIndex(direction) {
    return possibleDirections.findIndex(([v, h]) =>
      areCoordsEqual([v, h], direction),
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
  },

  getOpposite(index) {
    return directions.get(index < 3 ? index + 3 : index - 3);
  },
};

export const memoize = (function() {
  const getKeyFromArg = arg => {
    if (!(arg instanceof Array) && arg instanceof Object) {
      return `${Object.values(arg)}`;
    }

    return `${arg}`;
  };

  const getMemoKey = (...args) => {
    return args.reduce(
      (memoKey, arg) => `${memoKey}#${getKeyFromArg(arg)}`,
      '',
    );
  };

  const memoizeFn = function(func) {
    const memoized = function(...args) {
      const memoKey = getMemoKey(...args);
      const cache = memoized.cache;

      if (cache.has(memoKey)) {
        return cache.get(memoKey);
      }

      const result = func.apply(this, args);
      memoized.cache = cache.set(memoKey, result);

      return result;
    };

    memoized.cache = new Map();

    return memoized;
  };

  return memoizeFn;
})();
