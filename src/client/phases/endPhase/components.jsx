import styled, { css } from 'styled-components';

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
