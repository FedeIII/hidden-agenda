import { lighten, darken, linearGradient, radialGradient } from 'polished';
import { memoize } from 'Domain/utils';

const HEX_GRADIENT_AMPLITUDE = 0.3;
const HEX_BASE_COLOR = '#a1abb7';

// prettier-ignore
const DARKEN_LEVEL_BY_CELL = [
      [0,  3,  3,  6],
    [3,  2,  4,  2,  3],
  [3,  4,  3,  0,  4,  3],
[6,  2,  0,  0,  3,  2,  0],
  [3,  4,  3,  0,  4,  3],
    [3,  2,  4,  2,  3],
      [0,  3,  3,  6],
];

const getDarkenLevel = (row, cell) => DARKEN_LEVEL_BY_CELL[row][cell];

const getHexagonDarken = (row, cell) => {
  const level = getDarkenLevel(row, cell);

  return (level * 6) / 100;
};

const getHexBaseColor = (row, cell) => {
  const darkenGrade = getHexagonDarken(row, cell);

  return darken(darkenGrade, HEX_BASE_COLOR);
};

const getHexGradientAngle = (row, cell) => {
  let angle = 0;

  if (row > 3) {
    angle = 180;
  }

  if (row === 3 && cell < 4) {
    angle = 270;
  }

  if (row === 3 && cell >= 4) {
    angle = 90;
  }

  return angle;
};

const getLinearGradient = (color1, color2, angle) =>
  linearGradient({
    colorStops: [`${color1} 0%`, `${color2} 100%`],
    toDirection: `${angle}deg`,
  });

const getRadialGradient = (color1, color2, lightenGrade) =>
  radialGradient({
    shape: 'circle',
    colorStops: [
      `${lighten(lightenGrade, color1)} 0%`,
      `${lighten(lightenGrade, color2)} 100%`,
    ],
  });

export const getHexGradient = gradientNumber =>
  memoize(({ row, cell }) => {
    const color = getHexBaseColor(row, cell);
    const colorLight = lighten(HEX_GRADIENT_AMPLITUDE / 2, color);
    const colorDark = darken(HEX_GRADIENT_AMPLITUDE / 2, color);
    const colorLightNarrow = darken(HEX_GRADIENT_AMPLITUDE / 4, colorLight);
    const colorDarkNarrow = lighten(HEX_GRADIENT_AMPLITUDE / 4, colorDark);

    const angle = getHexGradientAngle(row, cell);

    let gradientMainColors = [colorLightNarrow, colorDarkNarrow];

    if (row === 3) {
      gradientMainColors = [colorLight, colorDark];
    }

    let gradients = [
      getLinearGradient(gradientMainColors[0], gradientMainColors[1], angle),
      getLinearGradient(colorLight, colorDark, angle - 60),
      getLinearGradient(colorLight, colorDark, angle + 60),
      getLinearGradient(
        lighten(0.05, gradientMainColors[0]),
        lighten(0.05, gradientMainColors[1]),
        angle,
      ),
      getLinearGradient(
        lighten(0.05, colorLight),
        lighten(0.05, colorDark),
        angle - 60,
      ),
      getLinearGradient(
        lighten(0.05, colorLight),
        lighten(0.05, colorDark),
        angle + 60,
      ),
    ];

    if (row === 3 && cell === 3) {
      gradients = [
        getRadialGradient(colorLightNarrow, colorDarkNarrow, 0.1),
        getRadialGradient(colorLightNarrow, colorDarkNarrow, 0.1),
        getRadialGradient(colorLightNarrow, colorDarkNarrow, 0.1),
        getRadialGradient(colorLightNarrow, colorDarkNarrow, 0.15),
        getRadialGradient(colorLightNarrow, colorDarkNarrow, 0.15),
        getRadialGradient(colorLightNarrow, colorDarkNarrow, 0.15),
      ];
    }

    return gradients[gradientNumber].backgroundImage;
  });
