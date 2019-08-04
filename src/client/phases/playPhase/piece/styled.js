import styled, { css } from 'styled-components';
import pz from 'Shared/pz';

const directionTransformMap = {
  '1': {
    '0': css`
      transform: rotate(30deg);
    `,
    '1': css`
      transform: rotate(-30deg);
    `,
  },
  '0': {
    '0': css`
      transform: rotate(90deg);
    `,
    '1': css`
      transform: rotate(-90deg);
    `,
  },
  '-1': {
    '0': css`
      transform: rotate(150deg);
    `,
    '1': css`
      transform: rotate(-150deg);
    `,
  },
};

const directionStyles = ({ selectedDirection }) => {
  if (selectedDirection) {
    const [verticalDirection, horizontalDirection] = selectedDirection;

    return directionTransformMap[verticalDirection][horizontalDirection];
  }
};

const hqStyles = ({ selectedDirection }) => {
  if (!selectedDirection) {
    return css`
      width: 20%;
      margin: 0;
    `;
  }
};

const piecePositionInHqStyles = ({ selectedDirection, pieceId }) => {
  if (!selectedDirection) {
    const type = pz.getType(pieceId);
    const pieceNumber = pz.getNumber(pieceId);

    switch (`${type}${pieceNumber}`) {
      case 'A1':
        return css`
          top: 44%;
          left: 3%;
        `;
      case 'A2':
        return css`
          top: 24.5%;
          left: 21.5%;
        `;
      case 'A3':
        return css`
          top: 6%;
          left: 40%;
        `;
      case 'A4':
        return css`
          top: 24.5%;
          left: 58%;
        `;
      case 'A5':
        return css`
          top: 44%;
          left: 76.5%;
        `;
      case 'C':
        return css`
          top: 44%;
          left: 40%;
        `;
      case 'S':
        return css`
          top: 63.5%;
          left: 21.5%;
        `;
      case 'N':
        return css`
          top: 63.5%;
          left: 58%;
        `;
    }
  }
};

const PieceStyled = styled.img`
  position: absolute;
  width: 92%;
  top: -43%;
  bottom: 0;
  left: -6%;
  right: 0;
  margin-left: 10%;
  margin-top: 13%;
  z-index: 2;

  ${directionStyles}

  ${hqStyles}
  ${piecePositionInHqStyles}
`;

export default PieceStyled;
