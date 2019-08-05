import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: monospace;
    font-size: 14px;
    letter-spacing: 5px;
    margin: 0;
    width: 100%;
  }

  .game {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 1;
  }

  .btn {
    font-family: monospace;
    font-size: 17px;
    color: white;
    letter-spacing: 5px;
    background-color: lightgray;
    padding: 5px 10px;
    margin: -1px 0 0 -1px;

    &, &:focus, &:active {
      border: none;
      outline: none;
    }

    &--active {
      background-color: black;
      margin: 0;
      box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14),
                  0 1px 10px 0 rgba(0,0,0,0.12),
                  0 2px 4px -1px rgba(0,0,0,0.3);
      transition: transform 0.1s ease-out,
                  box-shadow 0.1s ease-out;

      &:active {
        background-color: gray;
        margin: 1px 0 0 1px;
      }

      &:hover {
        margin: 1px 0 0 1px;
        transform: scale(1.03);
        box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14),
                    0 1px 18px 0 rgba(0,0,0,0.12),
                    0 3px 5px -1px rgba(0,0,0,0.3);
      }
    }

    &--small {
      font-size: 13px;
    }
  }
`;

export default GlobalStyle;
