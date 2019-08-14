import styled, { css } from 'styled-components';

export const AlignmentPhaseContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 40px;
  max-width: 960px;
  width: 66vw;
`;

export const Alignments = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 60px 40px;
`;

const cardColor = ({ alignment }) =>
  alignment === 'friend' ? 'mediumseagreen' : 'indianred';

const brightness = ({ disabled }) => {
  if (!disabled) {
    return css`
      filter: brightness(1.2);
    `;
  }
};

export const AlignmentCardStyled = styled.div`
  width: 200px;
  height: 324px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${cardColor};
  cursor: pointer;

  &:hover {
    ${brightness}
  }
`;

const cardTeamColor = ({ team }) => {
  switch (team) {
    default:
    case '0':
      return css`
        background-color: black;
        color: white;
      `;
    case '1':
      return css`
        background-color: red;
        color: white;
      `;
    case '2':
      return css`
        background-color: white;
      `;
    case '3':
      return css`
        background-color: yellow;
      `;
  }
};

export const AlignmentTeam = styled.span`
  font-weight: bold;
  width: 66%;
  height: 33%;
  display: flex;
  align-items: center;
  text-align: center;
  ${cardTeamColor}
`;
