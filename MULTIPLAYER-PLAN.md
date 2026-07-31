# Hidden Agenda — housekeeping, online multiplayer, VPS deployment

Target: `https://agenda.azyr.io` — 2–6 players, one room, each on their own device, alignments genuinely hidden.

Phases run in order. `-1` is prerequisite cleanup, `0` is the refactor that makes the reducer reusable server-side, `1`–`2` are the feature, `3` ships it, `4` protects it.

## Shape of the solution

**Server-authoritative, redacted snapshots.** Node + `ws` on `127.0.0.1:3007` under PM2; nginx serves the static bundle and proxies `/ws`. The server owns the one true state, runs the *existing* `gameReducer`, and sends each seat a copy with other players' alignments stripped. Clients keep their reducer for optimistic local apply; the snapshot is truth.

Why not broadcast actions for lockstep replay: hidden information means clients deliberately *don't* hold identical state, so deterministic replay across clients stops being sound. Snapshots make redaction trivially correct — the server simply never serializes a secret it shouldn't. State is ~6 KB of JSON, so the bandwidth argument for lockstep doesn't apply.

Three properties are what "multiplayer" actually means here, in priority order:

1. The server never sends a player another player's alignment.
2. The server accepts game actions only from the seat whose turn it is.
3. The server re-validates move legality; today legality is enforced only by which hexes the UI makes clickable.

**Local hot-seat mode is retained** behind a transport seam, so the existing 5 Puppeteer specs (agent/spy/sniper/ceo/claimControl — all the piece mechanics) keep running unchanged. That is the regression net for every phase below. Do not sacrifice it.

---

# Phase −1 — Housekeeping

Do this first. Every item is either a correctness prerequisite for the server, or work that Phase 2 would otherwise make us do twice.

## What the bundle actually costs

Measured from `docs/main.js.map` by attributing **minified** bytes to each package (source-map-explorer's method), so these are bytes that survive tree-shaking, not source size:

| Package | Minified | Share | Verdict |
| --- | --- | --- | --- |
| react-dom | 103 KB | 28.5% | unavoidable |
| app (client + domain) | 103 KB | 27.8% | — |
| **react-dnd + dnd-core + html5-backend + redux** | **67 KB** | **18.4%** | **remove** |
| styled-components + stylis + is-prop-valid | 39 KB | 10.7% | keep |
| react-router + history + path-to-regexp + friends | ~15 KB | 4.4% | remove (free) |
| polished | 9 KB | 2.6% | marginal |

Baseline: 373 KB raw / **98 KB gzipped**.

**Tree-shaking already works** — polished's `hideVisually`/`getLuminance`/normalize.css and react-router's `Switch`/`path-to-regexp` are all absent from the shipped bundle. So unminified source share is a misleading metric here: polished *looks* like 15% of the bundle by source bytes and is really 2.6%. **Rewriting polished is not worth doing on its own** (~3 KB gzipped); it is only worth it as a side effect of touching `styledHelpers.js`. Don't re-litigate this — the measurement is above.

Realistic total saving is ~25% (98 → ~75 KB gz). That is *not* the reason to do this phase. The reasons are toolchain viability, mobile support, and correctness.

## Tier 1

**1. Purge in-place mutation from the reducers.** The one genuine blocker, and it goes first.

`pz.togglePiece` / `killPiece` / `killPieces` mutate piece objects, and `piecesPrevStateReducer` does a shallow `[...state.pieces]` — so `piecesPrevState[i]` *is* `pieces[i]`. The "previous turn" snapshot is mutated by the current turn, and that is exactly what the sniper-kill rollback (`pz.killSnipedPiece`) restores from. Already latently wrong in the local game; server-side it breaks snapshots, disk persistence and redaction, because one shared state object per room gets mutated underneath them. It also blocks React 18, whose StrictMode double-invokes reducers — every in-place `selected` toggle would apply twice and cancel itself.

The existing suite covers this refactor well. Land it green before anything else.

**2. Verify the build runs on Node 22 at all.** Webpack 4 hashes with md4, which OpenSSL 3 (Node 17+) refuses: `ERR_OSSL_EVP_UNSUPPORTED`. Local Node is v22.18.0 and `node_modules` is absent, so this is untested. 30-second check: `npm i && npm run do`. If it fails, fix it by moving the build forward (item 3), not by pinning `--openssl-legacy-provider` forever.

**3. Replace webpack with Vite.** Collapses 8 devDeps — `webpack`, `webpack-cli`, `webpack-dev-server`, `html-webpack-plugin`, `html-loader`, `babel-loader`, `@babel/preset-env`, `@babel/preset-react` — into one, and fixes item 2.

- Content hashing by default, which Phase 3 needs anyway for the box's `Cache-Control: immutable` rule on `*.js`.
- `public/img/` becomes the single source of truth, ending the `img/` + `docs/img/` duplication (116 files kept in sync by hand today).
- Same config bundles the Node server in Phase 1 with the same alias map, so no separate server build toolchain.
- Set the dev server to port **8081** and the test-suite port mismatch disappears (`tests/helpers/setupTests.js:10` targets 8081; `npm run go` serves 8080).
- Keep the alias map (`Domain`, `Client`, `Phases`, `State`, `Hooks`, `Components`, `Src`) — it stays load-bearing for the server bundle.

**Trap:** `build.outDir: 'docs'` with `emptyOutDir: true` deletes `docs/_config.yml` and breaks the Pages Jekyll theme. Move `_config.yml` into `public/` or disable the flag.

Jest is barely affected: the specs only import `domain/pieces/constants`, by relative path.

**4. Drop `react-dnd` + `react-dnd-html5-backend`.** 67 KB, the biggest removable chunk — but the decisive reason is that **HTML5 drag-and-drop does not fire on touch devices.** Internet multiplayer means people on phones, and today they cannot drag a piece at all.

The existing usage is trivial to replace: `useDrag`'s `item` just calls the same `onClick` (`piece/index.jsx:25-34`), and `useDrop`'s `drop` **is** the click handler (`hexagon/index.jsx:34-40`). Native pointer events are ~40 lines and work on touch. `DragPreviewImage` becomes an absolutely-positioned img following the pointer — which the `followMouse` state already models conceptually.

**5. Drop `react-router` + `react-router-dom`.** ~15 KB, and Phase 2 replaces routing with a server-authored `phase` regardless, so this is code we would delete anyway. Replace with a `switch` on a `phase` value (~15 lines), which also kills the `<Redirect>` races in `playPhase/index.jsx:61-62`. Note `react-router` as a direct dependency is redundant with `react-router-dom`.

In this phase the phase value is local; Phase 2 feeds the same switch from the server.

**6. Dependency hygiene — this one breaks the Phase 3 deploy.** `jest` and `puppeteer` are in `dependencies`, so `npm ci --omit=dev` on the VPS installs Jest and downloads a Chromium onto the server. Meanwhile `styled-components` and `polished` sit in `devDependencies`.

Rule for this repo: **`dependencies` = what the server process needs at runtime** (after Phase 1 that is `ws` alone); everything else is a devDependency. Then:

- `prop-types` is imported (`hexagon/index.jsx:2`) but **not declared** — it resolves only via a webpack alias to React's transitive copy, so it breaks the moment that alias or React's tree changes. Delete the 6-line propTypes block; two of its three lines are already commented out.
- `babel-polyfill` — deprecated, only in `jest.init.js`, never enters the bundle. Node 22 needs nothing.
- `babel-plugin-styled-components` — installed but absent from `.babelrc`, so it has never run.
- `gh-pages` — Pages serves `docs/` from master via the committed `_config.yml`; `gh-pages -d docs` pushes to a branch nothing reads.
- `puppeteer` 8 (2021) has no arm64 Chromium, so on Apple Silicon its install download is slow *and* wasted — `initBrowser.js:8` overrides `executablePath` to system Chrome anyway. Move to `puppeteer-core` with `channel: 'chrome'` and delete the hardcoded path.

**7. React 16.8 → 18**, after item 1 only. Gives `useSyncExternalStore`, precisely the primitive for subscribing to server snapshots, plus automatic batching for snapshot bursts. `ReactDOM.render` → `createRoot`. Skip React 19: it removes propTypes and legacy context for no gain here.

**8. Puppeteer → Playwright, as the only test runner.** Jest, babel-jest and the Babel presets all go with it. Two projects: `domain` (no browser — the specs simply never request a page fixture, so they stay ~2s and keep the deep-freeze reducer-purity guards) and `e2e` (chromium).

Three reasons beyond taste:

- **It unblocks the version wall.** Puppeteer is ESM-only from v23, and Jest's CJS runtime cannot load an ESM-only package at any Jest version, which is why `puppeteer-core@22` is currently the ceiling.
- **It deletes two hand-written race fixes.** Playwright's actionability check waits for an element to have a *stable bounding box* before clicking — precisely the unloaded-piece-image race that `waitForPiecesToRender` works around, and the click/render interleaving that `settleAfterClicks` works around.
- **`config.webServer`** starts `npm run serve` and waits for port 8081, removing the "start a server first or the entire suite fails" footgun. Traces and video on failure replace the single overwritten `test.png`.

Conversion is mostly mechanical: `describe`/`it` → `test.describe`/`test`, and Playwright's `expect` is a fork of Jest's so the matchers survive. Prefer locators over `page.$eval` so auto-waiting applies. Keep the uncaught-page-error guard, as a fixture. Touch drag still needs a CDP session, since `page.touchscreen` only taps.

One trap: `babel-eslint` depends on `@babel/core`, so dropping Babel may force the eslint flat-config migration. Check before uninstalling.

**9. Pin the runtime.** `.nvmrc` + `engines` so laptop and box agree, and regenerate `package-lock.json` (currently v2).

## Tier 2 — cheap, same pass

- **Prettier config + one formatting-only commit, before any feature work.** The codebase mixes tabs (`domain/`, `state/`) and 2-space (parts of `client/`); without this the multiplayer diffs are half whitespace.
- **Make `Hexagon` a real component.** `renderHexagon` (`tableBoard.jsx:13`) calls `useContext`/`useCallback` inside a plain function invoked ~50× per render — a hooks-rules violation that works only because call order happens to be stable, and React 18 dev will flag it. It also matters for perf once snapshots arrive at up to 25/s.
- **Delete dead code.** `onHexagonClick` (`tableBoard.jsx:25-34`) is passed to `Hexagon` as `onClick`, which never destructures it: 10 lines of duplicated move logic that never executes. Also the commented-out `togglePieceForControl` (`teams.js:137-167`) and `getAdjacentCells` (`cells.js:133-144`).
- **Fix `py.accuse` (`domain/py.js:127-147`).** The `players.map` has no fallback `return player`, so every player who is neither accuser nor accusee becomes `undefined`. Invisible in 2-player hot-seat (both branches always hit) and fatal from 3 players on — i.e. exactly what online play makes normal. Add a 3-player regression test.
- **Extract `dealAlignments(playerNames, rng)`** into `src/game/deal.js`, keeping the "friend ≠ foe" retry. `alignmentPhase/index.jsx:12-27` currently splices module-level `FRIEND_CARDS`/`FOE_CARDS`, so a second game in one page load starts with a depleted deck. Phase 1 has the server call this; local mode calls it in-process.
- **Verify one suspected live crash.** `pz.isTogglePieceOnCellClick` (`pz.js:919-935`) returns `true` when nothing is selected and you click an empty non-highlighted hex; `useOnCellClick` then runs `dispatch(togglePiece(selectedPiece.id))` with `selectedPiece === undefined`. That reads like a TypeError on "click the board before picking a piece". The specs never do it — they always click a piece first. 10 seconds in a browser to confirm.

## Tier 3 — explicitly skipped

- **Replacing styled-components** (39 KB with stylis). Largest remaining removable dep, but props-driven CSS is the entire visual layer and the Puppeteer specs assert *computed styles* — high regression risk for ~13 KB gzipped. A v4→v6 bump is optional, and only if the class-name change leaves the specs alone.
- **eslint 6 → 9 flat config.** Nothing runs eslint today; add `npm run lint` and defer the migration.
- **TypeScript.** The domain layer would genuinely benefit for payload validation, but 4.2k lines of dense hex geometry is a project, not housekeeping.

## Order and outcome

Mutation purge → Vite → react-dnd → react-router → dep hygiene → React 18 → Playwright, Tier 2 folded in, each step landing with the suite green. Mutation must precede React 18, because StrictMode turns those double-applied toggles into visible bugs.

### Outcome — Phase −1 is complete

All nine Tier 1 items and all of Tier 2 landed on master, one commit each.

| | Baseline | Now |
| --- | --- | --- |
| Bundle, gzipped | 97.9 KB | **82.2 KB** |
| Declared dependencies | 30 | **7**, none at runtime |
| Tests passing | 72 of 81 | **102 of 102** |
| Dependabot alerts | 136 (16 critical) | **5** (1 critical) |
| Build on Node 22 | impossible | ~300 ms |
| Test runners | jest + puppeteer | Playwright only |

The bundle is 82 KB rather than the ~75 KB projected, because React 18's `react-dom` is bigger than 16's. Dropping polished (2.6% of the bundle, and measured *after* tree-shaking) was correctly judged not worth it and was not done.

**Four live bugs** were fixed on the way, none of them known when the plan was written:

1. Clicking any empty cell before selecting a piece threw a TypeError.
2. `py.accuse` corrupted every uninvolved player from 3 players up — invisible at 2, where accuser and accusee are the whole table.
3. The alignment deck depleted across games in one page load, and its retry loop could spin forever at 6 players.
4. The e2e suite was never green to begin with: 9 of 81 specs failed on fixture rot (Chrome changing how it reports `cos(90°)`, and a viewport that depended on browser UI chrome height).

The mutation purge also exposed a reducer depending on cross-slice mutation leakage: `pieceStateReducer` was reading the already-toggled `selected` flag out of what is nominally the pre-action state. That is precisely the class of bug that would have been miserable to chase once a server shared and persisted that state, and it is now guarded by deep-freeze purity tests plus a full suite run under React StrictMode.

The linter is real for the first time. eslint 6 and eslint-config-react-app 4 were version-incompatible, so `eslint src` had never once run; the stack was replaced with eslint flat config plus the react-hooks rules, and `npm run lint` is clean. It immediately paid for itself, finding hooks called from plain functions in two phases, a ref written during render, a `useCallback` with no dependency array (so no memoisation at all), a stale-closure risk in the accuse menu, `useBooleanState` returning unstable setters, and sixteen dead `import React` lines left over from before the automatic JSX runtime.

styled-components stays on 4, which turned out to be fine under React 18.

---

# Phase 0 — Make the reducer server-reusable

No behaviour change. With Phase −1 done, this is small.

1. **Extract the reducer core.** New `src/game/reducer.js` exporting `gameReducer` + `createInitialState()`, with no React and no browser globals. `state/index.js:54` reads `window.location.search` at module scope, so today the reducer cannot be imported from Node at all. `state/index.js` keeps the `?test=play|endgame` mock wiring and imports the core.
2. **Add `SYNC_STATE`**, handled *above* the slice composition (`if (action.type === SYNC_STATE) return action.payload`) — this is how snapshots land. Gate `gameReducer`'s `console.log` (`state/index.js:38`) behind a debug flag; it must not run per-action on the server.
3. **Make actions self-contained.** `revealFriend(players)` / `revealFoe(players)` (`actions.js:71-85`) carry the entire players array, and `playersReducer` / `teamControlReducer` read it from the payload rather than from state. On a redacted client that payload is both wrong and forgeable. Reduce to `{type}` and read `state.players`.
4. **Transport seam.** `src/client/net/transport.js` → `{ dispatch(action), subscribe(fn) }`, with `LocalTransport` (straight into the reducer, today's behaviour) and `SocketTransport`. The state provider picks by URL: room code present → socket, otherwise local. This is what keeps the existing specs alive.

# Phase 1 — Server (`server/`, built to `dist-server/`)

| File | Contents |
| --- | --- |
| `index.js` | http server for `GET /healthz` + `ws` upgrade on `/ws`; 25 s app-level ping (Cloudflare drops idle WebSockets at ~100 s) |
| `rooms.js` | `Map<code, Room>`, `Room = {code, phase, state, seats, version}`, `Seat = {name, token, socket, connected}`; 4-char codes with collision retry |
| `protocol.js` | C→S `create·join·rejoin·start·ready·action{seq,action}·forceNextTurn·ping`; S→C `seat·room·snapshot{v,state}·rejected{seq,reason,v}·error` |
| `redact.js` | The security-critical file (below) |
| `validate.js` | The authority rules (below) |
| `apply.js` | validate → `gameReducer` → `version++` → persist → per-seat snapshot |

**`redact.js`** — for each player: `alignment.friend = (p.name === seat.name || p.revealed.friend) ? value : null`, same for `foe`; drop `state.test`. Everything else passes through.

One caveat that bites at the end of the game: `py.getPoints` needs *every* player's alignment to compute scores (`py.js:150-175`), and `endPhase/playersScore.jsx` renders them. So **when `phase === 'end'`, stop redacting** — the game is over and all secrets are public by then.

**`validate.js`** — a per-type table:

- Phase gate: `START_GAME` lobby-only, `ready` alignment-only, the rest play-only.
- **Turn gate**: sender must be `py.getTurn(state.players)`. That single rule is the whole ownership model — the game deliberately lets the turn-holder move *any* team's pieces.
- `MOVE_PIECE`: `coords ∈ pz.getHighlightedPositions(state.pieces, state.pieceState)`.
- `DIRECT_PIECE`: `direction ∈ pz.getPossibleDirections(selected, pieces, pieceState)`.
- `TOGGLE_PIECE` / `SNIPE` / `CLAIM_CONTROL` / `CANCEL_CONTROL`: the domain layer already no-ops when illegal (`pz.toggle` returns the same pieces) — accept and let the reducer decide.
- `ACCUSE`: `accuser === sender`, accusee exists, `alignment ∈ {friend,foe}`, `team ∈ 0..3`.
- Shape-validate every payload at the boundary; never hand an unchecked `payload` to the reducer.
- Rate limit 30 actions/s per seat; `DIRECT_PIECE` exempt but coalesced.

**Snapshot coalescing**: trailing 40 ms timer per room. Needed because `DIRECT_PIECE` is dispatched from `onMouseEnter` (`tableBoard.jsx:36-44`), i.e. at hover rate, not click rate.

**Durability**: write `/var/lib/hidden-agenda/rooms/<code>.json` (tmp + rename) on each accepted action and reload on boot, so `pm2 reload` during a deploy doesn't kill live games. Evict a room 30 min after its last disconnect, 3 h hard cap.

**Disconnects**: keep the game, broadcast seat status. If the turn-holder has been gone > 60 s, any connected seat may send `forceNextTurn`. Without that escape hatch one closed laptop ends the game permanently.

# Phase 2 — Client

- **`LobbyPhase`**: create or join by 4-letter code, shareable `#/r/ABCD` link, seat list, host starts. The existing player-count/name form stays for local mode.
- **Feed the Phase −1 phase switch from the server** instead of local state.
- **AlignmentPhase becomes per-player**: your two cards on your own screen, `ready` → server advances when all are ready. The "this is only for X's eyes" ceremony and the `FRIEND & FOE` warning gate are hot-seat artifacts — keep them only in local mode.
- **Optimistic apply for everything except `SET_ALIGNMENT`, `REVEAL_FRIEND`, `REVEAL_FOE`, `ACCUSE`.** Those four read secrets the client doesn't hold, so their result isn't locally predictable; wait for the snapshot. All four are single clicks where latency doesn't matter.
- **Aiming**: apply `DIRECT_PIECE` locally at once, send trailing-throttled at 50 ms, flush before the committing action. While a local direct is unacked, ignore inbound `selectedDirection` for your own selected piece, or the echo causes visible jitter.
- **Reconnect**: `{code, token}` in `localStorage`; exponential backoff 0.5→8 s; banner for connecting / reconnecting / seat lost. A refresh currently destroys the whole game — after this it rejoins the same seat.
- **Turn affordance**: render read-only when it isn't your turn (pieces not draggable, actions inactive). Cosmetic only — the server is the enforcement.
- **Touch**: the Phase −1 pointer-event drag is what makes phones work; verify on a real device here, not at the end.

# Phase 3 — Deploy

- **Bundle**: Vite already emits content-hashed filenames, so this reduces to *verifying* it and serving `index.html` with `no-store`. Non-negotiable, because the box's asset location sets `expires 1y; Cache-Control "public, immutable"` for `*.js` — a fixed `main.js` would stay pinned in returning browsers for a year, a failure already documented on that server.
- **Server bundle**: second Vite config, `build.ssr: 'server/index.js'`, `build.outDir: 'dist-server'`, `ws` left external. Same alias resolution as the client, so the shared reducer core needs no import churn, and the box needs only `npm ci --omit=dev` — no devDependencies and no Babel step on 2 vCPUs. Commit `dist-server/` next to `docs/`, matching this repo's existing committed-build convention.
- **nginx** `/etc/nginx/sites-available/agenda.azyr.io` — clone the **journal** subdomain config, not the osler one (osler's includes the Cloudflare mTLS snippet, which would 400 every non-Cloudflare client):
  - `root /opt/hidden-agenda/docs; try_files $uri /index.html;`
  - `location = /index.html { add_header Cache-Control "no-store"; }`
  - `location /ws { proxy_pass http://127.0.0.1:3007; proxy_http_version 1.1; Upgrade/Connection headers; proxy_read_timeout 3600s; }`
  - `location = /healthz { proxy_pass http://127.0.0.1:3007; }`
  - `proxy_set_header X-Forwarded-For $remote_addr` — **set**, not `$proxy_add_x_forwarded_for`, same reasoning as osler: the app trusts the first hop for rate limiting, and appending lets a client spoof past it.
  - `cloudflare-realip.conf` is already in the http context box-wide → real visitor IPs for free.
- **Cloudflare**: proxied A record `agenda` → box IP; WebSockets enabled; SSL is already Full (strict) globally. Do not apply a "Cache Everything" rule to `/ws`.
- **PM2, not Docker**: `pm2 start dist-server/server.js --name hidden-agenda --env PORT=3007 && pm2 save`. Every other Node app on the box is PM2, and that box's Docker daemon runs userns-remap, which breaks bind-mounted paths.
- **Deploy script** mirroring house-md's pattern — there is no webhook on this box, a push ships nothing. Laptop builds, commits, pushes; then over SSH: `cd /opt/hidden-agenda && git pull --ff-only && npm ci --omit=dev && pm2 reload hidden-agenda && curl -sf localhost:3007/healthz`.
- **Smoke**: `curl -s 127.0.0.1:3007/healthz`; `curl -sk https://127.0.0.1/ -H 'Host: agenda.azyr.io'` (this works here, unlike osler — no mTLS on this site); then a real two-device room, one of them a phone.

# Phase 4 — Tests and hardening

- The existing browser specs must keep passing in local mode throughout. The port mismatch is already fixed by the Vite dev server port in Phase −1.
- New tests, in value order: `redact` (in the no-browser `domain` project — the one test that actually protects the game's premise; assert no other seat's alignment appears in any outbound frame), `validate` (non-turn seat rejected, off-highlight coords rejected), and a two-context browser test. That last one is markedly easier under Playwright: two `browser.newContext()` instances are two independent players in one room, so "B cannot act on A's turn" and "B never receives A's alignment" become ordinary assertions rather than a puppeteer contortion.
- Hardening: 4-char codes are low entropy → rate-limit `join` per IP (10/min) and cap total rooms (200). Cap name length, cap message size at 8 KB. Nothing else here is secret, so there are no credentials to manage — a real simplification versus the other apps on that box.

---

## Verify on the box before Phase 3

The VPS docs are readable from here but nothing on the box has been run. Unconfirmed:

0. **Does the box have Node >= 22.12?** `engines` now requires it and the server bundle is built against it.
1. Is `3007` free? (3000, 3001, 3002, 3003, 3005, 3006 and 8410/8411 are taken.)
2. Does the Cloudflare Origin cert at `/etc/nginx/ssl/azyr.io.pem` cover `*.azyr.io`, or does the subdomain need its own?
3. Which existing site config is the cleanest base — `journal.azyr.io` is the assumption.
4. `/var/lib/hidden-agenda` creation and ownership (which user PM2 runs as).
5. Cloudflare WebSocket toggle state for the zone.
6. Should `/opt/hidden-agenda` be a fresh clone of the GitHub repo, matching journal and house-md?

## Rough effort

| Phase | Effort |
| --- | --- |
| −1 Housekeeping | done |
| 0 Reducer core | half a day |
| 1 Server | 1 day |
| 2 Client | 1–1.5 days |
| 3 Deploy | 2–3 h + box verification |
| 4 Tests & hardening | half a day |

**≈5.5–6.5 focused days.**
