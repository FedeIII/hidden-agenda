import styled from 'styled-components';

export const EndPhaseContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 40px 40px 60px;
  margin-top: 40px;
  align-items: center;
`;

export const Score = styled.div`
  text-align: center;
  font-size: 50px;
  padding: 15px;
`;

export const Points = styled.sup`
  font-size: 16px;
`;

export const PieceCountContainer = styled.div`
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const PieceCountTitle = styled.span`
  display: inline-block;
  margin-bottom: 8px;
`;

export const Table = styled.div`
  background-color: lightslategray;
  border: 2px solid gray;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 16px 8px;
  margin-bottom: 20px;
  height: 36%;
`;

export const Row = styled.div`
  letter-spacing: -3px;
  display: flex;
  align-items: end;
  justify-content: space-evenly;
  margin: 0 0 8px;
`;

const cellFontWeight = ({ big }) => big ? 'bold' : 'normal';

export const Cell = styled.span`
  display: flex;
  color: white;
  flex-flow: column;
  align-items: center;
  flex-basis: 33%;
  justify-content: space-evenly;
  font-size: 18px;
  font-weight: ${cellFontWeight};
`;

export const Scores = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 33%;
  flex-shrink: 0;
`;
