# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Hidden Agenda: a hex board game with hidden information (React 18 + styled-components + Vite, plus a `ws` server). 2–6 players command four teams (0–3 = black/red/white/yellow) of 5 agents + CEO + spy + sniper. Each player secretly holds a *friend* and a *foe* team; the psychology is that everyone moves everyone's pieces. Published at https://fedeiii.github.io/hidden-agenda/ from the committed `docs/` build.

`MULTIPLAYER-PLAN.md` is the live plan for making it playable over the internet and deploying it to a VPS. **Phases −1, 0 and 1 are done; the client is not yet wired to the server.** Read the plan before any structural change — several decisions below exist to serve it.

Right now the game still plays hot-seat in one tab: the server exists and is tested, but `createTransport()` always returns the local store. Phase 2 connects them.

## Commands

Node >= 22.12 (`.nvmrc`, `engines`).

```bash
npm install
npx playwright install chromium   # one-time, for the test suite

npm run go        # dev server on :8081, opens a browser
npm run build     # production build into docs/   (npm run do is the same thing)
npm run serve     # serve the build on :8081

npm test              # everything, ~2 min (162 tests)
npm run test:domain   # game rules only, no browser, ~2s
npm run test:e2e      # browser specs
npm run test:ui       # interactive Playwright runner
npx playwright test agent            # one file
npx playwright test -g 'can kill'    # one test by name

npm run format        # prettier
npm run format:check
```

`npm run lint` is eslint flat config (`eslint.config.mjs`) with `js/recommended` plus the react-hooks plugin's full recommended set, which includes the React Compiler rules. **It is clean — keep it that way.** There are no stylistic rules; Prettier owns formatting.

Two deliberate suppressions, both commented at the site:

- `react-hooks/set-state-in-effect` on the turn-change reset in `accuseMenu.jsx`. The idiomatic fix is a `key` so the menu remounts, but the accuse flow has no spec, so that refactor waits for one.
- `react-hooks/rules-of-hooks` for `src/tests/**`, because Playwright names a fixture's callback `use` and the rule reads it as React's `use()` hook.

Also: `no-unused-vars` uses `args: 'none'` under `src/tests/**`, because a spec's destructured parameters are how it declares which fixtures to set up — a dependency list, not a usage.

**Do not add `import React from 'react'`.** Vite uses the automatic JSX runtime, so it is dead weight and the linter will flag it. Import the named hooks you need.

### Tests

Playwright is the only runner, with two projects:

- **`domain`** — pure game-rules specs in `src/tests/unit/`. They never request a `page` fixture, so no browser starts and they finish in ~2s. This is where the reducer-purity guards live (they deep-freeze inputs and assert the reducer does not throw), and where the server specs live too — redaction, validation and the in-process two-client socket tests all run here, with no browser.
- **`e2e`** — everything else in `src/tests/`, driving chromium.

Things worth knowing before touching the suite:

- `playwright.config.mjs` has a `webServer` block, so the suite starts and waits for `npm run serve` itself. Don't add "start a server first" instructions.
- **Viewport is pinned to 800×600 and must stay pinned.** The HQ positions its pieces with percentage offsets, so viewport size decides whether they overlap and therefore which piece a click lands on. An unpinned viewport silently broke a spec when Chrome's UI chrome height changed.
- Assertions read **computed styles** (`brightness(2)` for selected, a border colour for a highlighted cell, a `matrix()` transform for a piece's facing). Restyling pieces or cells will break tests, and new mechanics need a DOM id to be testable. Matrix comparisons are normalised numerically in `helpers/get.js` — Chrome used to report `cos(90°)` as `6.12323e-17` and now reports `0`, which broke eight assertions at once.
- Helpers are factories over a `page`, wired up as fixtures in `src/tests/fixtures.js`. Most specs take `{ page, clickOn, get, drag, goToPlay }`.
- An **uncaught page error fails the test that provoked it** (`failOnPageError` fixture). The suite was once fully green while clicking an empty cell threw a TypeError, because nothing watched for it.
- Playwright bundles a pinned chromium on purpose: browser auto-updates are what caused the fixture rot above.
- **Online specs share one game server and one IP.** The server refuses more than 10 room joins per minute per address; the online specs use 8. Playwright stops the server it started, so each *run* starts fresh — but adding another online spec that joins twice will trip the limit and fail in a way that looks nothing like a rate limit. Raise `JOINS_PER_IP_PER_MINUTE` for the test server rather than lowering the protection.
- **The e2e suite runs `dist-server/main.mjs`, not `server/` source.** The playwright config rebuilds it before starting, because testing against a stale server bundle is otherwise silently possible — it cost real debugging time once.
- `tsconfig.json` contains no TypeScript. It exists only so Playwright's resolver knows the import aliases, because the domain modules import each other as `Domain/*`. Keep its `paths` in step with `vite.config.mjs`.

### Skipping to a mid-game state

`?test=play` or `?test=endgame` replaces `initialState` with `src/client/state/mocks/{play,endgame}.js` and makes `Game` start directly in that phase. Useful for reaching a board position without clicking through.

## Architecture

### Three layers

`src/domain/` and `src/game/` are the **shared core**: pure game rules and the reducer, with no React and no browser globals. `src/client/` is the UI. `server/` is the multiplayer server. Both the client and the server import the core; **neither `src/domain` nor `src/game` may import from `src/client` or `server`** — that direction is checked by eye today and is the thing to preserve.

### The server

`server/` runs the *same* `gameReducer` as the browser and is authoritative. Three properties define it, in priority order, all tested over a real socket in `src/tests/unit/server.test.js`:

1. **A seat never receives another seat's alignment.** `redact.js` projects the state per recipient, so a secret is never serialised in the first place. It fails closed: an unknown seat name sees nothing. The one exception is `phase === 'end'`, because scoring needs every alignment (`py.getPoints`).
2. **Only the seat on turn may act.** That single rule is the whole ownership model — the game deliberately lets the turn holder move *any* team's pieces. The one escape hatch is `NEXT_TURN` after the turn holder has been disconnected for 60s, so a closed laptop cannot end a game permanently.
3. **Legality is re-derived server-side** from `pz.getHighlightedPositions` / `pz.getPossibleDirections`. In the local game legality was only ever enforced by which hexagons the UI made clickable.

Things not to undo:

- **`START_GAME` and `SET_ALIGNMENT` are absent from the actions a client may send.** Starting a game and dealing cards belong to the server; a client asking for either gets `action_not_allowed`.
- **A room holds no sockets.** It stays plain JSON so `persistence.js` can write it per file, which is what lets a deploy restart without killing games in progress. Live sockets live in a `Map` keyed by seat id in `index.js`.
- **Persistence is best-effort on purpose.** `/var/lib` is not writable on a dev machine, so it disables itself and logs; failing to save must never take the server down.
- `createGameServer()` (in `index.js`) is separate from the process entry (`main.js`) so tests can create a server without binding a port or installing signal handlers.

Build with `npm run build:server` → `dist-server/main.mjs` (committed, like `docs/`). Note the **`.mjs`** extension, and that `vite.server.config.mjs` needs `publicDir: false` or the bundle acquires all 116 piece images.

### Inside the shared core

`src/domain/` is the game rules — plain functions, no state container. `src/game/` is the reducer, the actions and the store built on top of them. Rules belong in `domain`; components call into it rather than re-deriving geometry or legality.

| Module | Responsibility |
| --- | --- |
| `domain/pieces/pz.js` | The big one (~1000 lines): toggling/selection, movement, legal positions per piece type, killing, snipers, CEO buffs, claim-control effects. Exported as the `pz` object, with sections marked by banner comments. |
| `domain/py.js` | Players: turn order, alignments, reveal, accuse, scoring (`py` object). |
| `domain/teams.js` | Team control (who commands which team's HQ) and team point totals. |
| `domain/cells.js` | Hex board geometry, plus `CELLS_BY_ROW` / `ROW_NUMBERS`. |
| `domain/deal.js` | Deals the hidden friend/foe alignments. Pure and takes an `rng` because Phase 1 moves it to the server. |
| `domain/phases.js` | The four phase names. In `domain` because the server will send these strings. |
| `domain/utils.js` | Coord helpers, the six-direction ring, `memoize`. |

`pz` and `py` import each other, which works because both go through their default-exported objects. Keep new cross-module calls doing the same.

### Reducers must stay pure

This is the one invariant to not break. `pz` used to mutate piece objects in place, and because `piecesPrevStateReducer` takes a shallow copy, `piecesPrevState[i]` *was* `pieces[i]` — so the previous-turn snapshot that the sniper rollback restores from was corrupted by the current turn.

Purity is now load-bearing three times over: React 18 StrictMode double-invokes reducers (a mutating toggle would apply twice and cancel itself), Phase 1's server keeps one state object per room and persists it, and redaction depends on being able to project state without disturbing it.

There are guards in `src/tests/unit/pieces.test.js` that deep-freeze the input and call the reducers. Don't add mutating helpers; return new objects.

### Piece ids and DOM ids

A piece id encodes team, type and number as a string: `0-A1`, `1-C`, `3-N`. `pz.getTeam(id)` is `charAt(0)`, `getType(id)` is `charAt(2)`, `getNumber(id)` is `charAt(3)`. Team is therefore a **string** `'0'`–`'3'` everywhere, and much of the code compares with `==` deliberately because team indices arrive as both string and number. Types: `A` agent, `C` CEO, `S` spy, `N` sniper.

DOM ids the tests depend on: `pz-{pieceId}`, `hex-{row}-{cell}`, `store-{team}`, `claim-{team}`, `controlled-{team}`, `piece-count-{team}-{TYPE}`, plus `next-turn`, `snipe`, `accuse`, `reveal`, `reveal-friend`, `reveal-foe`, `start-btn`, `alignments-btn`, `player-name{n}`.

### Board geometry and directions

7 rows of `[4, 5, 6, 7, 6, 5, 4]` cells; a position is `[row, cell]`, and `[null, null]` (`OUT_POSITION`) means off-board/dead. A direction is a pair `[v, h]`: `v` is `1` up / `0` sideways / `-1` down, `h` is `1` left / `0` right — six combinations, listed in ring order in `utils.js#possibleDirections` so `directions.getPrevious/getFollowing/getOpposite` are rotations.

Translating a direction into the next cell is **not** uniform: it depends on whether you are above, on, or below the middle row (row 3), because the hex rows change width. That logic lives in `cells.js#createGetPositionInDirection`. Always go through `cells.get(position).getPositionInDirection(...)` / `getPositionsInDirection` / `getPositionAfterDirections` rather than doing coordinate arithmetic in a component or in `pz`.

The board renders two extra cells per row and an extra row above and below, so a piece on the border can still be pointed outwards. Those edge hexagons have ids like `hex--1--1`.

### State container

`src/client/state/index.jsx` holds one `useReducer` behind a `withState` HOC; components read `const [state, dispatch] = useContext(StateContext)`. Slices: `players`, `hasTurnEnded`, `pieces`, `pieceState`, `followMouse`, `snipe`, `piecesPrevState`, `teamControl`.

**This is not Redux `combineReducers`.** Every slice reducer is called with the *entire previous state* plus the action and returns only its own new slice:

```js
[stateVar]: reducer(state, action)   // reducer(fullPrevState, action)
```

So `pieceStateReducer` can gate on `state.hasTurnEnded`, and slice order never matters — everyone sees the pre-action snapshot. That last part used to be a lie: `pieces` runs before `pieceState`, and while `piecesReducer` mutated in place, `pieceStateReducer` was reading the already-toggled `selected` flag out of what is nominally the old state. It now derives intent from the pre-action value explicitly (`togglePieceState`). If you find a reducer that seems to need another slice's *new* value, that is the trap — recompute it from the old state instead.

Adding a slice means registering it in both the `reducers` map and `initialState`.

### Turn flow

`pieceState` is a per-piece finite state machine — `SELECTION → DESELECTION | PLACEMENT | MOVEMENT → MOVEMENT2 → MOVEMENT3 → COLLOCATION` — with the exact per-type transitions written out in the header comment of `state/reducers/pieceStateReducer.js`. `undefined` means the piece is still in its HQ. `hasTurnEndedReducer` decides the turn is over from piece type + `pieceState` (a spy gets two moves, three when buffed), which gates the `NEXT TURN` button; while `hasTurnEnded` is true most reducers short-circuit.

`followMouse` distinguishes *aiming* from *moving*. `piecesPrevState` is a snapshot taken on `NEXT_TURN`, used to roll back a turn's consequences when a sniper kill fires (`pz.killSnipedPiece`).

### Mechanics vocabulary

- **buffed** — adjacent to its own CEO; recomputed for every piece on `NEXT_TURN` via `pz.setCeoBuffs`. Buffed agents move differently, buffed spies get a third move, buffed snipers see through pieces.
- **throughSniperLineOf** — ids of enemy snipers whose line of sight a piece crossed while moving. `SNIPE` highlights snipers that have a target; clicking a highlighted sniper kills what it saw.
- **claim control** — `teamControl[team]` = `{ player, prevPlayer, claimEnabled, controlling }`. Claiming toggles that team's CEO as selected; control becomes real (`controlling`) when the CEO is deployed, or immediately when an alignment is revealed. A player can hold only one team at a time.
- **killing a CEO** kills that team's still-undeployed pieces (`killWholeTeam` in `pz.js`); the game ends when `NUMBER_OF_PLAYERS_KILLED_FOR_GAME_END` (3) CEOs are dead.
- **scores** — `py.getPoints`: `100 - 50` per revealed alignment `+ friendTeamPoints - foeTeamPoints`, where a team's points are its kills plus its survivors valued by `POINTS_PER_PIECE_TYPE`. Note this needs *every* player's alignment, which is why Phase 1 stops redacting at the end of the game.

### Phases

`game.jsx` renders one of four phases from a single `phase` value; each phase calls `onReady` when done, and the end phase is derived from `pz.hasGameFinished`. There is no router — the app has no URLs worth sharing, and Phase 2 replaces the `useState` with the phase the server reports, leaving the switch alone.

Each phase directory has `index.jsx` with the phase component and local `useXxx` hooks, and `components.jsx` with its styled-components. `.js` files are styling/pure modules, `.jsx` are components.

### Dragging is ours

`src/client/drag/` is a small pointer-event drag controller; there is no drag library. A press that moves past 6px selects the piece and shows a ghost following the pointer, and releasing resolves the hexagon under the point via `elementFromPoint` and runs the cell action. A press that doesn't move stays a plain click.

Clicking a cell and dropping on a cell are the same operation, which is why that logic lives in `Hooks/useCellAction` and both the hexagon and the drag controller call it.

This replaced react-dnd because **HTML5 drag-and-drop does not fire on touch devices** — on a phone the game could only be tapped. Two consequences: pieces need `touch-action: none` and `draggable="false"` (see `components/pieceStyled.js`), and there are touch-drag specs driven through CDP because `page.touchscreen` only taps.

### The board renders 53 hexagons

`TableBoard` computes highlights and aim **once** and passes them down; `Hexagon` is a real component that owns its own hooks. It used to be a plain function called in a loop that held `useContext`/`useCallback` and recomputed `pz.getHighlightedPositions` for every cell. Keep expensive derivations in `TableBoard`, not per-hexagon.

### Path aliases

`vite.config.mjs` defines `Src`, `Client`, `Components`, `Phases`, `State`, `Hooks`, `Domain`. `tsconfig.json` mirrors them for Playwright. Both lists must be updated together.

## docs/ is the published build

`npm run build` writes `docs/`, and **the output is committed** — GitHub Pages serves the folder, and Phase 3 has nginx serving it on the VPS. Rebuild and commit `docs/` when shipping a user-visible change.

- Assets are **content-hashed**, and must stay that way: the target VPS serves `*.js` with `Cache-Control: immutable` for a year, so a fixed filename would pin stale code in returning browsers.
- `base: './'` keeps one build working both under the Pages subpath and at a domain root.
- Piece art lives in **`public/img/`** only; the build copies it into `docs/img/`. `public/_config.yml` is there for the same reason — `emptyOutDir` would otherwise delete the Pages Jekyll theme.
- Art naming: `{team}-{TYPE}.png` for an undirected piece and `{team}-{TYPE}-{v}{h}.png` per direction (e.g. `0-A--10.png` is team 0's agent facing `[-1, 0]`).

## Conventions

- Prettier owns formatting (tabs, 120 columns, single quotes, trailing commas). Run `npm run format` before committing. `docs/` and `*.md` are ignored.
- `dependencies` is empty on purpose and reserved for what the *server process* will need at runtime (`ws`, from Phase 1). Everything the browser needs is compiled into the committed bundle, so it all belongs in `devDependencies` — this keeps `npm ci --omit=dev` on the VPS down to almost nothing. There is a note in `package.json` saying so.
- Releases, per git history: bump `package.json` version, add the entry under README `## Changelog`, strike through the finished `Roadmap`/`Known Bugs` line, commit as `vX.Y.Z`. Behaviour fixes land with a regression test.
