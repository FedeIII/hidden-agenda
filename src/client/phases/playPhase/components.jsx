import styled, { css } from 'styled-components';

export const PlayPhaseStyled = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 40px 40px 60px;
`;

export const Turn = styled.div`
  padding: 20px;
  text-align: center;
`;

export const Board = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;

export const HQs = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 28%;
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 20px;
`;

export const TableBoardStyled = styled.div`
  position: relative;
  width: 50%;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

export const BoardRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-top: 4.7%;
  justify-content: center;
`;

const hqColor = ({ team }) => {
  switch (team) {
    default:
    case '0':
      return css`
        background-color: white;
      `;
    case '1':
      return css`
        background-color: red;
      `;
    case '2':
      return css`
        background-color: black;
        filter: brightness(3);
      `;
    case '3':
      return css`
        background-color: yellow;
      `;
  }
};

export const HqStyled = styled.div`
  position: relative;
  height: 33%;
  display: flex;
  flex-direction: column;
  border: 2px solid gray;
  padding: 8px;
  ${hqColor}
`;

export const HqStore = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url('img/hexgrid.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
`;
