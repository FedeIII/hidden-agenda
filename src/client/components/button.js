import styled, { css } from 'styled-components';

const size = ({ small }) => {
  if (small) {
    return css`
      font-size: 13px;
    `;
  }
};

const onActive = ({ active }) => {
  if (active) {
    return css`
      background-color: black;
      margin: 0;
      box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
        0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
      transition: transform 0.1s ease-out, box-shadow 0.1s ease-out;

      &:active {
        background-color: gray;
        margin: 1px 0 0 1px;
      }

      &:hover {
        margin: 1px 0 0 1px;
        transform: scale(1.03);
        box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14),
          0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.3);
      }
    `;
  }
};

const Button = styled.button`
  font-family: monospace;
  font-size: 17px;
  color: white;
  letter-spacing: 5px;
  background-color: lightgray;
  padding: 5px 10px;
  margin: -1px 0 0 -1px;

  ${size}
  ${onActive}

  &,
  &:focus,
  &:active {
    border: none;
    outline: none;
  }
`;

export default Button;
