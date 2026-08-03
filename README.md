# Hidden Agenda
An abstract board game with psychology

* **Play over the internet:** https://hidden-agenda.azyr.io — make a room, share the code, one seat per player.
* **Play hot-seat:** https://fedeiii.github.io/hidden-agenda/ — everyone round one screen.

The rules are in **[RULES.md](RULES.md)**.

2–6 players command four teams of agents on a hex board. Nobody owns a team — on your turn you move
*any* piece of *any* team. What you own is a secret pair of cards, one team whose success scores for
you and one whose success scores against you, and the whole game is reading which moves were sincere.

## Getting started

Node >= 22.12 to build and test (`.nvmrc`). The deployed server itself only needs Node 18 — see
[Deployment](#deployment).

```bash
npm install
npx playwright install chromium   # one-time, for the test suite
./dev.sh                          # the whole dev env, opens a browser
```

`dev.sh` runs the client on :3017 and the game server on :3018, and keeps the server bundle
rebuilding as you edit it. The dev server proxies `/ws` to the game server exactly as nginx does in
production, so online play works locally with no configuration — host a game in one tab and open the
`#/r/CODE` link it gives you in another. Ctrl-C stops everything.

| | |
| --- | --- |
| `./dev.sh --preview` | build `docs/` and serve that instead — what the e2e suite runs |
| `./dev.sh --inspect` | game server under the node inspector on :9559 |
| `./dev.sh --no-server` | client only, if you are running the server yourself |
| `./dev.sh --clean` | drop persisted rooms first |
| `./dev.sh --no-open` | don't open a browser |

Rooms are persisted to `.dev-rooms/` so a server rebuild doesn't drop the game in progress, and the
per-IP join limit is lifted, since every tab here shares one address.

Those port numbers live in `ports.mjs`, which vite, the Playwright config and `dev.sh` all read, so
they cannot drift apart — and they are allocated, not arbitrary. 3007, which the game server used to
take locally, belongs to another project on this machine, and 9229 is node's default inspector port
and so contested three ways. **Production is unaffected: the VPS still serves on 3007**, set
explicitly in `deploy/pm2/ecosystem.config.cjs`.

In Cursor or VS Code the same thing is **Run and Debug → Dev: play** (or ⇧⌘B), which starts it and
attaches a debugger to the browser. **Dev: client + server debugger** adds one to the server, for
breakpoints on both sides of the socket. See `.vscode/launch.json`.

The pieces on their own, if you want them:

```bash
npm run go                        # client only, no game server
npm run build:server && PORT=3018 npm run server
```

## Commands

| | |
| --- | --- |
| `./dev.sh` | client + game server + a rebuild watcher, all at once |
| `npm run go` | dev server on :3017 with hot reload (`npm run dev` is the same) |
| `npm run build` | production build into `docs/` (`npm run do` is the same) |
| `npm run build:server` | server bundle into `dist-server/main.mjs` |
| `npm run build:all` | both |
| `npm run serve` | serve the built `docs/` on :3017 |
| `npm run server` | run the built game server |
| `npm test` | the whole suite, ~2 min |
| `npm run test:domain` | game rules only, no browser, ~2s |
| `npm run test:e2e` | browser specs |
| `npm run test:ui` | interactive Playwright runner |
| `npm run lint` | eslint (flat config, clean — keep it that way) |
| `npm run format` | prettier |

## How it works

**React 18 + styled-components + Vite** in the browser, a small **`ws`** server in Node, and a shared
core that both of them run.

### Three layers

```
src/domain/  ─┐  pure game rules: board geometry, piece legality, players, scoring.
src/game/    ─┴─ the reducer, the actions, the store.   No React, no browser globals.
src/client/      the UI: phases, components, the drag controller, the socket transport.
server/          the authoritative multiplayer server.
```

The client and the server both import the core; **neither `src/domain` nor `src/game` may import from
`src/client` or `server`**. That is the layering the whole design rests on: the server enforces the
rules by running the same code the browser uses to decide what to highlight.

### The server

`server/` runs the *same* `gameReducer` as the browser and is authoritative. Three properties define
it, all tested over a real socket:

1. **A seat never receives another seat's alignment.** State is projected per recipient before it is
   serialised, so a secret is never on the wire in the first place. It fails closed — an unknown seat
   sees nothing. The one exception is the end of the game, where scoring needs every alignment.
2. **Only the seat on turn may act.** That single rule is the whole ownership model, because the game
   deliberately lets the turn holder move any team's pieces. The one escape hatch is passing the turn
   after the turn holder has been disconnected for 60s, so a closed laptop cannot end a game.
3. **Legality is re-derived server-side**, with the same domain functions the UI highlights with.

Starting a game and dealing cards belong to the server; a client cannot ask for either. Rooms hold no
sockets — they stay plain JSON so they can be written to disk per file, which is what lets a deploy
restart without killing games in progress.

### The client

A transport seam (`src/client/net/`) hands the UI a `{ getState, subscribe, dispatch }` store, so every
game component works unchanged whether the game lives in this tab or on a server. Online adds a session
observable — room, seats, phase, connection — that only the lobby and the connection banner read.

Actions apply optimistically and are replayed on top of each server snapshot until acknowledged. The
four that resolve against alignments the client cannot see (setting, revealing and accusing) wait for
the server instead, because their outcome is not predictable locally.

Dragging is our own pointer-event controller rather than a library: HTML5 drag-and-drop does not fire
on touch devices, so on a phone the game could otherwise only be tapped.

### Tests

Playwright is the only runner, with two projects:

* **`domain`** — game-rules specs in `src/tests/unit/`. They never request a `page`, so no browser
  starts and they finish in ~2s. The reducer-purity guards live here, and so do the server specs:
  redaction, validation and two clients over an in-process socket, with no browser.
* **`e2e`** — everything else, driving a pinned chromium at a pinned 800×600 viewport.

The config starts and waits for both servers itself, and rebuilds the server bundle first — testing
against a stale `dist-server` is otherwise silently possible.

`?test=play` and `?test=endgame` jump straight to a mid-game board without clicking through.

## Deployment

`npm run build` writes `docs/` and **the output is committed**, as is `dist-server/main.mjs`. Rebuild
and commit both when shipping a user-visible change.

* **GitHub Pages** serves `docs/` from `master` — hot-seat only, no server.
* **The VPS** serves the same `docs/` off disk through nginx and proxies `/ws` and `/healthz` to one
  small PM2-managed Node process. Because both artifacts are committed, the box installs exactly one
  package (`ws`) and never runs a build — which is what lets it stay on Node 18 while the toolchain
  needs Node 22.

There is no deploy webhook: `scripts/deploy-remote.sh` is the deploy. It builds locally, refuses to
ship a dirty or unpushed tree, then pulls and reloads over SSH. The runbook, the nginx site and the
PM2 config are in [`deploy/`](deploy/README.md).

Assets are content-hashed and must stay that way — the site sets `immutable` on `/assets/` for a year
precisely because the names change every build.

## Changelog
### v3.1.0
The board is in 3D.

* **A three.js renderer for the play phase** — the board, the four HQ trays and every piece are
  drawn in WebGL: extruded hex tiles inlaid in a hexagonal tray, machined chamfers that catch a key
  light, and team tokens carrying the same art they always did on their top face
  * One canvas, five views. The board and each store are scissored viewports of a single renderer
    anchored to their own DOM elements, so layout stays CSS's problem through every breakpoint
  * The game is still played on the DOM. Every hexagon and every piece is where it always was —
    transparent now, and laid exactly over the tile it stands for — so clicking, dragging, hovering
    and pointing all work the way they did, and so does the whole test suite
  * **Facing is finally visible.** Only the agent's art is an arrow: a CEO is a person, a spy is a
    person in a hat, a sniper is a symmetric crosshair, and turning a hexagon by a multiple of 30°
    leaves the same silhouette. Every piece now carries a nose
  * **The CEO buff is finally visible** too — a warm halo under a piece standing next to its own CEO
  * Legal cells stand up out of the tray and take a red rim; a selected piece lifts and lights its
    rim; a lit sniper pulses; and where a piece may be *pointed* is shown in blue, because "where I
    may go" and "where I may point" must never share a colour
  * No WebGL, or a lost context, and the original flat board comes straight back. `?flat` forces it
* **Fixed** — the board's quiet chequer was being flattened by a colour-space mistake, and a piece
  whose art had not decoded yet had a box with no height, which made it impossible to drag
* **A sniped CEO now takes its HQ with it**, like a CEO killed any other way. The cascade was written
  into the move path only, so a snipe left the marker that triggers it sitting on the corpse: the team
  went on fielding pieces until somebody's next move happened to pick the marker up and wipe the HQ
  then. Both kills go through one cascade now

### v3.0.0
Play it over the internet. Also a complete change of toolchain underneath, and the first written rules.

* **Multiplayer** — the game is playable over the internet
  * An authoritative `ws` server running the same reducer as the browser
  * Rooms with 4-character codes and shareable `#/r/CODE` links, a lobby showing who is in and who is
    offline, and the host starting the game
  * The server deals the cards, and each client only ever receives its own pair. Clients cannot send
    `START_GAME` or `SET_ALIGNMENT` at all
  * Only the seat on turn may act, and move and direction legality is re-derived server-side rather
    than trusted from the client
  * Optimistic apply with sequence acknowledgement and replay, so rapid clicks are neither dropped nor
    silently reverted. Aiming applies locally at once and goes on the wire coalesced at 50ms
  * Reconnect: a per-room seat token in `localStorage`, exponential backoff from 0.5s to 8s, and a
    banner while it happens. A refresh mid-game rejoins the same seat
  * Rooms are persisted per file, so a deploy restart does not kill a game in progress
  * Anyone may pass the turn once the turn holder has been disconnected for 60s — and only that
  * Rate limiting: a per-seat token bucket, and ten room joins a minute per address
* **Deployed** — live at https://hidden-agenda.azyr.io
  * nginx serving the static bundle and proxying `/ws`, one PM2 process, Cloudflare in front with
    Authenticated Origin Pulls enforced, matching the other subdomains on the box
  * `deploy/` holds the nginx site, the PM2 config and a runbook; `scripts/deploy-remote.sh` builds
    locally and refuses to ship a dirty or unpushed tree
  * The server bundle targets Node 18, so the box's runtime does not block the deploy, and `engines`
    describes the deployed artifact rather than the toolchain
* **Playable on a phone**
  * The action bar used to be unreachable rather than merely off-screen: `.game` was `overflow: hidden`
  * Upright, the HQs stack two-and-two above and below the board instead of being squeezed either side
    of it; sideways, the action bar wraps instead of running off the edge; the end screen stacks
  * Touch dragging works at all, which it never did under HTML5 drag-and-drop
* **A legible score breakdown** — each player is now the equation it actually is, with each alignment
  in its own framed group carrying its team's colour and its own −50 reveal cost. No scoring rule
  changed, and a spec adds the displayed terms up and checks they equal the total
* **Toolchain**
  * webpack 4 → **Vite**. webpack 4 could not build here at all: md4 hashing, which OpenSSL 3 refuses
  * jest + puppeteer → **Playwright**, one runner for both the domain and browser specs
  * React 16 → **React 18**, `createRoot` and StrictMode, which the whole suite passes against
  * react-dnd → **our own pointer-event drag controller**, 67 kB lighter and working on touch
  * react-router → **a phase value**; the app had four routes, no links and no URL worth sharing
  * **Prettier** config adopted (the repo was split between tabs and spaces), and a **working eslint**
    for the first time — the old one had never run, its config was version-incompatible
  * `dependencies` is now empty except `ws`, so `npm ci --omit=dev` on the VPS installs almost nothing.
    Around 950 packages left the tree
* **Architecture**
  * The reducer, the actions and the initial state moved to `src/game` and run outside a browser
  * A transport seam behind `useSyncExternalStore`, so no game component knows where the state lives
  * Card dealing moved to a pure `Domain/deal` with an injectable rng; phase names to `Domain/phases`
  * Board geometry consolidated in `Domain/cells`, ending a cycle back through the component that
    renders the board
  * `Hexagon` became a real component; the board works its highlights out once instead of 53 times
* **Fixes**
  * **The piece reducers no longer mutate.** They corrupted the previous-turn snapshot the sniper
    rollback restores from, and would have applied every toggle twice under StrictMode
  * Clicking an empty cell with nothing selected threw, and nothing in the suite was watching for it
  * Accusations corrupted the turn order with three or more players — invisible at two
  * A second game in the same page load dealt from a depleted deck
  * A snapshot arriving after a newer local action silently reverted it, which read as a piece
    un-selecting itself and the next click being rejected as illegal
  * Refreshing mid-game crashed on the empty table between the two frames the server sends
  * Assets were served with two different `Cache-Control` headers
  * A foe whose team scored nothing read `+ 0`, which says the opposite of what it means
  * Nine test failures from fixture rot — Chrome changed how it reports `cos(90°)` — plus two flakes
* **Documentation**
  * **[RULES.md](RULES.md)**: the full rules, derived from the implementation and verified against it,
    including an appendix of edge cases that are in the game whether or not anybody designed them
  * `CLAUDE.md`, `MULTIPLAYER-PLAN.md` and `deploy/README.md` describe what is there now
* 102 tests → **176**
* **v3.0.1**
  * Fixed the SNIPE! action, whose rule was lost in the move to multiplayer. A sniper answers the move
    that has just been made, so the shot belongs to **every player except the one on turn** — online it
    had ended up the other way round, offered only to the player who had just moved and refused to
    everybody else. The turn holder is now refused both halves of it, arming and firing, and every
    other seat is allowed both. Hot-seat keeps one live button, since one screen cannot tell who
    reached for it
  * 176 tests → **182**
* **v3.0.2**
  * A turn that leaves the board exactly as it found it no longer ends. Picking up a deployed sniper
    and putting it down again handed the turn on having changed nothing — selecting a sniper that is
    already on the board goes straight to MOVEMENT, because turning is the only move it has — and so
    did sweeping it round and back onto the heading it already had, and walking a spy off its cell and
    back onto it arriving on the facing it left with. The rule is stated once now, as a comparison
    against the board as `NEXT TURN` found it, instead of enumerated per piece
  * Aiming no longer records sniper lines. It recomputed them from the piece's own cell on every
    hover, so a piece standing in an enemy's crosshairs handed it a fresh shot just by turning on the
    spot — and, since a walk from a cell to itself goes by way of its right-hand neighbour, for a cell
    it never entered either. A move already records its whole path, which is where marks come from
  * 182 tests → **201**
* **v3.0.3**
  * The friend and foe cards a player has revealed no longer hang off the edges of a phone. They sit
    inline between `ACCUSE` and `REVEAL`, in a group that did not wrap, so two of them made it wider
    than the screen — and because the group is centred it overran *both* edges at once. `.game` clips
    horizontally, so those two buttons were not merely cut off but impossible to tap. The group wraps
    now, and a revealed card is tightened on a phone so that it usually does not have to
  * The same group carries the accuse menu, which at six players ran a hundred pixels off each side
    and left the seats at the far left unreachable
  * 201 tests → **204**

### v2.1.0
* Drag and drop controls for pieces
* **v2.1.1**
  * Fixed Claim control after turn ended
### v2.0.0
* Complete accuse/reveal mechanics
* Complete score system
* **v2.0.1**
  * Fixed test suite

### v1.5.0
* Added reveal and claim control by reveal

### v1.4.0
* Added claim control by deploying CEO

### v1.3.0
* Added player scores and winner
* **v1.3.1**
  * Fixed action buttons moving while using friend&foe reminder
* **v1.3.2**
  * Fixed snipe! mechanics
* **v1.3.3**
  * Fixed spy killing
* **v1.3.4**
  * Fixed sniper kill consecuences
* **v1.3.5**
  * Fixed spy movement

### v1.2.0
* Added alignment reminder during Play Phase

### v1.1.0
* Added alignment cards selection

### v1.0.0
* Desktop ready
* First playable version
* Local multiplayer
* **v1.0.1**
  * Fixed direction for the pieces at the border of the board

### v0.5.0
* Added End Phase with team scores

### v0.4.0
* Finished all mechanics for all pieces
* Fixed multiple movement, selection and end turn bugs

### v0.3
* Included Start Menu
* Added player turns
* Fixed blocked agents direction

### v0.2
* Finished regular Agents' movement, direction, capture, slide and blocking

### v0.1
* Initial layout for board and headquarters
* Initial mechanics of Agents' movement, direction and capture

## Roadmap
* ~~CEO path block~~
* ~~Styles in components~~
* ~~New pieces:~~
  * ~~Spy~~
  * ~~Sniper~~
* ~~pieces capture only other teams' pieces~~
  * ~~Agent~~
  * ~~Spy~~
  * ~~Sniper~~
* ~~Spy kill mechanics~~
* Sniper kill mechanics
  * ~~kill before move~~
  * ~~allow to snipe if any sniper is placed~~
  * ~~block sniper-related spawns:~~
    * ~~block sniper directions on position~~
    * ~~block pieces position in snipers lines of sight~~
    * ~~block sniper position if no available line of sight in any direction~~
  * ~~select sniper after clicking on snipe~~
  * ~~kill after move~~
  * kill priority between snipers?
* ~~CEO buffs~~
  * ~~Agent~~
  * ~~Spy~~
  * ~~Sniper~~
* ~~Cementeries~~
  * ~~assign kills~~
  * ~~show kills~~
  * ~~killing a ceo kills the rest of team pieces~~
* ~~Game ending~~
* ~~Scores~~
  * ~~team scores~~
    * ~~killed pieces~~
    * ~~survivor pieces~~
    * ~~piece score table~~
  * ~~player scores~~
* ~~Alignment cards~~
* ~~Reveal mechanics
* ~~Accuse mechanics~~
* ~~Claim control mechanics~~
  * ~~deploying CEO~~
  * ~~revealing~~
* ~~Drag&Drop~~
* ~~Hosting~~
* UI revamp
* 3D
* ~~Remote multiplayer~~
* Port to electron

## Known Bugs
* ~~Claim control after turn ended~~
* ~~Snipers turning don't update the `throughSniperLineOf` prop of pieces already in the board~~
* ~~Snipers killing don't undo the consecuences~~
* ~~Snipe broken~~
* ~~Snipers should be able to deploy facing enemy pieces~~
* ~~Spies reset their movement when clicked on after first movement~~
* ~~Spies shouldn't be able to kill on their first move (or second move if buffed)~~
* ~~Can't direct pieces outwards on the table border~~
* ~~Agent slide on CEO buff~~
* ~~Sniper sight doesn't get blocked by other pieces~~
* ~~"Next Turn" becomes available before collocating the agent~~
* ~~If snipe is pressed at the end of the turn, end of turn conditions get messed up (agent ends turn before collocation)~~
* ~~Spy ends turn on selection=>deselection from HQ~~
* ~~End turn on spy movement~~
* ~~Pieces are not allowed to spawn over other pieces~~
* ~~Switch selected agent allows to direct it without moving it first~~
* ~~Agent direction after sliding~~
* ~~Selecting a deployed sniper and putting it back spends the turn, as does turning it away and back
  onto the heading it already had~~
* ~~A spy walked off its cell and back onto it, arriving on the facing it left with, spends the turn~~
* ~~Aiming a piece marks it as having crossed the sniper lines covering its own cell, and the one to
  its right~~

Found while writing [RULES.md](RULES.md) and reproduced against the domain code — see its Appendix B:

* The spy's kill-from-behind check looks at *any* piece with the spy in its rear arc rather than the
  target, so an unrelated piece can unlock a head-on kill
* A buffed agent one step from the board edge takes the whole-board redeploy instead of its one-cell step
* ~~Sniping a CEO defers wiping its HQ until somebody's next move~~
* Firing one sniper kills every marked piece on the board, so a team can be credited with killing its own
* A spy boxed in after its first step can neither finish its move nor be put down, and the turn cannot be passed
* If every player ends on a negative score, no winner is announced
