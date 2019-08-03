import { css } from 'styled-components';

const HEX_MARGIN_NUM = 4;
export const HEX_MARGIN = `${HEX_MARGIN_NUM}px`;
export const ROW_MARGIN = '4.7%';
export const HEX_GRADIENT_AMPLITUDE = '30%';
export const HEX_BASE_COLOR = '#a1abb7';
export const PIECE_MARGIN = '10%';

// prettier-ignore
export const DARKEN_LEVEL_BY_CELL = [
        [0,  3,  3,  6],
      [3,  2,  4,  2,  3],
    [3,  4,  3,  0,  4,  3],
  [6,  2,  0,  0,  3,  2,  0],
    [3,  4,  3,  0,  4,  3],
      [3,  2,  4,  2,  3],
        [0,  3,  3,  6],
];

export const MAX_NUMBER_OF_CELLS = 7;
export const TOTAL_MARGIN = `${MAX_NUMBER_OF_CELLS * HEX_MARGIN_NUM}px`;
export const HEXAGON_WIDTH_PROP = css`
  width: calc((100% - ${TOTAL_MARGIN}) / #{MAX_NUMBER_OF_CELLS});
`;
