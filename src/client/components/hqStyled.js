import styled, { css } from 'styled-components';
import { TEAM_COLORS } from 'Domain/teams';

const hqColor = ({ team }) => {
  switch (team) {
    default:
    case '0':
      return css`
        background-color: ${TEAM_COLORS[2]};
      `;
    case '1':
      return css`
        background-color: ${TEAM_COLORS[1]};
        color: white;
      `;
    case '2':
      return css`
        background-color: ${TEAM_COLORS[0]};
        color: white;
      `;
    case '3':
      return css`
        background-color: ${TEAM_COLORS[3]};
      `;
  }
};

const HqStyled = styled.div`
  position: relative;
  height: 50%;
  max-height: 223px;
  display: flex;
  flex-direction: column;
  border: 2px solid gray;
  padding: 8px;
  margin-bottom: 20px;
  justify-content: space-between;
  ${hqColor}
`;

export default HqStyled;
