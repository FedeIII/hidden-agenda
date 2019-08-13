import styled, { css } from 'styled-components';

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
        color: white;
      `;
    case '2':
      return css`
        background-color: black;
        color: white;
      `;
    case '3':
      return css`
        background-color: yellow;
      `;
  }
};

const HqStyled = styled.div`
  position: relative;
  height: 36%;
  display: flex;
  flex-direction: column;
  border: 2px solid gray;
  padding: 16px 8px;
  margin-bottom: 20px;
  justify-content: space-between;
  ${hqColor}
`;

export default HqStyled;
