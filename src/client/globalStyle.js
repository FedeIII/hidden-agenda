import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html {
    background-color: #445873;
    /* Stops iOS inflating text in landscape, which is one reason labels overran their boxes. */
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: monospace;
    font-size: 14px;
    letter-spacing: 5px;
    margin: 0;
    width: 100%;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  .game {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    /* This was overflow: hidden, which is why anything that did not fit was simply cut off and
       unreachable — on a phone that was the entire action bar. Content that overruns now
       scrolls. Horizontal stays hidden so one wide element cannot introduce a sideways scroll. */
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
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

  /* 5px of letter-spacing on monospace is the single biggest reason a label is wider than its
     box on a phone. Tightened rather than removed, so the look survives. Thresholds clear of
     800x600, which the browser specs are pinned to. */
  @media (max-width: 780px), (max-height: 520px) {
    body {
      letter-spacing: 2px;
    }

    .btn {
      font-size: 14px;
      letter-spacing: 2px;
      padding: 5px 8px;
    }

    .btn--small {
      font-size: 12px;
    }
  }
`;

export default GlobalStyle;
