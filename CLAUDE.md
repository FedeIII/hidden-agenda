# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Hidden Agenda: a local-multiplayer hex board game (React 16 + styled-components + webpack 4, no backend). 2–6 players share one screen and command four teams (0–3 = black/red/white/yellow) of 5 agents + CEO + spy + sniper. Each player secretly holds a *friend* and a *foe* team; the psychology is that everyone moves everyone's pieces. Published at https://fedeiii.github.io/hidden-agenda/ from the committed `docs/` build.

## Scheduled to change — read `MULTIPLAYER-PLAN.md` first

Everything below describes the repo **as it is today** and is accurate. But five of these
facts are slated for removal in Phase −1 of `MULTIPLAYER-PLAN.md`, so don't invest in them:

- **webpack 4 → Vite.** Webpack 4 hashes with md4 and is expected to fail on Node 17+
  (`ERR_OSSL_EVP_UNSUPPORTED`); local Node is v22. Verify before debugging a build.
- **`img/` + `docs/img/` duplication goes away** — `public/img/` becomes the single source.
- **react-dnd is being removed** in favour of native pointer events (HTML5 drag events
  don't fire on touch devices, and the game needs to work on phones).
- **react-router is being removed** in favour of a `phase` switch fed by the server.
- **In-place piece mutation in `pz` is being purged** — it silently corrupts
  `piecesPrevState` and blocks React 18. Don't add new mutating helpers.

## Commands

```bash
npm install                       # node_modules is not checked in
npm run go                        # webpack-dev-server (dev, opens browser); no port configured -> 8080
npm run do                        # production build into docs/  (see "docs/ is the published build")
npm test                          # full puppeteer suite
npm run smoke                     # smoke test only
npx jest src/tests/spy.test.js    # one file
npx jest src/tests/spy.test.js -t 'can kill'   # one test
npx eslint src                    # eslint/prettier are installed but have no npm script
```

### Running tests

The suite is end-to-end Puppeteer, not unit tests: every test drives a real Chrome against a running app.

- `src/tests/helpers/setupTests.js` navigates to `http://localhost:8081`, so **a server must already be serving the app on 8081** before `npm test`. `npm run go` does not use that port — start one explicitly, e.g. `npx webpack-dev-server --port 8081` (run from the repo root so `img/` resolves).
- `src/tests/helpers/initBrowser.js` hardcodes `executablePath: '/Applications/Google Chrome.app/...'` — macOS-only, and the path must exist.
- `afterEach` writes `test.png` (gitignored) — useful for debugging a failing test.
- Tests interact only through DOM ids via `helpers/clickOn.js` and `helpers/get.js`; assertions read computed styles (e.g. a piece's direction is asserted as a CSS `transform` matrix from `DIRECTION` in `helpers/get.js`, highlight as `brightness(2)`). If you change styling of pieces/cells you will break tests, and vice versa: new mechanics need a DOM id to be testable.
- `helpers/navigation.js#goToPlay(n)` walks the real start + alignment screens.

### Skipping to a mid-game state

`?test=play` or `?test=endgame` replaces `initialState` with `src/client/state/mocks/{play,endgame}.js` and sets `state.test`, which makes StartPhase and AlignmentPhase auto-`Redirect` (via `Hooks/useTest`). Use this to reach a board position by hand instead of clicking through phases.

## Architecture

### Two layers

`src/domain/` is pure game rules — plain functions, no React, no state container. `src/client/` is React UI and the reducer wiring. Rules belong in `domain`; components should call into it rather than re-deriving geometry or legality.

| Module | Responsibility |
| --- | --- |
| `domain/pieces/pz.js` | The big one (~1000 lines): toggling/selection, movement, legal positions per piece type, killing, snipers, CEO buffs, claim-control effects. Exported as the `pz` object with sections marked by banner comments. |
| `domain/py.js` | Players: turn order, alignments, reveal, accuse, scoring (`py` object). |
| `domain/teams.js` | Team control (who commands which team's HQ) and team point totals. |
| `domain/cells.js` | Hex board geometry. |
| `domain/utils.js` | Coord helpers, the six-direction ring, `memoize`. |
| `domain/pieces/constants.js` | `TYPES`, `STATES`, piece `IDS`, point values, end condition. |

`pz` and `py` import each other (`pz` calls `py.getTurn`, `py` calls `teams`/`py` back through the default export) — keep new cross-layer calls going through those default-exported objects, which is what makes the cycle work.

### Piece ids and DOM ids

A piece id encodes team, type and number as a string: `0-A1`, `1-C`, `3-N`. `pz.getTeam(id)` is `charAt(0)`, `getType(id)` is `charAt(2)`, `getNumber(id)` is `charAt(3)`. Team is therefore a **string** `'0'`–`'3'` everywhere, and much of the code compares with `==` deliberately because team indices arrive as both string and number. Types: `A` agent, `C` CEO, `S` spy, `N` sniper.

DOM ids the tests depend on: `pz-{pieceId}`, `hex-{row}-{cell}`, `store-{team}`, `claim-{team}`, `controlled-{team}`, `piece-count-{team}-{TYPE}`, plus `next-turn`, `snipe`, `accuse`, `reveal`, `reveal-friend`, `reveal-foe`, `start-btn`, `alignments-btn`, `player-name{n}`.

### Board geometry and directions

The board is 7 rows of `[4, 5, 6, 7, 6, 5, 4]` cells; a position is `[row, cell]`, and `[null, null]` (`OUT_POSITION`) means off-board/dead. A direction is a pair `[v, h]`: `v` is `1` up / `0` sideways / `-1` down, `h` is `1` left / `0` right — six combinations, listed in ring order in `utils.js#possibleDirections` so `directions.getPrevious/getFollowing/getOpposite` are rotations.

Translating a direction into the next cell is **not** uniform: it depends on whether you are above, on, or below the middle row (row 3), because the hex rows change width. That logic lives in `cells.js#createGetPositionInDirection`. Always go through `cells.get(position).getPositionInDirection(...)` / `getPositionsInDirection` / `getPositionAfterDirections` rather than doing coordinate arithmetic in a component or in `pz`.

### State container

`src/client/state/index.js` holds one `useReducer` behind a `withState` HOC; components read `const [state, dispatch] = useContext(StateContext)`. State slices: `players`, `hasTurnEnded`, `pieces`, `pieceState`, `followMouse`, `snipe`, `piecesPrevState`, `teamControl`.

**This is not Redux `combineReducers`.** Every slice reducer is called with the *entire previous state* plus the action and returns only its own new slice:

```js
[stateVar]: reducer(state, action)   // reducer(fullPrevState, action)
```

So `pieceStateReducer` can gate on `state.hasTurnEnded`, `piecesReducer` can read `state.teamControl`, and slice order never matters — everyone sees the pre-action snapshot. Consequence: a reducer can never observe another slice's *new* value in the same dispatch; if two slices must agree, both compute it from the old state (see how `hasTurnEndedReducer` and `pieceStateReducer` both re-derive turn-end from `pieces` + `pieceState`). Adding a slice means registering it in both the `reducers` map and `initialState`. `gameReducer` `console.log`s every action and resulting state — that log is the main debugging tool for mechanics.

Mutation caveat: parts of `pz` (`togglePiece`, `killPieces`, `killPiece`) mutate piece objects in place, and `piecesReducer` spreads the returned array (`[...result]`) to force a new reference for React. Keep that spread when adding cases.

### Turn flow

`pieceState` is a per-piece finite state machine — `SELECTION → DESELECTION | PLACEMENT | MOVEMENT → MOVEMENT2 → MOVEMENT3 → COLLOCATION` — with the exact per-type transitions written out in the header comment of `state/reducers/pieceStateReducer.js`. `undefined` means the piece is still in its HQ. `hasTurnEndedReducer` decides the turn is over from piece type + `pieceState` (a spy gets two moves, three when buffed), which gates the `NEXT TURN` button; while `hasTurnEnded` is true most reducers short-circuit and refuse further action.

`followMouse` distinguishes *aiming* from *moving*: after a move it is set per piece type, and while true a hex click/hover directs the selected piece (`DIRECT_PIECE`) instead of moving it. `piecesPrevState` is a snapshot taken on `NEXT_TURN`, used to roll back a turn's consequences when a sniper kill fires (`pz.killSnipedPiece`).

### Mechanics vocabulary in the code

- **buffed** — adjacent to its own CEO; recomputed for every piece on `NEXT_TURN` via `pz.setCeoBuffs`. Buffed agents move differently, buffed spies get a third move, buffed snipers see through pieces.
- **throughSniperLineOf** — ids of enemy snipers whose line of sight a piece crossed while moving. `SNIPE` highlights snipers that have a target; clicking a highlighted sniper kills what it saw.
- **claim control** — `teamControl[team]` = `{ player, prevPlayer, claimEnabled, controlling }`. Claiming toggles that team's CEO as selected; control becomes real (`controlling`) when the CEO is deployed, or immediately when an alignment is revealed. A player can hold only one team at a time.
- **killing a CEO** kills that team's still-undeployed pieces (`killWholeTeam` inside `pz.js`); the game ends when `NUMBER_OF_PLAYERS_KILLED_FOR_GAME_END` (3) CEOs are dead.
- **scores** — `py.getPoints`: `100 - 50` per revealed alignment `+ friendTeamPoints - foeTeamPoints`, where a team's points are its kills plus its survivors valued by `POINTS_PER_PIECE_TYPE`.

### Phases and routing

`game.jsx` mounts a `HashRouter` inside a react-dnd `DndProvider`: `/` StartPhase, `/alignment` AlignmentPhase, `/play` PlayPhase, `/end` EndPhase. Phases redirect themselves from state (PlayPhase → `/` if players aren't ready, → `/end` when `pz.hasGameFinished`), so there is no navigation controller to look for.

Each phase directory follows the same shape: `index.jsx` with the phase component and local `useXxx` hooks, `components.jsx` with its styled-components. `.js` files are styling/pure modules, `.jsx` are components.

### Drag & drop and clicks are the same path

`piece/index.jsx` (`useDrag`) and `hexagon/index.jsx` (`useDrop`) route drops into exactly the callback a click uses (`useOnCellClick` → `pz.isTogglePieceOnCellClick` / `pz.isMovePieceOnCellClick`), so a mechanic implemented for clicking works for dragging. Drag previews are directional images picked by `previewSrc`.

### Path aliases

`webpack.config.js` defines `Src`, `Client`, `Components`, `Phases`, `State`, `Hooks`, `Domain`. Jest only maps `Domain/*` (`package.json` → `jest.moduleNameMapper`), which is why test helpers import constants by relative path. If a test ever needs another alias, add it to `moduleNameMapper` too.

## docs/ is the published build

`npm run do` writes `docs/index.html`, `docs/main.js` and `docs/main.js.map`, and **those artifacts are committed** — GitHub Pages serves the folder (`docs/_config.yml` sets the Jekyll theme; `npm run deploy` = `gh-pages -d docs`). Rebuild and commit `docs/` when shipping a user-visible change.

Piece art exists twice, identical and both committed: `img/` at the repo root (what webpack-dev-server serves, since pages reference `img/...` relatively) and `docs/img/` (what the published build serves). Webpack does not copy it. Add or change art in **both**. Naming: `{team}-{TYPE}.png` for an undirected piece and `{team}-{TYPE}-{v}{h}.png` for each of the six directions (e.g. `0-A--10.png` is team 0 agent facing `[-1, 0]`).

## Conventions

- Indentation is inconsistent across files (tabs in `domain/` and `state/`, 2 spaces in several client files). Match the file you are editing.
- Releases, per git history: bump `package.json` version, add the entry under README `## Changelog`, strike through the finished `Roadmap`/`Known Bugs` line, commit as `vX.Y.Z`. Behaviour fixes land with a regression test in the matching `src/tests/*.test.js`.
