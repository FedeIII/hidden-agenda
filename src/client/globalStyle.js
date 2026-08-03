import { createGlobalStyle } from 'styled-components';
import skinBlocks from './theme/skinStyle';

// The document, and the three skins' token blocks.
//
// Everything here reads through a custom property, so switching direction is one attribute write on
// <html> and not a single rule is re-injected. See theme/tokens.js for why that matters and for the
// rule that keeps it honest: a skin may change colour, type, borders and ornament, and may not
// change anything with a length that decides where a hexagon lands.
const GlobalStyle = createGlobalStyle`
  ${skinBlocks}

  html {
    background-color: var(--ha-ground);
    /* The ground's texture belongs on the document, never on .game: the WebGL canvas is a sibling
       of .game and sits UNDER it, so a background anywhere inside the app is a filter over
       everything the renderer drew rather than a backdrop behind it. */
    background-image: var(--ha-ground-wash);
    background-attachment: fixed;
    /* Stops iOS inflating text in landscape, which is one reason labels overran their boxes. */
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: var(--ha-face);
    font-size: 14px;
    letter-spacing: var(--ha-track);
    color: var(--ha-ink);
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

  /* The bare-class button, for the handful of places that are not the Button component. Kept in
     step with components/button.js by sharing its tokens rather than its rules. */
  .btn {
    font-family: var(--ha-face);
    font-size: 17px;
    letter-spacing: var(--ha-track);
    color: var(--ha-control-ink-off);
    background: var(--ha-control-bg-off);
    border: var(--ha-control-edge-off);
    border-radius: var(--ha-control-radius);
    padding: 5px 10px;

    &, &:focus, &:active {
      outline: none;
    }

    &--active {
      color: var(--ha-control-ink);
      background: var(--ha-control-bg);
      border: var(--ha-control-edge);
      text-shadow: var(--ha-control-ink-shadow);
      box-shadow: var(--ha-control-shadow);
      transform: rotate(var(--ha-control-rotate));
      transition: transform 0.1s ease-out, box-shadow 0.1s ease-out;

      &:active {
        transform: rotate(0deg) scale(0.97);
      }

      &:hover {
        transform: rotate(0deg) scale(1.03);
        box-shadow: var(--ha-control-shadow-hover);
      }
    }

    &--small {
      font-size: 13px;
    }
  }

  /* Wide tracking on a small screen is the single biggest reason a label is wider than its box.
     Tightened rather than removed, so the look survives. Thresholds clear of 800x600, which the
     browser specs are pinned to. */
  @media (max-width: 780px), (max-height: 520px) {
    body {
      letter-spacing: 0.08em;
    }

    .btn {
      font-size: 14px;
      letter-spacing: 0.08em;
      padding: 5px 8px;
    }

    .btn--small {
      font-size: 12px;
    }
  }

  /* The skins lean on motion only for the press of a control, but a stamp that rotates and a brass
     switch that sinks are both motion this layer introduced. */
  @media (prefers-reduced-motion: reduce) {
    .btn--active,
    .btn--active:hover,
    .btn--active:active {
      transform: none;
      transition: none;
    }
  }
`;

export default GlobalStyle;
