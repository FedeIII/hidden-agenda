import styled, { css } from 'styled-components';

export const PlayPhaseContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 40px 40px 60px;
  min-width: 75vw;
`;

export const Board = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 20px;
`;

export const Button = styled.button``;

export const TableBoardStyled = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
`;

export const BoardRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-top: 4.7%;
  justify-content: center;
`;

export const HqStore = styled.div`
  position: relative;
  width: 100%;
  height: 80%;
  background-image: url('img/hexgrid.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin-bottom: 10px;
`;
