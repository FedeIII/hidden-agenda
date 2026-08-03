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

./dev.sh          # the whole dev env: client, game server, server rebuild watcher
./dev.sh --help   # flags: --preview --inspect --no-server --clean --no-open

npm run go        # client only, no game server — online mode will not connect
npm run build     # production build into docs/   (npm run do is the same thing)
npm run serve     # serve the build on the client port

npm test              # everything, ~2 min (225 tests)
npm run test:domain   # game rules only, no browser, ~2s
npm run test:e2e      # browser specs
npm run test:ui       # interactive Playwright runner
npx playwright test agent            # one file
npx playwright test -g 'can kill'    # one test by name

npm run format        # prettier
npm run format:check
```

`dev.sh` is the one command that gives you a working game: `npm run go` alone serves a client whose `/ws` proxy points at nothing, so online mode cannot connect and the failure looks like a client bug. It pins rooms to `.dev-rooms/` (the server's default `/var/lib` is unwritable here, so persistence would disable itself and every rebuild would drop the game in progress) and lifts `HA_JOINS_PER_MINUTE`, because six seats and a few reloads all join from one address.

**Local dev ports live in `ports.mjs` — 3017 client, 3018 game server, 9559 inspector — and nowhere else.** `vite.config.mjs` and `playwright.config.mjs` import it; `dev.sh` reads it through one `node -e`; `.vscode/launch.json` is the only place that repeats the numbers, because launch configs cannot compute. They are allocated in `~/Projects/LOCAL_PORTS.md`, the machine-wide registry that exists so every project can run at once — **3007 is another project's backend and 9229 is claimed three times over**, and this project used to sit on both. A collision fails as "port is held by pid …", which from inside the editor used to surface as nothing more than "errors exist after running preLaunchTask".

`ports.mjs` governs local dev only. **Production is still 3007**, set explicitly in `deploy/pm2/ecosystem.config.cjs` with nginx proxying to it, and `DEFAULT_PORT` in `server/index.js` still matches — the box has nothing to collide with. Nothing in the committed build depends on any of this: the client derives its socket URL from `window.location.host`, so no port is compiled in and a port change needs no rebuild.

Four things about it worth keeping, each of which leaked a port when it was missing:

- It invokes `node_modules/.bin/vite`, not `npx`. An `npm exec` middleman between the script and the process actually holding the port is what turns Ctrl-C into an orphaned server.
- It tears down by walking the process tree, children first. `set -m` and one kill per process group is *not* a fix: bash only gives a background job its own group when it can, and a script started without a controlling terminal silently gets none — same script, one run isolated, one not.
- It traps HUP and PIPE as well as INT and TERM. Closing the editor's terminal panel sends HUP; `./dev.sh | head` sends PIPE. And `cleanup` ignores PIPE and drops `set -e` before it prints anything, or its own first message re-raises the signal and kills the teardown half-done.
- It `unset`s `NODE_OPTIONS` and `VSCODE_INSPECTOR_OPTIONS`. The editor injects those so its debugger auto-attaches to every node process below the task — including vite and the rebuild watcher — and the debug session's teardown then SIGTERMs the script and takes the env with it. `kosmos/dev.sh` on this machine carries the same line for the same reason.

**`dev.sh` and the test suite cannot run at the same time.** Playwright starts its own pair on the same two ports (`webServer` in `playwright.config.mjs`), and with `reuseExistingServer` outside CI it will quietly test against whatever `dev.sh` left running — including, in `--preview` mode, a `docs/` build you have since changed.

`.vscode/launch.json` and `tasks.json` drive all of this from Cursor: ⇧⌘B runs `dev`, F5 runs **Dev: play** (the env plus a browser debugger), and **Dev: client + server debugger** adds a node debugger to the server for breakpoints on both sides of the socket. The server configs debug `dist-server/main.mjs`, which is legible because that bundle is built `minify: false, sourcemap: true`.

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
- **The shared `page` fixture navigates to `?skin=dossier`, and a spec that navigates for itself has to carry the param too.** A hot-seat game draws one of three skins on the way into the alignment phase, so without the pin every spec would be asserting against a different look each run — which fails as a click landing a pixel off rather than as anything that mentions a skin. Online specs need nothing: the test server's `HA_SKIN` covers them.
- **Online specs share one game server and one IP.** In production the server refuses more than 10 room joins per minute per address, which caps how many online specs there can be — they all join from one address, two joins each. Rather than weaken that, `JOINS_PER_IP_PER_MINUTE` reads `HA_JOINS_PER_MINUTE`, and `playwright.config.mjs` sets it to 60 for the test server. Do not lower the default; raise the env var. Tripping the limit fails in a way that looks nothing like a rate limit.
- **The e2e suite runs `dist-server/main.mjs`, not `server/` source.** The playwright config rebuilds it before starting, because testing against a stale server bundle is otherwise silently possible — it cost real debugging time once.
- **The browser has WebGL 2 through SwiftShader**, so the e2e suite exercises the 3D renderer, in software, on every spec. That is deliberate — it is the path players get — but it is why the suite went from about 45 seconds to a little over two minutes, and why the renderer drops multisampling and pixel ratio when it detects a software rasteriser. Anything that makes the board fill more pixels per frame shows up here first.
- **It runs the committed `docs/` too, not `src/`.** `npm run serve` is `vite preview`, which serves the build. Unlike the server bundle, nothing rebuilds it for you: **run `npm run build` after any client change or the suite tests the previous one.** The failure is quiet and points the wrong way — a new spec fails asserting behaviour the source clearly has, because the browser never received it.
- `tsconfig.json` contains no TypeScript. It exists only so Playwright's resolver knows the import aliases, because the domain modules import each other as `Domain/*`. Keep its `paths` in step with `vite.config.mjs`. **It must keep `noEmit` and stay without `baseUrl`**, and neither is cosmetic: an editor cannot tell this file is not a real TS project, so it contributes a `tsc: build` task for it, and running that asks tsc to compile 86 `.js` files in place — every one failing with *"Cannot write file … because it would overwrite input file"*, which reads as a project that does not compile. `baseUrl` is separately deprecated in TypeScript 6 (what Cursor bundles) and errors, so the `paths` targets are relative (`./src/*`) instead, which is how `paths` works without it. `.vscode/settings.json` also turns the auto-detected tsc tasks off, so both the trigger and the symptom are gone. Verified with Cursor's own bundled compiler, and the domain project still resolves `Domain/*`.

### Skipping to a mid-game state

`?test=play` or `?test=endgame` replaces `initialState` with `src/client/state/mocks/{play,endgame}.js` and makes `Game` start directly in that phase. Useful for reaching a board position without clicking through. Note neither mock has a piece on the board — both start with all 32 in their HQs.

`?flat` turns the 3D renderer off and gives you the original CSS board, which is the fastest way to tell whether a bug is in the game or in the renderer.

`?skin=dossier|blueprint|vault` pins the visual direction instead of drawing one. **Local mode only** — online the room's skin wins, because the table has to agree. It exists because otherwise the only way to see a direction is to restart games until the draw goes your way, and because the browser suite needs it: every spec walks the real start → alignment flow, and that flow draws a skin.

## The three skins

The interface comes in three committed visual directions — **Dossier** (the file room: manila, typewriter, rubber stamps), **Blueprint** (industrial secrets: cyanotype, chalk line work, drafted controls) and **Vault** (the attaché case: gunmetal, brass, bevels). `src/domain/skins.js` holds the names and `pickSkin(rng)`; `src/client/theme/` holds what they look like.

**The names are in `domain` for the same reason the phases are: the server sends them.** Nothing about how a skin looks belongs there.

Who chooses, and when:

- **The main menu is always Dossier.** A game starts as a form on a desk; it only gets a look of its own later. `?test=` also pins it, so a spec dropped straight into a mid-game state is deterministic.
- **Hot-seat draws on the way in to the friend-and-foe cards** — the moment the game stops being a form — and keeps it for the rest of the evening. That is `createLocalSession#advance` in `net/transport.js`. Dossier is in the draw, so staying is a real outcome rather than a missed one.
- **Online, the room owns it.** `createRoomStore#create` draws it once with the server's `rng`, it lives on the room next to the phase, and `roomMessage` sends it — so every seat is told the same one in the same frame as the seat list, and the waiting room already looks like the game will. `HA_SKIN` pins it (set in `playwright.config.mjs`, same shape as `HA_JOINS_PER_MINUTE`: don't lower the default, override the env). A client's own `?skin=` is inert online.
- The skin lives on **the session** in both modes, so `useSkin()` has no branch in it. `useSkinAttribute` writes it to `data-skin` on `<html>` — on the document rather than a wrapper, because the canvas is a sibling of `.game` and sits *under* it, so a background inside the app is a filter over everything the renderer drew.

**It is custom properties, not a `ThemeProvider`, and that is not a preference.** styled-components injects a rule per distinct interpolated value and reclaims none, so a theme threaded through templates mints a second and third class for every component in the app — the same leak the projected-pixel rule in the 3D section exists to prevent. `theme/skinStyle.js` builds one static `:root[data-skin=…]` block per skin at module load; switching skin is one attribute write and nothing is re-injected. The consequence to respect: **everything a skin changes has to be expressible as a value**, which is why there are tokens for a `clip-path`, a rotation and a `background-image`, and why a direction that wants no ornament sets the token to `none` rather than omitting it.

Three things a skin may not touch, each of which would break the game rather than merely restyle it:

- **Any length that decides where a hexagon lands.** Every hexagon and every piece is a transparent DOM element laid on the projection of its own tile, and the drag controller and the whole suite hit-test against those boxes.
- **A border's width.** Its colour, freely. The turn strip sits above the board, so a 2px rule in one direction and none in another moves every tile down two pixels — which is why the title tokens are `2px solid transparent` where a direction wants no rule. `skin.test.js` asserts a cell's size and its offset *within the board* are identical across all three. Absolute position is deliberately not asserted: the strip is set in each direction's own face and carries its own button border, so the whole board legitimately sits a pixel or two higher in one than another, and the boxes move with it.
- **The feedback colours.** A legal cell's red and a selected piece's `brightness(2)` are the one piece of vocabulary a returning player owns, and `helpers/get.js` reads them as literal computed strings. They are absent from the token table on purpose.

The one thing about the *board* a skin does change is the plinth the tiles are seated in — `palette.js#boardColors(skin)`, fed to `boardScene`. Its materials are cached per skin, because `sharedAsset` is a module-level cache and a key that ignored the skin would hand the second room the first room's colours. Tiles, tokens and trays are settled and identical in all three.

## Architecture

### Three layers

`src/domain/` and `src/game/` are the **shared core**: pure game rules and the reducer, with no React and no browser globals. `src/client/` is the UI. `server/` is the multiplayer server. Both the client and the server import the core; **neither `src/domain` nor `src/game` may import from `src/client` or `server`** — that direction is checked by eye today and is the thing to preserve.

### The server

`server/` runs the *same* `gameReducer` as the browser and is authoritative. Three properties define it, in priority order, all tested over a real socket in `src/tests/unit/server.test.js`:

1. **A seat never receives another seat's alignment.** `redact.js` projects the state per recipient, so a secret is never serialised in the first place. It fails closed: an unknown seat name sees nothing. The one exception is `phase === 'end'`, because scoring needs every alignment (`py.getPoints`).
2. **Only the seat on turn may act**, with one deliberate inversion. That rule is nearly the whole ownership model — the game lets the turn holder move *any* team's pieces, so there is nothing per-piece to check. The inversion is the **snipe**: arming `SNIPE` and toggling a lit sniper are how the rest of the table answers the move that was just made, so they are refused *to* the turn holder (`not_your_snipe`) and allowed to everyone else. `isSnipeAction` in `validate.js` is deliberately narrow — a toggle only counts when `snipe` is set and that piece is a sniper with `highlight` — because widening it would hand a non-turn seat an ordinary move. There is also an escape hatch: `NEXT_TURN` after the turn holder has been disconnected for 60s, so a closed laptop cannot end a game permanently.
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

### The board renders 61 hexagons

37 playable — `4+5+6+7+6+5+4` — plus a ring of 24 beyond the edge so a piece on the border can still be pointed outwards. (This section used to say 53, which was wrong in both halves.)

`TableBoard` computes highlights and aim **once** and passes them down; `Hexagon` is a real component that owns its own hooks. It used to be a plain function called in a loop that held `useContext`/`useCallback` and recomputed `pz.getHighlightedPositions` for every cell. Keep expensive derivations in `TableBoard`, not per-hexagon.

### The 3D layer is a skin, and the DOM is still the game

`src/client/three/` renders the play phase — board, HQ trays, pieces — in WebGL. **It draws; it does not interact.** Every hexagon and every piece is the same DOM element it always was: it has gone `opacity: 0` and been absolutely positioned onto the screen projection of the tile it stands for. Clicks, drags, hovers, `elementFromPoint` and every assertion in the suite go through that DOM exactly as before.

Five rules hold the arrangement together. Breaking any of them breaks the game quietly rather than loudly:

1. **Overlay boxes are a pure function of the anchor element's `(width, height)`.** The same camera fit produces the scene and the DOM rects, so they cannot disagree. It also makes the boxes *stable*, which is load-bearing: Playwright refuses to click an element whose bounding box moved between two animation frames, so an overlay driven by a tween would make every click in the suite time out. Animate the 3D token; never the box. For the same reason a projected piece transitions `filter` only, never `all`.
2. **`opacity: 0`, and nothing else.** A transparent element is still laid out, still hit-tested, still reports its computed border, and is still `toBeVisible()`. `visibility: hidden` and `display: none` are none of those, and they also blank `innerText`.
3. **Position with `top`/`left`, never `transform`.** `transform` is the piece's facing and is read back as a matrix by `helpers/get.js`; a translate in there changes all forty of those assertions at once.
4. **A hexagon has exactly one child when occupied and none when empty.** `helpers/get.js` resolves a piece as `#hex-r-c > *`, and `online.test.js` asserts it in strict mode. No anchor divs, no labels, no sprites inside a cell.
5. **A projected pixel value goes through the `style` prop, never through a styled-components template.** styled-components hashes and injects a rule for every distinct value it is interpolated with, and reclaims none of them — a px offset in a template leaks a class per hexagon per layout, forever. Measured: 520 rules per one-pixel resize step, 63,000 after dragging a window across two hundred pixels. `boxStyle()` in `three/view.js` returns something you hand straight to `style`.

| Module | Responsibility |
| --- | --- |
| `three/layout.js` | Where everything is, in board units. Pointy-top grid, `cellToWorld`, the HQ's eight sockets, the two camera elevations, and `directionToAngle` — the single table of the six bearings, which `components/pieceStyled.js` now also uses for its CSS `rotate()`. **This module and `palette.js` are deliberately free of any three.js import**, because styled-components read from both; keep it that way or the flat path starts pulling in a renderer it will never run. |
| `three/view.js` | The camera, and world → CSS pixels. `fitCamera` solves for its own distance and pan, so the board frames itself into whatever box the layout hands it. |
| `three/stage.js` | One renderer, one fixed full-viewport canvas, many views — each scissored to the DOM element it is anchored to. Owns the frame loop, which stops when there are no views. |
| `three/geometry.js` | The hex prism, by hand: chamfered, flat-shaded, three material groups, and UVs that put the token art square on the top face. Plus the nose wedge. |
| `three/{assets,palette,lighting}.js` | Shared geometry, textures and materials; the colours; three lights and no shadow maps. |
| `three/{boardScene,hqScene}.js` | The two scenes. Each exposes `layout()` (the overlay boxes) and `setState()`, which returns `false` when nothing visible changed. The board also owns the *hand* — `grab`/`carryTo`/`drop`. |
| `three/flight.js` | The two facts a piece crossing scenes needs: where it was last seen on screen, and which piece is currently in the air. Plus the board's hand, published for the drag controller above it. |
| `three/useThreeView.js` | Binds a scene to a ref and hands back the layout. Returns `null` when there is no renderer, which is what puts the flat board back. |

### Picking a piece up

Dragging carries the actual token. The DOM still decides everything — which piece was pressed, which cell it was released over, whether that is legal — and the renderer only draws the answer; `src/client/drag/` is unchanged in every respect except that it asks the board to carry the piece instead of showing an `<img>` ghost.

A token cannot literally travel between scenes: an HQ tray and the board are separate views with separate cameras, and neither can draw into the other's rectangle. So the board draws the whole journey. Three things make that work:

- **The board renders last** (`order: 1`) and views **composite** rather than each clearing its own rectangle — the canvas is wiped once per frame and only depth is cleared between views. A piece carried out of a tray therefore passes over it rather than under it.
- **`overlay()`, and `widen()` with it.** While something is in the air the board's scissor opens up to the whole of `.game` — and so does its **viewport**, which is the part that is not optional. A scissor does not let a view draw outside its element: the viewport is a hard edge, WebGL clips a primitive to it whatever the scissor allows, and with the scissor alone a token lifted out of a tray was simply absent over the tray and then arrived cut in half at the board's own left edge, to the pixel. A wider viewport with the same camera would rescale the board inside it and take all 61 hexagons out from under the invisible boxes that get clicked, so `view.js#widen` pushes the frustum off centre by exactly the amount that puts the element's own rectangle back on the pixels it already had (`camera.setViewOffset`, with the element as the "full size" and a *larger*, negatively offset sub-window — the arithmetic is linear and does not mind). Nothing else in the scene reaches past the bounds the camera was fitted to, so the extra rectangle reveals only the thing that asked for it. `project`/`unproject` deliberately keep their own camera, untouched by any of this, because every overlay box and every pointer position goes through them.
- **`flight.js` remembers where each piece was last drawn.** A token arriving on the board starts there and flies in — which is the same mechanism for a click and for a drop, so both animate and neither is a special case. Height is a function of distance left, so a deploy from an HQ lofts across the table and a one-cell move barely leaves the board.

Two things to know before touching it: a carried piece is exempt from `setState`'s cleanup (the game does not think it is on the board — it is not, yet), and `update()` must report itself as animating while carrying, because the pointer moves the piece and the pointer does not go through the tween. Without that the frame loop settles and the piece freezes where it was last drawn.

Things not to undo:

- **The fallback is not decoration.** No WebGL, or a lost context, and `useThreeView` returns `null`, no component gets a `box`, and every one of them renders exactly as it did before the 3D layer existed. `?flat` forces it, and `three.test.js` covers both paths — including one spec asserting the 3D path is genuinely live, because without it a silent WebGL failure would leave the suite green while testing the renderer this replaced.
- **A colour is never darkened by multiplying a `Color`.** Under three.js colour management a `Color`'s channels are linear, so multiplying by 0.64 does not darken by 36% in the space the value was authored in. The board's five tile shades are written out in `palette.js` as the values `polished`'s `darken()` actually produces.
- **The lights sum to about π on purpose, and metalness is not a free dial.** A diffuse surface comes out at irradiance / π times its own colour, so the four lights in `lighting.js` have to add up to roughly π for a colour to render as the colour it was written down as. They summed to a little over half of that for a while, and every token was drawn at about 0.4 of its own artwork — which looks like a palette that is too dark and is not one. Metalness compounds it: there is no environment map and there is not going to be one (that is a texture fetch per fragment in a renderer that is fill-bound and rasterises in software in the suite), so metalness scales diffuse by `1 - metalness` and hands what it took to a specular term with nothing but two directional lights to reflect. A little earns its keep on a chamfer; past about 0.4 it is a darker colour written the long way round. To make the whole board brighter or darker, scale the lights together — the ratios between them are the lighting, the sum is the exposure — and leave `palette.js` alone.
- **The canvas is *under* `.game`, so any DOM background is in front of the 3D.** It is a sibling of the app rather than a layer over it, which is what keeps every hexagon clickable. The consequence is easy to forget: the HQ card's smoked glass tints the rack the renderer drew behind it, and at the 0.28 alpha it started on it was quietly taking a quarter off every tray. A DOM background over anything the renderer paints is a filter on it, not a backdrop.
- **Overlay hex boxes are a column pitch wide and a row pitch tall**, which tiles the plane exactly — no gaps, no overlaps. Their own bounding boxes would overlap adjacent rows by a quarter of their height, and which of two invisible boxes a click landed on would come down to DOM order.
- The board's height comes from a `::before` spacer on `TableBoardStyled` in 3D mode, because its rows no longer have any. It only bites in the stacked phone layout; everywhere else `Board` has a height and the board is a stretched flex item. Do not turn it into a real height: the landscape phone layout has **zero** slack before the action bar falls off the bottom.
- Rendering is fill-bound, not draw-call-bound. Two things measured: turning multisampling off when the renderer is software (a quarter off the suite's wall clock), and scissoring each view down to the rectangle its scene actually paints into, `projector.extent()` (another third off a click). Repainting views individually rather than all together was tried, saved nothing, and left trays blank.
- **The context is created with the attributes it is meant to have, once.** A second `getContext` on a canvas returns the first context and silently discards the attributes — so the software-renderer probe lives on a throwaway canvas in `support.js`. Probing the real one is how this ran 4× multisampling on a CPU rasteriser for a while whilst the code said it did not.
- Nothing moves at rest: the loop drops to ten polls a second when no view is animating and nothing has asked to be drawn, and stops entirely when the last view goes. `prefers-reduced-motion` removes the travel, the lift and the sniper's pulse, because continuous motion is something this layer introduced and the flat renderer never had.
- A known limitation, not a bug to chase: on a phone held sideways the HQ store is about 34px tall, so a socket projects to roughly 13×8 pixels. Small, but unambiguous — every piece hit-tests to itself. The flat renderer's answer at that breakpoint was pieces that overlapped almost completely, where which one a tap reached came down to DOM order.

### Path aliases

`vite.config.mjs` defines `Src`, `Client`, `Components`, `Phases`, `State`, `Hooks`, `Domain`. `tsconfig.json` mirrors them for Playwright. Both lists must be updated together.

## docs/ is the published build

`npm run build` writes `docs/`, and **the output is committed** — GitHub Pages serves the folder, and Phase 3 has nginx serving it on the VPS. Rebuild and commit `docs/` when shipping a user-visible change.

- Assets are **content-hashed**, and must stay that way. `hidden-agenda.azyr.io` sets its own `immutable` on `/assets/` precisely because the names change every build; a fixed filename would pin stale code in returning browsers for a year. (The apex `azyr.io` site has the same rule for `*.js`, but it is server-scoped, so nothing is inherited — the new site had to opt in.)
- `base: './'` keeps one build working both under the Pages subpath and at a domain root.
- Piece art lives in **`public/img/`** only; the build copies it into `docs/img/`. `public/_config.yml` is there for the same reason — `emptyOutDir` would otherwise delete the Pages Jekyll theme.
- Art naming: `{team}-{TYPE}.png` for an undirected piece and `{team}-{TYPE}-{v}{h}.png` per direction (e.g. `0-A--10.png` is team 0's agent facing `[-1, 0]`).

## Conventions

- Prettier owns formatting (tabs, 120 columns, single quotes, trailing commas). Run `npm run format` before committing. `docs/` and `*.md` are ignored.
- `dependencies` is empty on purpose and reserved for what the *server process* will need at runtime (`ws`, from Phase 1). Everything the browser needs is compiled into the committed bundle, so it all belongs in `devDependencies` — this keeps `npm ci --omit=dev` on the VPS down to almost nothing. There is a note in `package.json` saying so. **`three` is a `devDependency` for exactly that reason**, despite being the largest thing the browser downloads: it took the client bundle from 282 kB to about 880 kB raw (236 kB gzipped). Assets are content-hashed and cached for a year, so that is a one-off per release.
- Releases, per git history: bump `package.json` version, add the entry under README `## Changelog`, strike through the finished `Roadmap`/`Known Bugs` line, commit as `vX.Y.Z`. Behaviour fixes land with a regression test.
