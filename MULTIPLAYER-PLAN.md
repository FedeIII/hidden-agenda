# Hidden Agenda — housekeeping, online multiplayer, VPS deployment

Target: `https://hidden-agenda.azyr.io` — 2–6 players, one room, each on their own device, alignments genuinely hidden.

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

# Phase 0 — Make the reducer server-reusable — **done**

No behaviour change; 111 tests green.

1. **The game core moved to `src/game/`** — `actions.js`, `reducers/`, plus a new `reducer.js` (`gameReducer` + `createInitialState()`) and `store.js`. This went further than the plan asked: it called only for `reducer.js`, but leaving the reducers under `src/client/state/` would have made `src/game` depend on `src/client` — the server importing from the client. `src/game` and `src/domain` are now verified free of every `Client/` import and every browser global.
2. **`SYNC_STATE`** is handled above the slice composition, so a server snapshot is adopted wholesale rather than interpreted slice by slice. The per-action `console.log` sits behind a `debug` flag — on in dev, off otherwise.
3. **`revealFriend()` / `revealFoe()` carry no payload.** They used to ship the entire players array, which the reducers read instead of state: redundant, and forgeable the moment a client's view is redacted. Both reducers now read `state.players`.
4. **The transport seam** is `src/client/net/transport.js`. `createTransport()` returns a `{ getState, subscribe, dispatch }` store, reads `?test=` and any `#/r/CODE` at call time rather than at import, and today always returns the local store. `withState` consumes it through `useSyncExternalStore`, so Phase 2 swaps the store and no component changes.

Proven rather than assumed: the core bundles for node through Vite SSR (**45.5 kB, 9.2 kB gzipped**) and runs turn order, piece initialisation and a payload-free reveal with no browser present. That is the Phase 1 server path working end to end before any server exists.

# Phase 1 — Server — **done**

`server/`, bundled to `dist-server/main.mjs` (67 kB, 15.25 kB gzipped) and committed. 162 tests green, 51 of them new.

| File | What it does |
| --- | --- |
| `index.js` | `createGameServer()` — http `GET /healthz`, `ws` upgrade on `/ws` only, 25 s ping, snapshot coalescing, room eviction sweep |
| `main.js` | the process entry: port, host, signal handlers. Split out so tests can create a server without binding a port |
| `rooms.js` | room and seat model, 2–6 players, 200-room cap, start and ready transitions |
| `codes.js` | 4-char room codes over an alphabet with no O/0, I/1 or S/5, plus seat tokens |
| `protocol.js` | the JSON envelopes, 8 kB cap |
| `redact.js` | the per-recipient projection |
| `validate.js` | phase gate, turn gate, payload shape, move legality, token-bucket rate limiting |
| `apply.js` | validate → reduce → version → derive phase, plus the disconnect grace check |
| `persistence.js` | one JSON file per room, tmp+rename, reload on boot |

**The three properties hold, and are tested over a real socket rather than asserted:**

1. Each seat receives its own alignment and `null` for everyone else's, checked on the serialised frame. A seat name not at the table sees nothing at all — it fails closed.
2. The seat not on turn is rejected with `not_your_turn` and **nothing is broadcast to anyone**. The negative half matters as much as the positive.
3. An illegal move is rejected even from the turn holder, re-derived with the same `pz.getHighlightedPositions` the UI highlights with.

Worth recording:

- **Clients can never send `START_GAME` or `SET_ALIGNMENT`.** Starting a game and dealing cards belong to the server, so those two are absent from the allowed set and a client asking for either gets `action_not_allowed`. Alignments therefore only ever exist inside the authoritative state.
- **Rooms hold no sockets.** A room stays plain JSON so it can be written to disk; live connections live in a `Map` keyed by seat id. That is what makes restart survival cheap, and it is tested: a room and its seats come back after the process restarts, and a player rejoins with the token they already had — with redaction still holding on the far side.
- **Persistence is best-effort.** `/var/lib` is not writable on a laptop, so it disables itself and logs. A game that cannot be saved is still a perfectly good game, and failing to save must never take the server down. Verified against the real bundle: `persistence: false` in `/healthz`, server serving normally.
- **`publicDir: false` is required** in the server config, or the bundle gets a copy of the Pages theme and all 116 piece images.
- The build emits **`main.mjs`**, not `main.js` — the `server` script and the PM2 command in Phase 3 both have to say `.mjs`.

# Phase 2 — Client — **done**

- **`LobbyPhase`**: create or join by 4-letter code, shareable `#/r/ABCD` link, seat list, host starts. The existing player-count/name form stays for local mode.
- **Feed the Phase −1 phase switch from the server** instead of local state.
- **AlignmentPhase becomes per-player**: your two cards on your own screen, `ready` → server advances when all are ready. The "this is only for X's eyes" ceremony and the `FRIEND & FOE` warning gate are hot-seat artifacts — keep them only in local mode.
- **Optimistic apply for everything except `SET_ALIGNMENT`, `REVEAL_FRIEND`, `REVEAL_FOE`, `ACCUSE`.** Those four read secrets the client doesn't hold, so their result isn't locally predictable; wait for the snapshot.

  **This needed more than the plan assumed.** Applying an action locally and then adopting the next snapshot wholesale silently reverts anything done since the server built it — in practice: place a piece, selection quietly undone, next click read as a second move, rejected as illegal. Intermittent, and invisible unless two clicks land inside one round trip. Dropping prediction instead made it worse: the second click then reads state the server has not updated, so rapid clicks are dropped outright. Prediction is load-bearing, not a nicety.

  So seats carry the last sequence number applied for them, snapshots carry it, and the client drops what has been acknowledged and replays the rest on top of every snapshot. A rejection drops that action and everything predicted after it, since those were predicated on it.
- **Aiming**: apply `DIRECT_PIECE` locally at once, send trailing-throttled at 50 ms, flush before the committing action. The planned "ignore inbound `selectedDirection` while unacked" guard was written and then deleted: replaying outstanding actions on top of each snapshot (below) subsumes it, and is the general case.
- **Reconnect**: `{code, token}` in `localStorage`; exponential backoff 0.5→8 s; banner for connecting / reconnecting / seat lost. A refresh currently destroys the whole game — after this it rejoins the same seat.
- **Turn affordance**: render read-only when it isn't your turn (pieces not draggable, actions inactive). Cosmetic only — the server is the enforcement.
- **Touch**: the Phase −1 pointer-event drag is what makes phones work; verify on a real device here, not at the end.

# Phase 3 — Deploy — **prepared, not applied**

Every artifact is written, committed and reviewable. **Nothing has touched the box**: the bridge parks a session for Fede rather than executing, so the box-side work is his to approve and run.

| Artifact | |
| --- | --- |
| `deploy/nginx/hidden-agenda.azyr.io.conf` | the site config |
| `deploy/pm2/ecosystem.config.cjs` | loopback, port 3007, state under `/var/lib/hidden-agenda/rooms` |
| `scripts/deploy-remote.sh` | laptop-side deploy; refuses a dirty or unpushed tree |
| `deploy/README.md` | the runbook: one-time setup, smoke tests, rollback, cache trap |

Built from the journal template with two deliberate departures: journal proxies everything so there is no static `root`/`try_files` block to copy, and it hardcodes `Connection 'upgrade'` on every location, which belongs on the websocket alone. No mTLS snippet — that is osler's, and copying it would make a loopback curl return 400.

**One nginx subtlety caught before it shipped.** `add_header` is inherited by a location only if that location declares none of its own, so any location setting `Cache-Control` silently drops the security headers. Worse, `/` is served by `location /` through `try_files` — which serves the file inside the current location and does not re-run location matching — so a `location = /index.html` block would never have applied to the page anybody loads, and `index.html` would have been cacheable. That is exactly the year-long-stale-bundle trap this box already documents. The `no-store` lives on `location /`, and every location that sets a `Cache-Control` restates the headers it still wants.

The server also now takes only the leftmost hop of `X-Forwarded-For`, and the config *sets* rather than appends that header. Appending would let a client prepend a value and get a fresh rate-limit bucket each attempt.

# Phase 4 — Tests and hardening — **done**

**169 tests**, all green. Most of the hardening had already landed with Phase 1.

- The browser specs still pass in local mode, untouched, throughout. That was the point of the transport seam.
- `redact` (10 specs) asserts on the serialised frame, not the object graph, and that an unknown seat name sees nothing — it fails closed.
- `validate` (25 specs) covers the turn gate, phase gate, payload shapes, re-derived move legality, the disconnect escape hatch and the action rate limiter.
- `server` (19 specs) drives a real socket in process, including restart survival and rejoining with a token.
- Four browser specs drive **two contexts through one room**: reaching the board by shared code, each screen showing only its own cards, refresh putting a player back in the same seat, and the seat not on turn being unable to move a piece while the same clicks from the turn holder land on both screens.
- The one control that was claimed but unverified now has a test: ten room creations a minute per address, then `slow_down`. 4-character codes are cheap to guess at without it.

Two footguns recorded in `CLAUDE.md` rather than left to be rediscovered: the online specs use 8 of those 10 joins, so another one trips the limit and fails in a way that looks nothing like a rate limit; and the suite runs `dist-server/main.mjs`, not `server/` source, so the config rebuilds it before starting — testing against a stale server bundle cost real time once.

---

## Box facts — **checked**

Gathered read-only from the VPS. The important one changes a decision.

| | Finding |
| --- | --- |
| **Node on the box** | **18.19.1**, and PM2 runs apps with the same node — no nvm split. Node 18 went EOL April 2025. |
| Port 3007 | **free.** Taken nearby: 3000–3006 (youtube-analytics, github-analytics, journal backend/frontend, an auth service on 3004, activity-api, vps-bridge), 8410/8411 (osler via docker-proxy), 9000 (journal webhook), 5432 (postgres). |
| Origin certificate | `/etc/nginx/ssl/azyr.io.pem` has SANs `*.azyr.io, azyr.io` — **hidden-agenda.azyr.io is covered**, no new cert. |
| `journal.azyr.io` config | Usable as a TLS/headers template, but it proxies *everything* — there is no `root`/`try_files` block to copy for the static half, which has to be written. It also hardcodes `Connection 'upgrade'` on every location; fine inside the `/ws` block, wrong in the static one. |
| DNS | `hidden-agenda.azyr.io` still needs a **proxied Cloudflare record**. Dashboard action, not doable from the box. |

### The Node 18 finding, and what was done about it

`engines` requires node >= 22.12, which is a **toolchain** requirement: Vite 8 and Playwright need it to *build and test*. The box never builds — it runs the committed `dist-server/main.mjs`. So the two are separable, and the fix was to lower the server bundle's syntax target to `node18`.

Audited rather than assumed: every API the server touches predates Node 18 (`randomUUID` is 16.7+, `randomInt` 14.10+, the `node:fs` and `node:http` calls far older), there is no top-level await, and the rebuilt bundle contains no post-18 syntax and still serves `/healthz`.

So Phase 3 is **not blocked**. But two things are Fede's call:

1. **Upgrading the box to a supported Node** would affect all five existing PM2 apps. Worth doing on its own merits — Node 18 has been EOL since April 2025 — but it is not this deploy's problem to force.
2. Until then, do not raise `target: 'node18'` in `vite.server.config.mjs` speculatively. There is a comment there saying so.

## Rough effort

| Phase | Effort |
| --- | --- |
| −1 Housekeeping | done |
| 0 Reducer core | done |
| 1 Server | done |
| 2 Client | done |
| 3 Deploy | artifacts done; box-side unapplied |
| 4 Tests & hardening | done |

## What is actually left

Everything remaining needs either the box or a physical device. No code is outstanding.

1. **Cloudflare DNS** — a proxied `A` record for `hidden-agenda`. Dashboard, Fede.
2. **Cloudflare WebSockets** — confirm they are on for the zone. Without it `/ws` fails while the page loads fine, which is a confusing failure worth ruling out first. Dashboard, Fede.
3. **Run the box-side setup** in `deploy/README.md`: clone to `/opt/hidden-agenda`, `npm ci --omit=dev`, create `/var/lib/hidden-agenda/rooms`, PM2, nginx, reload.
4. **Three things only the box can answer**, all read-only:
   - `nginx -t` on the site config. There is no nginx on the laptop, so it has only been checked statically — brace balance, semicolons, and which locations lose inherited headers.
   - whether **PM2 runs an `.mjs` entry point**. The one item in the runbook with no local equivalent. `node dist-server/main.mjs` from `/opt/hidden-agenda` is the fallback check.
   - whether **`cloudflare-realip.conf` is in the http context**. If it is not, `$remote_addr` is a Cloudflare edge and every visitor shares one join-rate bucket, so real players get throttled. Fix the http-context config rather than raising the limit.
5. **Play it on a real phone.** Touch dragging is covered by a CDP-driven spec, but emulated touch is not a phone.

Open decision, not a blocker: the box runs **Node 18, EOL since April 2025**. The server bundle targets `node18` so this deploy does not force the issue, but upgrading would affect all five existing PM2 apps.
