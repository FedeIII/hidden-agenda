import styled, { css } from 'styled-components';
import { getHexGradient } from './styledHelpers';

const HEX_MARGIN = 4;
const MAX_NUMBER_OF_CELLS = 7;
const TOTAL_MARGIN = MAX_NUMBER_OF_CELLS * HEX_MARGIN;

const onHighlighted = ({ highlighted }) => {
  if (highlighted) {
    return css`
      box-sizing: border-box;
      border-left: 2px solid red;
      border-right: 2px solid red;

      &:before {
        box-sizing: border-box;
        border-left: 2px solid red;
        border-right: 2px solid red;
      }

      &:after {
        box-sizing: border-box;
        border-left: 2px solid red;
        border-right: 2px solid red;
      }
    `;
  }
};

const HexagonStyled = styled.div`
  width: calc((100% - ${TOTAL_MARGIN}px) / ${MAX_NUMBER_OF_CELLS});
  height: 0;
  padding-bottom: 7.8%;
  position: relative;
  margin-right: ${HEX_MARGIN}px;

  ${onHighlighted}

  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
  }

  &:before {
    transform: rotate(60deg);
  }

  &:after {
    transform: rotate(-60deg);
  }

  background: ${getHexGradient(0)};

  &:before {
    background: ${getHexGradient(1)};
  }

  &:after {
    background: ${getHexGradient(2)};
  }

  &:hover {
    background: ${getHexGradient(3)};

    &:before {
      background: ${getHexGradient(4)};
    }

    &:after {
      background: ${getHexGradient(5)};
    }
  }
`;

export default HexagonStyled;
