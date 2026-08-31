# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Hidden Agenda: a hex board game with hidden information (React 18 + styled-components + Vite, plus a `ws` server). 2–6 players command four teams (0–3 = black/red/white/yellow) of 5 agents + CEO + spy + sniper. Each player secretly holds a *friend* and a *foe* team; the psychology is that everyone moves everyone's pieces. Live at https://hidden-agenda.azyr.io (rooms over a socket) and at https://fedeiii.github.io/hidden-agenda/?hotseat from the same committed `docs/` build — Pages has no server, hence the handle.

Online play is **done and deployed**. `deploy/README.md` is the record of the box; the plan that got it there is in the git history rather than in a file that now only says "done".

**The index is the online lobby**, and it lists the public rooms — see *Finding a room*. A game of this is people in different places holding cards nobody else can see, so that is what the front door offers; the one-tab table is `?hotseat`, an option in the lobby, and what nearly the whole browser suite plays. `detectMode()` in `state/index.jsx` decides, and only three things move it: a room code in the hash is online (somebody followed a shared link), `?hotseat` is local, and `?test=` is local because a mid-game mock has no server it could have come from. Both directions are also written back into the URL by `rememberMode`, so a reload keeps you where you were.

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

One deliberate suppression, commented at the site:

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
- **An inactive `Button` is genuinely `disabled` now, which surfaced two specs that were clicking dead buttons.** `spy.test.js` had a `#next-turn` click that could not have worked — a buffed spy had two moves left — and it read as a step while doing nothing. A `claimControl` spec clicked `#claim-0` to assert nothing happened, which is now expressed by asserting the button is disabled. If a spec starts timing out on `element is not enabled`, that is the button telling the truth: check whether the click was ever doing anything.
- **`#start-btn` used to start a game it was refusing to offer.** The name committed on `blur`, so the last player's name never counted and the button stayed dead — and `onStart` dispatched anyway, so clicking the dead button worked. Names commit on `change` now and the handler checks. That is why `page.fill` is enough to enable it.
- **The online specs were flaky until `socketStore` stopped opening two sockets.** `sendIntent()` returned nothing, so `sendIntent() || connect()` always fell through to `connect()`: a client that already had a socket opened a second, the first was orphaned, and the orphan's close handler scheduled a reconnect — a socket every half second, each cycle broadcasting the room to every seat. Nothing failed, but a page that lost the race spent its time reconnecting instead of rendering, so a reload after a move took five seconds instead of half of one. `connect()` now refuses to open a second socket and the intent is sent from the `open` handler. Idle frames to a client went from a steady stream to zero.
- **Changing the skin online is a round trip, so assert it with `expect.poll`.** `skin.test.js` has an `expectSkin` helper for exactly this. Reading `document.documentElement.dataset.skin` straight after clicking an option passes on a quiet machine and fails the moment the suite runs `fullyParallel`, which is how the first version of those specs behaved — and the failure names a skin, not a race.
- **A stray `./dev.sh` server on :3018 is reused by the suite and silently ignores `HA_SKIN`.** That is the general hazard already noted above, but it bites the skin specs in a specific way: a room drawn at random instead of pinned. The online specs therefore set the skin through the host's own picker rather than trusting the env, so they hold either way.
- **The shared `page` fixture navigates to `?skin=dossier`, and a spec that navigates for itself has to carry the param too.** A hot-seat game draws one of three skins on the way into the alignment phase, so without the pin every spec would be asserting against a different look each run — which fails as a click landing a pixel off rather than as anything that mentions a skin. Online specs need nothing: the test server's `HA_SKIN` covers them.
- **Online specs share one game server and one IP.** In production the server refuses more than 10 room joins per minute per address, which caps how many online specs there can be — they all join from one address, two joins each. Rather than weaken that, `JOINS_PER_IP_PER_MINUTE` reads `HA_JOINS_PER_MINUTE`, and `playwright.config.mjs` sets it to 60 for the test server. Do not lower the default; raise the env var. Tripping the limit fails in a way that looks nothing like a rate limit.
- **The e2e suite runs `dist-server/main.mjs`, not `server/` source.** The playwright config rebuilds it before starting, because testing against a stale server bundle is otherwise silently possible — it cost real debugging time once.
- **The browser has WebGL 2 through SwiftShader**, so the e2e suite exercises the 3D renderer, in software, on every spec. That is deliberate — it is the path players get — but it is why the suite went from about 45 seconds to a little over two minutes, and why the renderer drops multisampling and pixel ratio when it detects a software rasteriser. Anything that makes the board fill more pixels per frame shows up here first.
- **It runs the committed `docs/` too, not `src/`.** `npm run serve` is `vite preview`, which serves the build. Unlike the server bundle, nothing rebuilds it for you: **run `npm run build` after any client change or the suite tests the previous one.** The failure is quiet and points the wrong way — a new spec fails asserting behaviour the source clearly has, because the browser never received it.
- `tsconfig.json` contains no TypeScript. It exists only so Playwright's resolver knows the import aliases, because the domain modules import each other as `Domain/*`. Keep its `paths` in step with `vite.config.mjs`. **It must keep `noEmit` and stay without `baseUrl`**, and neither is cosmetic: an editor cannot tell this file is not a real TS project, so it contributes a `tsc: build` task for it, and running that asks tsc to compile 86 `.js` files in place — every one failing with *"Cannot write file … because it would overwrite input file"*, which reads as a project that does not compile. `baseUrl` is separately deprecated in TypeScript 6 (what Cursor bundles) and errors, so the `paths` targets are relative (`./src/*`) instead, which is how `paths` works without it. `.vscode/settings.json` also turns the auto-detected tsc tasks off, so both the trigger and the symptom are gone. Verified with Cursor's own bundled compiler, and the domain project still resolves `Domain/*`.

### Skipping to a mid-game state

`?test=play` or `?test=endgame` replaces `initialState` with `src/client/state/mocks/{play,endgame}.js` and makes `Game` start directly in that phase. Useful for reaching a board position without clicking through. Note neither mock has a piece on the board — both start with all 32 in their HQs.

`?flat` turns the 3D renderer off and gives you the original CSS board, which is the fastest way to tell whether a bug is in the game or in the renderer.

`?hotseat` plays in this one tab instead of asking for a room, which is what the index offers by default. Nearly every spec carries it — the shared `page` fixture navigates to `?skin=dossier&hotseat`, and a spec that navigates for itself has to say both. An online spec needs neither: it lands on the lobby anyway, and the test server's `HA_SKIN` covers the skin.

`?skin=dossier|blueprint|vault` pins the visual direction instead of drawing one. **Local mode only** — online the room's skin wins, because the table has to agree. It exists because otherwise the only way to see a direction is to restart games until the draw goes your way, and because the browser suite needs it: every spec walks the real start → alignment flow, and that flow draws a skin.

## The three skins

The interface comes in three committed visual directions — **Dossier** (the file room: manila, typewriter, rubber stamps), **Blueprint** (industrial secrets: cyanotype, chalk line work, drafted controls) and **Vault** (the attaché case: gunmetal, brass, bevels). `src/domain/skins.js` holds the names and `pickSkin(rng)`; `src/client/theme/` holds what they look like.

**The names are in `domain` for the same reason the phases are: the server sends them.** Nothing about how a skin looks belongs there.

Who chooses, and when:

- **The main menu is always Dossier.** A game starts as a form on a desk; it only gets a look of its own later. `?test=` also pins it, so a spec dropped straight into a mid-game state is deterministic.
- **Hot-seat draws on the way in to the friend-and-foe cards** — the moment the game stops being a form — and keeps it for the rest of the evening. That is `createLocalSession#advance` in `net/transport.js`. Dossier is in the draw, so staying is a real outcome rather than a missed one.
- **Online, the room owns it.** `createRoomStore#create` draws it once with the server's `rng`, it lives on the room next to the phase, and `roomMessage` sends it — so every seat is told the same one in the same frame as the seat list, and the waiting room already looks like the game will. `HA_SKIN` pins it (set in `playwright.config.mjs`, same shape as `HA_JOINS_PER_MINUTE`: don't lower the default, override the env). A client's own `?skin=` is inert online.
- **The host may overrule the draw, in two windows only: the waiting room and the friend-and-foe cards.** Not once the game is running — a player mid-turn is holding a model of four teams and somebody else's face, and re-dressing the table under them is not a courtesy. Online that is `rooms.setSkin`, which checks host, phase and validity *itself* rather than letting `index.js` do the host check the way `start` does, because the rule is the point of the feature and this is where it can be tested without a socket. It broadcasts the room frame and **does not bump the version**: the skin is not game state, so bumping it would make every client throw away a board that has not changed and drop the actions it is holding. Hot-seat has no host because it has no seats, so the control is simply present during the alignment phase — same reasoning as the snipe.
- `SkinPicker` renders **nothing at all** when the viewer may not change the skin. `useCanChangeSkin` is the single place that decides, and the server refuses the message independently, so the UI is only declining to offer something that would be turned down.
- The skin lives on **the session** in both modes, so `useSkin()` has no branch in it. `useSkinAttribute` writes it to `data-skin` on `<html>` — on the document rather than a wrapper, because the canvas is a sibling of `.game` and sits *under* it, so a background inside the app is a filter over everything the renderer drew.

**Two hazards in the token file, both of which fail silently and completely.** styled-components v4 preprocesses with **stylis**, which strips `//` as a line comment and cannot cope with a bare `(` inside a quoted `url()`. Either one swallows the rest of that declaration *and* the closing brace of its block — so the next skin's block and the whole `html` rule get nested inside it, every custom property still resolves, every control still looks right, and the page has no ground at all. Nothing throws. That is why every slash and bracket in Blueprint's watermark data URI is percent-encoded (`%2F`, `%28`, `%29`) and its fill is a hex colour with a separate `fill-opacity` rather than `rgba()`. `skin.test.js` now asserts each skin paints a ground and that no selector mentions two skins.

The second: **a `var()` inside a custom property is resolved where that property is *declared*.** A token on `:root` cannot reach a per-card variable — it looks for it on `:root`, finds nothing, and the declaration drops out entirely. Dossier's HQ tab wants the team's colour, so the token is deliberately absent and the *component* carries the fallback (`var(--ha-hq-label-bg, var(--ha-hq-team))`), which resolves on the element that actually inherits it.

**The alignment card is the same constraint answered the other way round**, and it is the shape to copy when a direction wants to restyle something whose colour is the *game's*, not the skin's. Both marks on it — the `FRIEND`/`FOE` chip and the team's block — are filled with a colour the skin does not own, so what varies per direction is a **percentage, not a colour**: the component interpolates the colour into `color-mix(in srgb, <colour> var(--ha-card-…-fill), transparent)`, and a direction that does not want a fill sets the percentage to `0%`. Dossier types the word rather than reversing it out, so its label fill is `0%` and the same colour goes into its ink through `--ha-card-label-tint`; Blueprint never fills the team's block at all, because a drawing cannot print a colour — it names the team in chalk and calls the colour out below as a hatched finish. `--ha-card-label-fill: var(--ha-friend)` would have been the obvious way to write either and would have dropped the declaration in silence.

Two smaller things in the same file worth keeping: the chip's `box-shadow` is assembled from both sides — the team hairline needs the team, so the component writes it, while the bevel and the glow are tokens — and **every entry in that list has to be a real shadow** (`0 0 0 0 transparent`, not `none`), because `none` inside a comma-separated list is a parse error that would take the hairline down with it. And the swatch's caption is `content` on a `::before`, the same mechanism as the strip's section flag, with the two lines it can carry (`team 3`, `YELLOW`) gated by a `display` token each — so a direction says the team its own way and the component never learns which direction it is in.

`skin.test.js` reads all of that back as relationships (a fill's alpha, three distinct inks, one border width, which caption) rather than as literal colours: `color-mix()` computes to `color(srgb …)` where a plain `var()` computes to `rgb(…)`, so pinning either spelling would be asserting Chrome's serialiser rather than the design.

**It is custom properties, not a `ThemeProvider`, and that is not a preference.** styled-components injects a rule per distinct interpolated value and reclaims none, so a theme threaded through templates mints a second and third class for every component in the app — the same leak the projected-pixel rule in the 3D section exists to prevent. `theme/skinStyle.js` builds one static `:root[data-skin=…]` block per skin at module load; switching skin is one attribute write and nothing is re-injected. The consequence to respect: **everything a skin changes has to be expressible as a value**, which is why there are tokens for a `clip-path`, a rotation and a `background-image`, and why a direction that wants no ornament sets the token to `none` rather than omitting it.

Three things a skin may not touch, each of which would break the game rather than merely restyle it:

- **Any length that decides where a hexagon lands.** Every hexagon and every piece is a transparent DOM element laid on the projection of its own tile, and the drag controller and the whole suite hit-test against those boxes.
- **A border's width.** Its colour, freely. The turn strip sits above the board, so a 2px rule in one direction and none in another moves every tile down two pixels — which is why the title tokens are `2px solid transparent` where a direction wants no rule. `skin.test.js` asserts a cell's size and its offset *within the board* are identical across all three. Absolute position is deliberately not asserted: the strip is set in each direction's own face and carries its own button border, so the whole board legitimately sits a pixel or two higher in one than another, and the boxes move with it.
- **The feedback colours.** A legal cell's red, the teal and gold a spy's later steps are marked in, and a selected piece's `brightness(2)` are the one piece of vocabulary a returning player owns, and `helpers/get.js` reads them as computed strings. They are absent from the token table on purpose.
- **`text-transform` on any text a spec reads through `innerText`.** `innerText` applies it; `textContent` does not, and Playwright's `toHaveText` uses `textContent` — so `#claim-0` survived being uppercased and `#controlled-0`, which `claimControl.test.js` reads with `.innerText()`, did not. The claim message uses `font-variant-caps: all-small-caps` instead: same look, glyph-level, leaves the text alone.

What each direction adds beyond colour and type, all of it token-driven:

| | Dossier | Blueprint | Vault |
| --- | --- | --- | --- |
| Turn strip | routing slip, typed keys, initials boxes per seat | ruled title-block cells | machined rail segments |
| HQ card | team-coloured file tab, cut, with a file number | reversed-out sheet label | embossed tape |
| `FRIEND` / `FOE` | typed in the card's corner in ink mixed out of the stock, ruled under | reversed out of a filled corner tab, numbered `FIG. 1` / `FIG. 2` | small enamelled tag, bevelled |
| The team, on a card | over-printed on a block of its own colour that runs the width of the sheet, ruled above and below, with a *colour of record* chip glued on crooked | named in chalk between two rules and never filled, with a half-hatched *colour ref* callout under it | anodised plate bezelled in brass, over the trays' own indicator jewel |
| Card stock | pale sage and pale rose — the alignment is the colour of the paper, not a mark on it | dark cyanotype sheet | dark plate |
| Who holds a team | `CONTROL: FEDE` stamped, the name underlined in red pencil — `CONTROL: UNCLAIMED` when nobody does | `SIGNED OFF FEDE` in ferro red under a dashed rule — `UNASSIGNED` under the same rule | tamper tape across the foot of the tray — `UNCLAIMED` when there is none |
| Claim control | a `CLAIM` rubber stamp beside it | a drafted `CLAIM` with its corner cut | a brass `CLAIM` switch |
| Board | blotter-green recess, hairline framed | recess, chalk frame, coordinate ticks, a dimension line, a do-not-reproduce watermark behind the canvas | deep milled recess |
| `SNIPE` | round rubber stamp | ferro-red drafted control | red fire switch |
| Cemetery | typed tally on flimsy | hatched write-off | milled recess with brass |
| Board marks | — | coordinate ticks, a dimension line reading `7 CELLS · 37 PLAYABLE`, leader-line callout on the selected piece | — |
| Strip mark | the ceos-down stamp | `SECTION A–A` flag | engraved plate |
| Ground | manila with paper grain | cyanotype with the drawing grid | brushed gunmetal |

The turn strip is also where the game finally says **how many CEOs are down**. It ends at three and nothing on screen had ever mentioned it. `pz.getKilledCeoCount` was pulled out of `hasGameFinished` rather than counted again beside it, so the two cannot disagree.

`BoardMarks` (the coordinates) sits over the board and must keep **`pointer-events: none`**: the ring cells it labels are clickable, because that is how a piece on the border is pointed off the board, and an absolutely positioned label over one would quietly eat that. Its offsets come from the layout the renderer already returned, through the `style` prop — never a styled-components template, for the rule-leak reason above.

What a skin changes about the *board* is the plinth the tiles are seated in and the recess the whole section is sunk into — `palette.js#boardColors(skin)`, fed to `boardScene`. The plinth's materials are cached per skin, because `sharedAsset` is a module-level cache and a key that ignored the skin would hand the second room the first room's colours. The recess is a little lighter than the plinth in every direction, which is the right way round: it is the table showing through, and the tray sits on it. Tiles, tokens and trays are settled and identical in all three.

The recess **cannot be a CSS background** — see the note in the 3D section — so the renderer paints it, and the board element carries only a 1px frame. Its width is 1px in every direction on purpose: this element is what every hexagon's box is projected from.

## Two languages

The interface is in **English and Spanish**, chosen per browser. `src/client/i18n/` holds the store, `t()` and the two catalogs; `LanguagePicker` is the control.

**The language is not game state, and the server neither sends one nor needs to know.** Every string is chosen on the client, so two people at the same table can read the same room in two languages — which is the whole reason this is a preference and not a room property like the skin. Nothing about it crosses the wire.

Where a string lives depends on what kind of string it is, and the split is deliberate:

- **Chrome** — buttons, notices, labels, refusal messages — is in `i18n/{en,es}.js`, keyed by where it is read (`lobby.startAGame`, `play.nextTurn`). `en.js` is the inventory *and* the fallback: a key missing from `es` shows the English sentence, so a gap in a translation looks like a gap rather than an empty button.
- **The rule book** is content, so it keeps the shape it is authored in: `rules/content.en.js` and `rules/content.es.js`, picked by `rules/content.js`. A translator works on whole paragraphs in order with the picture named on the line above.
- **The training course** is an *overlay*: `exercises.js` stays the single course — boards, gates, and the predicate that closes each step — and `exercises.es.js` supplies only titles, findings, notes, verbs and hints, by slug and step position. `training/text.js` merges them. A translation cannot move a cell, which is the point.
- **The skins' own wording** (`CONTROL:`, `SIGNED OFF`, `SECTION A–A`) is skin × language, because which words they are is the skin's business as much as the language's. `SKIN_WORDS` in `theme/tokens.js`, injected by `theme/skinWords.jsx` as a *second* `createGlobalStyle`: the first one is six hundred declarations that must be injected once and never again, and interpolating a language into it would mint a whole second copy of them.

Four things that must survive any edit:

1. **Slugs are never translated.** `#/rules/the-spy` is in the URL, and a shared link has to open the same page for everybody. Same for skin names, room codes and piece ids: an id is the wire's name, and only the label beside it is a language's.
2. **A drawn room name is a name, not a string.** `domain/roomNames.js` stays English, or two browsers scan a list that does not agree.
3. **`playwright.config.mjs` pins `locale: 'en-US'`.** With no stored choice the app reads `navigator.languages`, so an unpinned locale means the suite reads the interface in whatever language the machine is set to — and every assertion is written against the English strings. On a Spanish laptop the whole suite fails, naming a button rather than a locale. A spec that wants Spanish asks with `?lang=es`.
4. **`?lang=` pins for one page load and writes nothing down** — the contract `?skin=` has. A shared link may dress the page it opens and may not rewrite the preference of whoever opened it. The picker persists to `localStorage`; the query param does not.

`src/tests/unit/i18n.test.js` is what keeps this honest, and it needs no browser: it walks the English catalog and asserts a Spanish counterpart for every key, the same placeholders in both, the same pages in the same order with the same layout, a verb for every step of every exercise, and that no skin word contains a bracket or a slash — stylis would swallow the rest of the stylesheet and the page would simply have no ground. **A translation fails by being absent, and an absent string renders as English, which looks like a choice.** That spec is the only thing that would notice.

Adding a language is: a catalog, a `content.<lang>.js`, an `exercises.<lang>.js`, a column in `SKIN_WORDS`, and the code in `LANGS`. The two data files are registered in `rules/content.js` and `training/text.js` respectively.

**The rule book's photographs are English screenshots.** Every `alt` and `caption` is translated, but the pictures themselves show `CONTROL: ALICE` and `NEXT TURN`. Regenerating them per language is a separate job — the captions describe what is happening, not what the capture says.

## Architecture

### Three layers

`src/domain/` and `src/game/` are the **shared core**: pure game rules and the reducer, with no React and no browser globals. `src/client/` is the UI. `server/` is the multiplayer server. Both the client and the server import the core; **neither `src/domain` nor `src/game` may import from `src/client` or `server`** — that direction is checked by eye today and is the thing to preserve.

### The server

`server/` runs the *same* `gameReducer` as the browser and is authoritative. Three properties define it, in priority order, all tested over a real socket in `src/tests/unit/server.test.js`:

1. **A seat never receives another seat's alignment.** `redact.js` projects the state per recipient, so a secret is never serialised in the first place. It fails closed: an unknown seat name sees nothing. The one exception is `phase === 'end'`, because scoring needs every alignment (`py.getPoints`).
2. **Only the seat on turn may act**, with one deliberate inversion. That rule is nearly the whole ownership model — the game lets the turn holder move *any* team's pieces, so there is nothing per-piece to check. The inversion is the **snipe**: arming `SNIPE` and toggling a lit sniper are how the rest of the table answers the move that was just made, so they are refused *to the seat that made it* (`not_your_snipe`) and allowed to everyone else. That seat is `snipeWindow.getMover`, not the turn holder, because a shot outlives the turn it answers — reading it off `py.getTurn` would let the mover answer their own move the instant they pressed NEXT TURN, and refuse the shot to the one seat that has done nothing at all. `isSnipeAction` in `validate.js` is deliberately narrow — it defers to `pz.isSnipeShot`, which wants an armed snipe, a shot on the table and a sniper with `highlight` — because widening it would hand a non-turn seat an ordinary move. There is also an escape hatch: `NEXT_TURN` after the turn holder has been disconnected for 60s, so a closed laptop cannot end a game permanently.
3. **Legality is re-derived server-side** from `pz.getHighlightedPositions` / `pz.getPossibleDirections`. In the local game legality was only ever enforced by which hexagons the UI made clickable.

Things not to undo:

- **`START_GAME` and `SET_ALIGNMENT` are absent from the actions a client may send.** Starting a game and dealing cards belong to the server; a client asking for either gets `action_not_allowed`.
- **A room holds no sockets.** It stays plain JSON so `persistence.js` can write it per file, which is what lets a deploy restart without killing games in progress. Live sockets live in a `Map` keyed by seat id in `index.js`.
- **Persistence is best-effort on purpose.** `/var/lib` is not writable on a dev machine, so it disables itself and logs; failing to save must never take the server down.
- `createGameServer()` (in `index.js`) is separate from the process entry (`main.js`) so tests can create a server without binding a port or installing signal handlers.
- **A seat is reclaimed by token, and the displaced socket is closed with code `SEAT_RECLAIMED` (4000).** The code is not decoration: the client reads it and stands down instead of reconnecting. Without that, two sockets holding one seat take it off each other forever — see the socket rule below, which is how that actually happened.
- **A socket closing only reports its seat as disconnected if it was still the registered one.** A socket that has already been displaced closing says nothing about the seat, because somebody else is holding it. Reporting it anyway marked a player who had just reloaded as offline, started the 60-second turn-grace clock under them, and broadcast the room twice for a reconnection that had already worked.

### Finding a room

The index lists public rooms. A room has a **name** as well as a code — the code is what you type, the name is what a table calls itself and what a latecomer searches for — and a **visibility**, public by default. Private means one thing only: absent from the list. The code still joins it, which is what makes a shared link to a private table work.

- **The name is drawn, not required.** `pickRoomName` combines one word from each of two themed lists (`secret-agent`, `cunning-traitor`), so the field is never empty and "mandatory" costs a host nothing. The lists are in `domain` because the server validates the name and the client draws the default from the same place. A create with **no** name gets one drawn server-side — the lobby cannot send that, so it means some other client, and every row in the list should be readable. A name that is *present and malformed* is refused (`bad_room_name`): that is hostile input, not a missing default.
- **Searching treats a space and a hyphen as the same separator**, so somebody who reads `secret-agent` off another screen and types what they would say out loud still finds it.
- **Started rooms sort to the end, and stay in the list.** They are no use to a stranger — `addSeat` refuses them — but they are exactly what somebody coming back to their own game is looking for. Which is why **selecting a room is one operation**: `joinRoom` rejoins when this browser holds a token for that code and joins otherwise, so a row you already have a seat in puts you back in it rather than refusing you as a latecomer.
- **The list is pushed, not polled.** A socket becomes a watcher by asking (`list`), stops being one the moment it has a seat, and `refreshLists` sends only when the answer has actually changed. It is **one timer for every watcher rather than an invalidation hook in create / addSeat / start / remove**: a hook that gets forgotten leaves a stale list and nothing says so, while a timer that recomputes and compares cannot be forgotten.
- The `rooms` frame is the one frame in the protocol **sent to sockets with no seat anywhere**, so it has no recipient to be redacted for and must never carry game state. `server.test.js` pins its keys.
- The lobby opens a socket to feed the finder, which is why **`ConnectionBanner` needs a `seatId`**: on a build with no server at all (Pages) an unseated client is always reconnecting, and shouting "connection lost" at somebody who has not tried to do anything is a message about nothing. The lobby says it in its own words next to the way out.

### Leaving

`leave` is a message, not an action, and the server names the player from the seat that sent it — so **`REMOVE_PLAYER` is deliberately absent from `PLAY_ACTIONS`** and nothing a client can send removes anybody but itself.

- **Nothing on the board is orphaned when a player goes**, and that is a property of the game rather than luck: pieces belong to *teams*, everybody moves everybody's pieces, and a team is only ever claimed. What leaves is a place in the turn order, a pair of cards nobody will score, and whatever team they held — released through `teams.releasePlayer`, which derives `claimEnabled` from `pz.canClaimControl` like every other writer, so a team abandoned with its CEO on the board stays unclaimable rather than becoming free.
- **The turn is the one thing that cannot just be filtered out.** Exactly one player holds it and `py.getTurn` reads that with no guard, so `py.removePlayer` passes it on if it was theirs. The server *also* applies a real `NEXT_TURN` first, because a turn change is more than a flag — it snapshots the board for the sniper rollback, clears a half-finished move and recomputes the CEO buffs. Same shape as the 60-second forced pass in `apply.js`.
- **A game needs two, so leaving a dealt table in a way that would strand somebody takes them with it** and the room is gone. Scoped to `alignment` and `play` on purpose: at `end` there is nothing to play either way and the scores are worth reading, and in the waiting room being alone is just what having opened a room looks like. The two departures are told apart on the wire (`you_left` / `left_alone`) because they need different words on screen — one is something the player did, the other is something that happened to them.
- **A seat leaving during `alignment` can be the last one the room was waiting for.** `advanceIfEveryoneIsReady` is called from `leave` as well as `markReady`, or the others sit looking at cards they have already confirmed in a game that never starts.
- The host leaving hands the room to whoever is left, or `START` belongs to somebody who is not there.
- **The socket stays open** — the player is going back to the lobby, not off the internet — so `unseat` clears everything tying it to a seat, and the client resets to `unseatedSession()` rather than the last room's state with holes in it.
- **Leaving is a decision, not a request.** `store.leave` tells the server if it can and calls `goToIndex()` either way. It used to be only `send({type:'leave'})`, which returns false with no open socket — so the button did nothing at all in the two situations a player most wants out of: a connection that has dropped, and a seat displaced by another window (that socket is closed on purpose and never reconnects). A seat nobody said goodbye for is left to the sweeper, exactly like a closed laptop.
- **`goToIndex` resets the session before the game state**, and the order is load-bearing: the two observables notify separately, so a render can land between them, and emptying the game state while the session still says `play` renders the board against no players — which throws in `py.getTurn`. It also has to be safe to run twice, because in the ordinary case the server's `left` frame arrives after the player has already gone.
- Where the control appears, and why the confirmation is not uniform: a screen on the board (`leaveScreen.jsx`, the same reasoning as accuse and reveal — a decision with a price, in a bar three items wide), and a plain button in the waiting room (nothing is lost: the code still joins it), on the friend-and-foe screen (a waiting screen, where a confirm step would be the obstacle rather than the safeguard — and the way out when the table is waiting on somebody who has closed their laptop) and at `end` (the game is over). It renders **nothing at all** in hot-seat, like `SkinPicker`: there is no room to leave.
- It shares the `FRIEND & FOE` group in the action bar rather than taking a fourth. `Actions` is `flex-basis: 33%` three ways and the landscape phone layout has no slack; `responsive.test.js` has an online spec for that bar, because the hot-seat ones can never see this button.
- **`Buttons` is a flex row with a gap now**, not `text-align: center`. It had never had to hold two controls before, and each direction gives a control an edge of its own — so `START` and `LEAVE ROOM` shared one, and in Dossier, where a stamp sits slightly rotated, they overlapped outright.

### Refreshing without leaving the game

**The player's own name is remembered too** (`net/playerName.js`, `ha:name`), and the lobby's field opens filled in with it. Written when the *server* confirms a seat rather than on every keystroke, so what comes back is a name that actually worked — not a half-typed one, and not one the room refused as already taken. It seeds `useState` rather than being a `value` prop, so a name arriving from the server cannot overwrite what somebody is typing. The hot-seat form is deliberately untouched: those fields are the names of the other people round the screen, not whose browser this is.

A refresh keeps the room in the hash and the seat token in `localStorage`, so the seat is reclaimed before anything renders. Arriving at the **front door** instead — a bookmark, a new tab — loses the hash, so `ha:seats` records what this browser is holding and the lobby offers it back. Entries are pruned at three hours, because the server evicts a room by then whatever is happening in it, and forgotten on `seat_lost` — which also retries as a plain join when a name is known, since a code can be recycled after an eviction.

**The socket is opened from an effect, never during render, and this is the rule to not undo.** `createTransport` runs inside a `useMemo`, and React may call a memo factory more than once for a single mounted component — it is a cache, not a lifecycle. When the store opened its own socket at construction, two were built and only the one React kept was ever closed. The orphan reconnected, the server gave it the seat and displaced its twin, the twin took it back, and the two traded the seat every half second. **What that looked like was a refresh that worked**: the board came back, because a snapshot does arrive. Every action after it went out on whichever socket had just lost the seat, so `send` returned false and nothing was sent — and since discrete actions are predicted locally, the player watched their own move happen and nobody else at the table ever saw it. `socketStore#open` is the seam; `online.test.js` pins both halves, the behaviour and the socket count.

Build with `npm run build:server` → `dist-server/main.mjs` (committed, like `docs/`). Note the **`.mjs`** extension, and that `vite.server.config.mjs` needs `publicDir: false` or the bundle acquires all 116 piece images.

### Ratings

Players are rated without registering for anything. Each browser mints an id into `ha:player` (`net/playerId.js`), sends it on create/join/rejoin/queue, and the server keys ratings by it. **It is a bearer credential for a rating and nothing else** — the seat token remains the only authority for who may act — and `protocol.js#ratedMessage` exists largely to strip it, because an id reaching another seat lets them play as its owner. `skins.test.js` pins the room frame's seat keys for that reason.

Two consequences worth stating plainly: a rating belongs to a *browser*, not a person, so clearing storage starts again; and a seat with no id (storage disabled) plays unrated while the rest of the table is rated amongst themselves.

**The log is the truth and a rating is derived from it.** `server/ratings.js` appends one line per event to `games.jsonl` and folds the whole file at boot; nothing else is stored. That is what makes the constants in `domain/rating.js` changeable — none of them is known to be right yet, and `rebuild()` re-folds rather than resetting. One `apply` serves both replay and live recording, which is the only reason a restart is guaranteed to agree with the server that wrote the file. Best-effort like `persistence.js`: unwritable means disabled and logged, never a crash.

**`HA_RATINGS_DIR` must not be inside `HA_STATE_DIR`.** `persistence.loadAll()` reads every `*.json` in the rooms directory and maps `room.seats` inside its outer `try`, so one foreign file throws, the catch returns `[]`, and **every game in progress is dropped on the next restart**. Set explicitly in `dev.sh` (`.dev-ratings`), `playwright.config.mjs` (`.playwright-ratings`) and the PM2 config.

The model is **Weng–Lin (Bradley–Terry, full pair)**, not Elo, because a game here is 2–6 players with a full ordering and Elo is a two-player formula. `rate({ entries, pairWeight, only })` is the whole of it, and those two knobs express every rule:

- **β is 1.5σ₀, not Weng–Lin's σ₀/2.** A six-player table produces five pairwise results at once, but they are not five independent readings — everybody played the same board off the same deal. Measured: it takes a first-game 6-player swing from 1000 → 1877 down to 1000 → 1510 while leaving a thirty-game winner at 2313, so none of the separation is lost. To make the system more or less volatile, move β; leave the display scale alone.
- **Displayed MMR is `round(60 × (μ − σ))`**, which is exactly 1000 at the start because μ₀ − σ₀ is 50/3. Conservative on purpose and the same number the leaderboard sorts by, so nobody tops it on one lucky game. The side-effect is real and intended: an average player drifts to ~1115 over thirty games as σ shrinks.
- `pairWeight` is asked **per direction**, so the two halves of a pairing can be worth different amounts. That is what "full loss for the leaver, half a win for the player stranded" needs, and it damps the σ gain as well as the μ movement — a game that should not move a rating should not teach us much either.
- Nothing is zero-sum, deliberately. Each player's update is computed from their own perspective, which is what lets a whole table lose rating for abandoning a game.

Three moments are rated, and only three: a room reaching `END` (places from `py.getPlacings`, ties shared), a seat pressing `LEAVE` mid-game, and the sweeper evicting a room still in `alignment`/`play` — where every seat that had *disconnected* takes the leaver treatment, so closing the laptop and pressing LEAVE cost the same. A game reached with nothing on the board is a genuine **draw**: no kills means every team is worth its full survivors, so friend and foe cancel and everybody sits on 100. `rooms.js#isMidGame` is exported so the stranding rule and the rating rule cannot disagree about `end`.

**Repeat pairings soften rather than cap**: `1 / (1 + n/3)` over meetings in the trailing week, applied to departures too — two browsers alone in a room, one quitting so the other collects, is otherwise the cheapest farm in the system. It needs nothing about where anybody connected from, so **no address is ever stored, hashed or compared**.

Quitting repeatedly costs a cooldown before joining anything new: `30s × 2^(level−1)` capped at 64 minutes, one level decaying per day. Derived from the log by folding quit events, so nothing extra is stored. Checked in `create`, `join` and `queue`; **deliberately not in `rejoin`**, which is reclaiming a seat you already hold — blocking it would turn a refresh into a lockout.

**Automatch** (`server/queue.js`) is socket-free and testable without a server. It anchors on whoever has waited longest rather than the tightest cluster in the queue, which is a fairness rule: two well-matched arrivals must not keep stepping over somebody already waiting. The window opens from 150 MMR to anybody over a minute; a table fires at four, or at two after fifteen seconds. A group must have distinct player ids (or one browser matches itself) *and* distinct names (or `addSeat` would refuse the seat). A match makes an ordinary **private** room and the host still presses `START` — what automatch replaces is finding a table, not playing at one.

### Inside the shared core

`src/domain/` is the game rules — plain functions, no state container. `src/game/` is the reducer, the actions and the store built on top of them. Rules belong in `domain`; components call into it rather than re-deriving geometry or legality.

| Module | Responsibility |
| --- | --- |
| `domain/pieces/pz.js` | The big one (~1000 lines): toggling/selection, movement, legal positions per piece type, killing, snipers, CEO buffs, claim-control effects. Exported as the `pz` object, with sections marked by banner comments. |
| `domain/py.js` | Players: turn order, alignments, reveal, accuse, scoring (`py` object). |
| `domain/teams.js` | Team control (who commands which team's HQ) and team point totals. |
| `domain/cells.js` | Hex board geometry, plus `CELLS_BY_ROW` / `ROW_NUMBERS`. |
| `domain/deal.js` | Deals the hidden friend/foe alignments. Pure and takes an `rng` because Phase 1 moves it to the server. |
| `domain/phases.js` | The four phase names, plus `ROOM_STATES` and `roomStateFor` — what a room looks like from outside it. In `domain` because the server sends these strings. |
| `domain/roomNames.js` | The two word lists a room's default name is drawn from, `pickRoomName(rng)`, and the shape and search rules. In `domain` because the server validates the name and the client draws it. |
| `domain/rating.js` | Weng–Lin rating maths, the displayed-MMR scale, the repeat-pairing softening and the quit-cooldown ladder — all pure. Plus `isPlayerIdShaped`, here because both ends need it and neither may import the other's modules. |
| `domain/utils.js` | Coord helpers, the six-direction ring, `memoize`. |

`pz` and `py` import each other, which works because both go through their default-exported objects. Keep new cross-module calls doing the same.

### Reducers must stay pure

This is the one invariant to not break. `pz` used to mutate piece objects in place, and because `piecesPrevStateReducer` takes a shallow copy, `piecesPrevState[i]` *was* `pieces[i]` — so the previous-turn snapshot that the sniper rollback restores from was corrupted by the current turn.

Purity is now load-bearing three times over: React 18 StrictMode double-invokes reducers (a mutating toggle would apply twice and cancel itself), Phase 1's server keeps one state object per room and persists it, and redaction depends on being able to project state without disturbing it.

There are guards in `src/tests/unit/pieces.test.js` that deep-freeze the input and call the reducers. Don't add mutating helpers; return new objects.

### Piece ids and DOM ids

A piece id encodes team, type and number as a string: `0-A1`, `1-C`, `3-N`. `pz.getTeam(id)` is `charAt(0)`, `getType(id)` is `charAt(2)`, `getNumber(id)` is `charAt(3)`. Team is therefore a **string** `'0'`–`'3'` everywhere, and much of the code compares with `==` deliberately because team indices arrive as both string and number. Types: `A` agent, `C` CEO, `S` spy, `N` sniper.

An alignment card carries a good deal of its own text now — the word in its corner, the team over a
colour-of-record chip, and what the alignment does to your score along the bottom — so **its
`innerText` is not a team name.** Read the team off `[data-team]` inside it, which is the index and
exact. `goToPlay` returns those indices; a helper that quietly returned `undefined` surfaced as a
selector like `#controlled-undefined`. **Exactly one element per card carries `[data-team]`** — the
swatch names the same team but takes it as a prop — so a strict-mode locator stays unambiguous. The
label is also the card's only `<i>`, which is why the chip is a `span`.

DOM ids the tests depend on: `pz-{pieceId}`, `hex-{row}-{cell}`, `board`, `store-{team}`, `claim-{team}`, `controlled-{team}`, `piece-count-{team}-{TYPE}`, plus `next-turn`, `snipe`, `snipe-note`, `snipe-fallen-{pieceId}`, `accuse`, `reveal`, `reveal-friend`, `reveal-foe`, `start-btn`, `alignments-btn`, `player-name{n}`.

`snipe-note` and `snipe-fallen-{pieceId}` are both **absent rather than empty** when they have nothing to say — the note renders only in hot-seat, the mark only while a snipe is armed on a sniper that is off the board — so a spec asserting `toHaveCount(0)` is asserting the rule and not a blank string.

The lobby's own: `lobby-name`, `lobby-code`, `lobby-join`, `lobby-create`, `lobby-room-name`, `lobby-room-reroll`, `lobby-visibility-{public,private}`, `lobby-search`, `lobby-rooms`, `lobby-room-{CODE}`, `lobby-resume-{CODE}`, `lobby-room-code`, `lobby-room-title`, `lobby-seat-{NAME}`, `lobby-start`, `lobby-leave`, `lobby-queue`, `lobby-queue-status`, `lobby-queue-need-name`, `lobby-last-game`. Leaving from elsewhere: `leave-game` (the bar and the friend-and-foe screen), `leave-screen`, `leave-note`, `leave-cost`, `leave-rating-cost`, `leave-confirm`, `leave-close`, `end-leave`. **A row in the finder carries its facts in `data-room-{name,host,players,state,rating}`** rather than in its text, for the `innerText` reason above: what the row *says* is the direction's business — it is set in small caps and free to abbreviate — while the count, the state and the table's average rating are what a player acts on. A seat row carries `data-rating` for the same reason, and both are **absent rather than empty** when there is nothing to look up, so "unrated" cannot be read as "rated 0".

**How to Play's own: `lobby-menu-rules`, `rules-main-menu`, `rules-index`, `rules-open-{slug}`, `rules-lightbox`, and the pager — `rules-{prev,next}-{top,bottom}`.** The pager is rendered twice, above the content and again below it, so those four are two real sets of buttons rather than one drawn twice: duplicate ids would be invalid and a strict-mode locator would resolve to neither. `rules.test.js` covers the pair, and that a page turn starts the next page at the top.

- **The two halves of the pager are not the same control.** At the foot each names where it goes; at the head they are a glyph either side of the title — a running head — because a band of chrome costs most on the screen with the least of it. So **the head's pair say their destination in `aria-label`, not in their text**, and a spec reads them that way. `RulePage` stacked the header, the way out, the title and the pager four deep, which came to 210px of a 700px phone before the first word; the running head and a tighter frame bring that to 131. `rules.test.js` holds it under a budget rather than at a number — what it is guarding against is the drift back.

- **`.game` is the scrollport, not the document.** It is absolutely positioned over the whole viewport with `overflow-y: auto` (`globalStyle.js`), so the page behind it never scrolls, `window.scrollY` is 0 however far down you are, and `window.scrollTo` — the obvious thing to reach for — does nothing at all. `enterView` in `lobbyPhase/index.jsx` resets `.game`'s `scrollTop` on every menu navigation, because each view is the same mounted component with different props and nothing else would: turning a rule page from the bottom used to land the reader at that same offset in the next one, past its title and most of its picture. Deliberately not on `popstate` — Back is the one navigation where keeping a position would be right, and neither answer is, so it is left alone.
- **An exhibit row is two columns at most on a phone.** `ExhibitPairRow` divides its width between however many frames the page hands it, and it had no narrow rule — so the Sniper's four beats rendered at 75px each and Making a Move's five at 58. A board crop that small is not a smaller picture; the thing it was cropped to show stops being visible. `rules.test.js` walks all eighteen illustrated pages at 390px wide and fails on anything under 140px.
- **An exhibit's caption flows under its photograph.** It used to be absolutely positioned into a flat 68px of reserved padding at the foot of the mat, which is a fixed height for text that wraps — a caption needing a fourth line grew upwards over the picture instead, which is what a phone does to two of these pages. `rules.test.js` asserts no `figcaption` overlaps its `img` at 390px wide.

### Field training

The index's first door is not a page. **`src/client/phases/lobbyPhase/training/` is a course of ten exercises played on the real board**, reached from `rules-open-training` and living at `#/training/{slug}`. Its own ids: `training-briefing`, `training-mat`, `training-mat-tab`, `training-title`, `training-record`, `training-go-{slug}`, `training-step`, `training-verb`, `training-hint`, `training-restart`, `training-finding`, `training-finding-line`, `training-file`, `training-next`, `training-complete`, `training-read-{slug}`, `training-play`, `training-back-to-index`, `training-card-{friend,foe}`, `training-placard`, and `training-mark-{targetId}` for a coach mark. `training.test.js` drives it and `unit/training.test.js` walks every exercise through the reducer with no browser.

**The screen is two boxes, and the split is the design.** `training-briefing` is the folder: manila stock, a tab, a shadow, and it holds what the course says — the exercise title, the record, the order slip or the finding card, and the three ways out. `training-mat` is the game: an outline on the desk with a dark tab on its own top edge, holding the real `TurnStrip`, the real board, the real HQ cards and the real `SNIPE` / `REVEAL` / `ACCUSE`. Nothing of one is inside the other, and a spec asserts exactly that per element. Before the boxes existed all of it was one centred column of loose bands, so `START OVER` and `NEXT TURN` were the same red stamp at the same size five inches apart.

Four rules keep the two apart, each of them cheap and each of them load-bearing:

- **Red is the game, ink is the course.** Every control reads its colour from the `--ha-control-*` tokens, so `Cta` and `NavLink` re-declare those tokens *on themselves* rather than restyling the shared `Button` — one class each, and the game's own controls are untouched. The stamped verb and the `Passed` stamp are ink for the same reason: at the accent they read as a second `SNIPE`. The record boxes were already ink.
- **One loud control per state, and never during a step.** While an exercise is running the thing to press is out on the board, so the folder offers nothing filled at all: the ways out are underlined text. A passed exercise has exactly one — `training-next`, a filled ink block — with `training-file` a quiet link under it. Same on the closing card: `training-play` loud, everything else quiet.
- **The mat is an outline and a tab, never a fill.** A background anywhere in this tree paints over the WebGL canvas, which is where the board's dark recess is drawn. The inset ring is safe because it paints inside the padding, which the board never reaches. The tab sits *on* the top edge (`position: absolute`) because a row of its own is twenty pixels off a board that fits an 800x600 window with nothing to spare — and the mat's top padding clears both that tab and the file tab an HQ card wears overhanging its own top corner. At the first padding tried, the lesson with four HQ cards printed the two labels over each other.
- **`TrainingBoard` takes what the mat is not using, and `$bar` carries the difference.** 318px sits above the board on every lesson; below it there are 12px of mat edge, plus 32 more on the three lessons that render an action bar. So the whole of a lesson is visible at 800x600 including the control it presses — which the old single figure claimed and missed by 37 pixels, putting `SNIPE` below the fold on the one exercise that asks for it. The lobby's own 24px of bottom padding is deliberately *not* in the subtraction: buying it back costs board on every small screen, and what falls past the fold instead is a margin.

It is a real game, not a diagram of one:

- **It mounts the play phase's own components** — `TableBoard`, `Hexagon`, `Piece`, `HQ`, `TurnStrip` — **under a nested `StateContext` and `SessionContext` of its own**, over a hand-authored board. So the answer to every click is the game's answer, and a lesson physically cannot teach a move the rules refuse. The session is `mode: 'local'`, which is what makes `useCanAct` and `useCanSnipe` both true.
- **It nests its own `DragProvider`.** The app's is mounted above the lobby in `game.jsx` and calls `useCellAction` against the *outer* store, so without a nested one every drop would dispatch into the lobby's transport: the training board would simply not move, and nothing would be thrown to say so.
- **A step is a gate, not a script.** `exercises.js` gives each step the clicks it accepts (`allows`) and a predicate over the board that says it is finished (`done`); everything else does nothing at all. That is why an exercise cannot be walked into a dead end and nothing ever has to be undone. `allowsAction` is the one gate, read by the runner and by both specs, and it exempts `DIRECT_PIECE` — aiming is a hover, only ever touches the piece in hand, and is undone by hovering elsewhere.
- **The gate, the board and the step index move in one reducer.** They were a `useState` and an effect first, which is a frame apart: a click arriving in that frame is judged against the step before it. And `done` describes the board *at that moment* — "the agent is in your hand" stops being true when you put it down — so the step index is walked *forward* from where it was, never recounted from zero.
- **`unit/training.test.js` derives its walk from the coach marks** rather than from a second script kept beside them. What it proves is the promise the screen makes: click only what is ringed, in order, and every exercise finishes. A board written down by hand is a board nobody has played, and one cell out is a lesson whose second step is simply never offered.
- **Coach marks are `pointer-events: none` and follow their target from a frame loop.** The board is drawn in WebGL and every hexagon is a transparent box projected onto a tile, so where a cell lands answers to the window, the scroll and the camera fit at once — asking the element every frame is the only reading that cannot drift. A spec asserts `elementFromPoint` under a mark still resolves to the piece. Three kinds: a pulsing ring on what to click, a crossed one on what deliberately is *not* offered, and a hatched cell for a sniper's line. An exercise may also declare a **`spotlight`**, shown once it is finished and scrolled into view — what has just changed is often at the foot of an HQ card, nowhere near the click that changed it.
- **The turn strip is rendered only where a lesson presses NEXT TURN**, and the sniper's line only for the steps that are about it. Everything on screen that a step is not using is a thing the board is not.
- **A mark is drawn in cream over a dark halo, never in a board colour.** Red means "you may go here now" and the spy's teal and gold mean "and later"; that vocabulary belongs to the game and a tutorial must not borrow it.
- **The order slip is set from the left, and the stamp does not move.** `training-step` has a width of its own and the line is left-aligned, because centred the stamp swung a hundred and sixty pixels sideways between a step with a hint and a step without one, and seventeen more between step 9 and step 10 — and it is the loudest thing on the screen. The hint sits beside it at 14px in full-strength ink; it used to be 12px of dim italic, the smallest type on a screen carrying nine controls. **`Briefing` is 820px wide for one reason: the longest step in either language (Spanish `DESPLEGAR` beside a 38-character hint, 764px) has to keep both on one line.** Narrower than that the hint wraps to a line of its own, which grows the box, which slides the board — so on a phone the hint always has that line, whether or not the step has a hint. `training.test.js` walks the widest exercise and fails if the slip is ever two different heights. One case survives on purpose: the single 38-character Spanish hint on a 390px phone.
- **The slip and the finding card take turns in one box — `training-placard` — and it travels between their two heights.** They are a line of chrome and a card, so swapped straight over they dropped the whole board down the screen in a single frame. The box measures whatever is in it through a `ResizeObserver` and transitions `height`; the card is at full size from the first frame and what clips is the **bottom edge only**, so the sheet is revealed top-down as the room for it opens. Six things about it are load-bearing:
  - It is `clip-path: inset(-40px -40px 0 -40px)`, **not `overflow: hidden`**, which would need padding to spare the stamp's overhang and the card's shadow — and padding here is height taken off a board that fits an 800×600 window with nothing to spare.
  - The sheet inside must not stretch (`align-items: flex-start`), or the measurement feeds back: the box is told its height and a stretched child measures that same height straight back, so the card never gets its room.
  - The measured height goes through the **`style` prop**, for the rule-leak reason the projected hexagons follow.
  - **The board below travels with it, and the board is painted by WebGL** — which at rest only looks for a shifted element ten times a second (`IDLE_POLL_FRAMES`). Left alone the tiles come down in five steps while the card slides, so every frame of the travel is asked for through **`invalidateStage()`**, which exists for this: unlike `getStage()` it never *creates* a stage, because something that merely knows the layout is moving must not be the reason a renderer exists.
  - The height must **not overshoot**. Every hexagon is a transparent box projected onto a tile, so a box that springs past its mark and comes back moves all 61 of them twice. The bounce lives in the card's own `transform`, which is not layout.
  - **The spotlight scroll runs twice** — once on finishing, which is the only time it happens for a player who has asked for no motion, and again when the box reports it has settled. Scrolling to a line at the foot of an HQ card while the card above it is still opening leaves it as far below the fold as it started.
- **A passed exercise is stamped, and that is the whole of the animation's vocabulary.** The card is cream rather than manila now, because it lands *inside* the folder and manila on manila is an edge drawn round a sheet rather than a sheet. It drops in a little high and a little large, squashes on the desk, rebounds, and then the `Passed` stamp comes down too big and off-angle and knocks it once — cartoon timing with no glow, no flash and no colour that is not already in the file. The stagger on its lines is deliberately tight: a card that fades up while its own text is still queued is a blank manila box for a beat, which reads as something loading rather than something arriving. `prefers-reduced-motion` removes the travel and the entrance alike.
- **In `training/components.jsx` a component that is named in another component's selector must be declared above it.** `Finding` staggers `FindingLine`, `FindingSmall`, `FindingNote`, `DoneList` and `Buttons` by name, and a component selector is resolved when the module is read rather than when a card is rendered — a reference below its use is a `ReferenceError` at import time, not a rule that quietly misses. (And no backticks inside a styled template: they close it, and the parse error names the CSS rather than the quote.)
- **`pz.getSnipedPositionsBy` is exported for the sniper exercise alone.** The game never draws a line of fire — a player reads it off the cells another piece is quietly refused — and learning that it is there at all is the whole of that lesson. It has to be the same list the kill is worked out from, not a second reading of the rule.
- **`Hooks/useSnipe.js`, `useCanReveal` and `useCanAccuse` are shared with the action bar**, so what may press SNIPE, REVEAL and ACCUSE is decided once.
- **The last two exercises render the game's own `RevealScreen` and `AccuseScreen`.** Those are opaque and cover the table at `z-index: 900`, so the slip goes with it and the screen's own title becomes the instruction — which is why `MarkLayer` sits at **950**, above the screens and below the drag ghost at 1000. Opening and closing a screen is a fact about the screen and not about the board, so it travels as a note rather than an action. And the accuse step carries **three** marks — the screen asks its three questions one at a time and takes the previous one away, so exactly one of them is ever in the DOM.
- Every exercise names the rule page it came from, and the finding card links to it — the course teaches the board, the pages carry the words, and the closing card says outright what it never put on a board (scoring, which is arithmetic done once at the end and has nothing to click at it).

Three of the ids above belong to one line at the foot of an HQ card and are not interchangeable:

- **`hq-control-{team}`** — the line itself, which says who holds the team. Its words are `content` on a `::before`, because they are the direction's own, so its `textContent` is empty unless somebody holds it. `skin.test.js` asserts what it actually says.
- **`controlled-{team}`** — the holder's name, inside that line, and present exactly when there is one.
- **`claim-{team}`** — the claim button beside it, labelled `CLAIM` or `CANCEL`. It is **absent** when there is nothing to claim (a team whose CEO is on the board) and **disabled** when a claim would do nothing (the turn is spent, or the team is one this player just let go). Those are different states and specs assert them differently.

### Board geometry and directions

7 rows of `[4, 5, 6, 7, 6, 5, 4]` cells; a position is `[row, cell]`, and `[null, null]` (`OUT_POSITION`) means off-board/dead. A direction is a pair `[v, h]`: `v` is `1` up / `0` sideways / `-1` down, `h` is `1` left / `0` right — six combinations, listed in ring order in `utils.js#possibleDirections` so `directions.getPrevious/getFollowing/getOpposite` are rotations.

Translating a direction into the next cell is **not** uniform: it depends on whether you are above, on, or below the middle row (row 3), because the hex rows change width. That logic lives in `cells.js#createGetPositionInDirection`. Always go through `cells.get(position).getPositionInDirection(...)` / `getPositionsInDirection` / `getPositionAfterDirections` rather than doing coordinate arithmetic in a component or in `pz`.

The board renders two extra cells per row and an extra row above and below, so a piece on the border can still be pointed outwards. Those edge hexagons have ids like `hex--1--1`.

### State container

`src/client/state/index.jsx` holds one `useReducer` behind a `withState` HOC; components read `const [state, dispatch] = useContext(StateContext)`. Slices: `players`, `hasTurnEnded`, `pieces`, `pieceState`, `followMouse`, `snipe`, `snipeWindow`, `piecesPrevState`, `teamControl`.

**This is not Redux `combineReducers`.** Every slice reducer is called with the *entire previous state* plus the action and returns only its own new slice:

```js
[stateVar]: reducer(state, action)   // reducer(fullPrevState, action)
```

So `pieceStateReducer` can gate on `state.hasTurnEnded`, and slice order never matters — everyone sees the pre-action snapshot. That last part used to be a lie: `pieces` runs before `pieceState`, and while `piecesReducer` mutated in place, `pieceStateReducer` was reading the already-toggled `selected` flag out of what is nominally the old state. It now derives intent from the pre-action value explicitly (`togglePieceState`). If you find a reducer that seems to need another slice's *new* value, that is the trap — recompute it from the old state instead.

Adding a slice means registering it in both the `reducers` map and `initialState`.

### Accusing and revealing

Both are full screens (`accuseScreen.jsx`, `revealScreen.jsx`) rather than rows of buttons growing out
of the action bar, because both are decisions with a price that the bar had no room to name.

**A wrong accusation costs the right to accuse that alignment again for the whole game.** That is the
entire risk of accusing and it used to be completely invisible: the menu simply closed. Two fields on
`players` exist to make it sayable, both public and both untouched by redaction:

- `exposed: { friend, foe }` — who forced an alignment into the open, if anybody. An alignment goes
  public two ways, its owner paying `REVEAL_COST` or somebody guessing right, and the state used to
  record only that it happened. At a table those are completely different facts, so the ledger now
  reads *revealed* or *accused by SARA*.
- `lastAccusation` on the accuser — what they guessed and whether it landed. Durable rather than local
  to the tab, because online it is the only way the accuser finds out at all: a wrong guess changes
  nothing visible about the accusee. The screen scopes it with local `answered` state, or opening the
  screen again would re-announce the previous verdict.

`accuse` in `py.js` defaults `exposed` before reading it. A room persisted before the field existed
comes back without it, and so does a hand-built test fixture; neither should throw on the first
accusation after a deploy.

### The friend-and-foe screen

`playPhase/alignmentScreen.jsx`. Your own two cards at the size they were dealt at, plus a ledger of
what the rest of the table has revealed — with a **black bar** where an alignment is withheld, because
"there is something here you may not see" is a better thing to show than nothing.

**Online it is always the seat's own pair, never the turn holder's.** The inline reminder this
replaced read `players.find(player => player.turn)`, which on somebody else's turn went looking for
*their* cards. It only looked harmless because the server redacts what it sends, so the fields
arrived `null` and the cards came up blank instead of lying. Hot-seat keeps the turn holder — there is
one screen and the player on turn is sitting at it — and keeps a confirm gate for the same reason.

**It is the one thing in the app allowed to cover the board.** Everywhere else an overlay is
forbidden, because every hexagon is a transparent DOM element and a layer over it eats the clicks.
This earns the exception by being opaque, modal and dismissed by the player. `NEXT TURN` being behind
it is what makes it impossible to hand the turn over with a pair of cards still up — which is why
there is deliberately **no auto-close on a turn change**: that would be unreachable code in hot-seat
and actively wrong online, where somebody else's move can land at any moment and your own cards have
not changed. `friendFoe.test.js` asserts the blocking with `elementFromPoint`.

It also uses `align-items: flex-start` with `margin: auto 0` on its body rather than
`align-items: center`. Centring a flex item taller than its scroll container puts the item's top
above the scrollable area where it cannot be reached, and two full-size cards are taller than the
800×600 the specs are pinned to.

### Turn flow

`pieceState` is a per-piece finite state machine — `SELECTION → DESELECTION | PLACEMENT | MOVEMENT → MOVEMENT2 → MOVEMENT3 → COLLOCATION` — with the exact per-type transitions written out in the header comment of `state/reducers/pieceStateReducer.js`. `undefined` means the piece is still in its HQ. `hasTurnEndedReducer` decides the turn is over from piece type + `pieceState` (a spy gets two moves, three when buffed), which gates the `NEXT TURN` button; while `hasTurnEnded` is true most reducers short-circuit.

`followMouse` distinguishes *aiming* from *moving*. `piecesPrevState` is a snapshot taken on `NEXT_TURN`: the board as **the current turn** found it, which is what every "did this turn change anything" question is asked against (`pz.hasBoardChanged`).

**`snipeWindow` is the shot the table is still owed, and the reason that is a slice of its own.** `domain/snipeWindow.js` has the full argument; the short of it is that a shot outlives the turn it answers — the marks are made during one player's turn and stay readable until the *next* player moves something — so from the moment NEXT TURN is pressed, neither of the two facts a shot needs can be read off the board any more. It holds both: `pieces`, the board the rollback restores (`pz.killSnipedPiece`), and `player`, the one seat the snipe is refused to. Freezing `piecesPrevState` for the rollback instead would have told the player who has just been handed the turn that they had already moved — NEXT TURN would light up for them and putting a sniper back down would spend their turn.

Three rules read the slice, and they are stated once each so they cannot drift:

- `isAnsweringTurnHolder` — whether the shot answers whoever is on turn *now*. Firing spends that player's turn; a shot taken after they passed it on spends nothing. It is also what one `NEXT_TURN` keeps the marks and the window alive through and the next one wipes, so the shot and the marks it is read from cannot survive different lengths of time.
- `getMover` — the seat that may not fire, for `useCanSnipe`, for the server, and for the hot-seat note.
- `pz.isSnipeShot` — the click that fires. The domain takes the shot on it, `hasTurnEndedReducer` decides whose turn it spends, and `server/validate.js` asks it of an incoming action to know which ownership rule to apply.

**The stale marks are wiped in `pz.move`, not on `NEXT_TURN`.** A mark belongs to the move that made it, and moving is what wipes the ones it did not — which is the same rule as "the window closes when the next player moves", stated once. Two other callers re-run that same move to ask what it will leave behind (`hasTurnEndedReducer`, `snipeWindowReducer`), and they have to see the board the game is about to keep.

**A turn ends two ways, and the spy is why there are two.** Every other piece lands, is aimed, and is put down by hand — the drop is what ends the turn. A spy takes its facing from the step it just took, so by the time its last step lands there is nothing a turning step could still decide: `moveSpy` clears `selected` and `hasTurnEndedReducer` ends the turn on `MOVE_PIECE`. Both ask `pz.isSettledByMove(piece, pieceState)`, which is the one place that decides it, so what puts the piece down and what ends the turn cannot disagree.

- **A spy leaving an HQ is not settled**, which is why the predicate asks about the position it came *from*: it lands with no direction of its own, so it goes through `PLACEMENT` and is pointed like everything else. That is the only pieceState at which a spy is still dropped by hand, and `hasPieceEndedTurn`'s `SPY` branch says exactly that.
- **The board still has to have changed.** A spy that walks out and back onto the facing it left with has spent its steps and settled where it started, so the turn does not end — it is simply back on the board with nothing in hand, and can be picked up and walked again. Same rule as the drop path, stated once in `hasBoardChanged`.
- Nothing had to change in `TableBoard`: aiming is offered only while a piece is selected, and a settled spy is not.
- **`pieceState` belongs to whatever is in hand, and a settled spy is what made that matter.** Every ending path used to run through a drop, which left the machine on `DESELECTION` or `COLLOCATION`; nothing resets it on `NEXT_TURN`, so a spy that settles now leaves `MOVEMENT2` sitting there into the next turn. The two guards that stop a spy being put down mid-walk read that state, and read without asking whose it was a *buffed* spy picked up afterwards inherited two steps it had never taken and moved once. Both go through `isSpyMidWalk`, which requires the spy to be the selected piece. If another read of `pieceState` outside a selected piece's own turn ever appears, it has the same trap in it.

**Pointing and putting down are one click, on the cell being pointed at.** `Hexagon`'s `onMouseEnter` aims the piece at whichever cell the pointer crosses, and once `followMouse` is set, a click on a cell is the *drop* (`isTogglePieceOnCellClick`). So the gesture is: cross the cell you want it to face, click there. Every spec in the suite does exactly that — `clickOn.cell(3, 4)` to turn a sniper — and it is the thing to copy.

Going back to click the **piece** also drops it, and quietly re-points it first: the pointer crosses the piece's own hexagon on the way, `cells.getDirection(from, from)` is `[0, 0]`, and `[0, 0]` is a legal facing for most pieces. So the facing just chosen is undone by the very click meant to keep it. Two training exercises were written that way and looked correct on screen — the token visibly turns during the hover — while committing the old bearing.

### Mechanics vocabulary

- **buffed** — adjacent to its own CEO; recomputed for every piece on `NEXT_TURN` via `pz.setCeoBuffs`. Buffed agents move differently, buffed spies get a third move, buffed snipers see through pieces.
- **throughSniperLineOf** — ids of enemy snipers whose line of sight a piece crossed while moving. `SNIPE` highlights snipers that have a target; clicking a highlighted sniper kills what it saw. A whole path is checked rather than its endpoints, so a sniper whose line the path ran *along* is named once per cell: the marks are a set, not a tally.
  - **A sniper can be killed by the very move it saw** — the mover walks its line and ends the walk on its cell — and the shot is still owed. It lights up like any other with no token on the board to click, so the cell it stood in answers for it: `pz.getFallenSnipers` reads that cell off `snipeWindow.pieces`, `useCellAction` fires on a click there before it asks `useCanAct`, and the cell wears a ring, a label and an arrow while the snipe is armed. Firing rolls the board back like any other shot, which brings the sniper back to life and kills what killed it. `killSnipedPiece` used to keep a lit sniper as it stood and merely un-highlight it, which is the same piece in every case but that one — so the shot that answered its own death left it in the cemetery.
  - **The mark is drawn from two places, because the board is drawn two ways.** Flat, `FallenSniper` is a child of the hexagon it marks. Projected, a hexagon is an `opacity: 0` hit target and takes anything inside it down with it, so `TableBoard` lays the mark on the board at the box the renderer gave that cell. `pointer-events: none` on both, for the reason the training coach marks have it: the cell underneath *is* the control.
- **claim control** — `teamControl[team]` = `{ player, prevPlayer, claimEnabled, controlling }`. Claiming toggles that team's CEO as selected; control becomes real (`controlling`) when the CEO is deployed, or immediately when an alignment is revealed. A player can hold only one team at a time.
  - **Claiming a team IS deploying its CEO, so a team whose CEO is already on the board cannot be claimed by anybody — its holder included.** That rule is `pz.canClaimControl`, and it exists as one predicate because the two halves of `CLAIM_CONTROL` used to disagree: `teams.claimControl` refused while `pz.claimControl` selected the CEO regardless, so on somebody else's turn the claim line of a team they controlled handed you their CEO to move. `claimEnabled` is that same predicate stored, and every writer now derives it — `mapDeployedCeo` used to carry it through unchanged, which is what left the control offering a claim the rules refuse. Covered in `unit/gameCore.test.js` and, from the outside, in `claimControl.test.js`.
  - A team taken by a **reveal** stays claimable, and that is the trade a reveal makes: it is yours at once, and anybody can take it back by deploying the CEO you never had to. It is the one state where an HQ names a holder and still offers `CLAIM` beside it.
- **the walk ahead** — a spy moves a cell at a time and then has to move again, so the board says where the *rest* of the walk could land: `pz.getPreviewPositions` returns a level per move away, and each has a colour of its own — teal for the second step, gold for the third a buff adds (`PREVIEW_STEPS` in `three/palette.js`, which both renderers read). A buffed spy fills two levels, and the last move fills none.
  - **A colour per step rather than one red turned down twice**, because which move a cell belongs to is a fact about the walk and not a degree of anything: three shades of one hue read as one thing seen through fog, and telling the second ring from the third then depends on having them side by side. Red is deliberately not in the table — it means *now*, and only now. Each step keeps a `fade` as well, so the current move still wins the eye when all three are on the board at once. In 3D the keyline is excluded from the recolouring (`signal` on the ring): it is the dark shoulder that makes any of these hues legible on the palest tile and the darkest alike.
  - **It is not `getHighlightedPositions` and must not become it.** The server re-derives legality from that list, so putting a cell two moves out in it would make a two-cell jump legal. The levels come back **disjoint and nearest-first**: a cell reachable both now and later is a legal destination, in full red, and never a preview. Only the ring fades in 3D — the tile does not rise, because standing up out of the tray is what "you may go here *now*" means.
  - The walk is simulated by stepping the spy through `getSpyPositions` itself rather than by a second reading of the rules, and the states it walks come from `getMovedSpyState`. Which is why the preview knows the things the rules know: it stops at a piece it cannot pass, it will not stand on a friendly, and the last step of the walk may take an enemy — so a blocked cell shows up one level further out rather than not at all.
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
- **So the board's recess is painted by the renderer, not by CSS.** A view may declare a `well()` — a colour and an alpha — and `stage.js` clears *that view's own element box* with it before the scene draws, which puts the surface exactly where a CSS background would have gone and behind the tiles instead of in front of them. Three things about it are deliberate: it is the **element's** box and not the scissor (the scissor is clipped to what the scene paints into, and opens up to the whole of `.game` while a piece is in the air — the recess is the section, so it is neither); it is a **clear** rather than a quad, so it costs a memset and composites over the page exactly as a background would, alpha included, which is how Blueprint's drawing grid ghosts through its own board; and the clear colour is **put back to `BACKDROP` afterwards**, because the full-canvas clear at the top of the next frame reads it and would otherwise paint the whole viewport. The colours live in `SKIN_PLINTH` next to the plinth, with `--ha-well` carrying the same value for the flat path, where there is no canvas to be in front of. `skin.test.js` asserts both halves: a 1px frame in every direction, no background at all in 3D, and a real one under `?flat`.
- **Overlay hex boxes are a column pitch wide and a row pitch tall**, which tiles the plane exactly — no gaps, no overlaps. Their own bounding boxes would overlap adjacent rows by a quarter of their height, and which of two invisible boxes a click landed on would come down to DOM order.
- The board's height comes from a `::before` spacer on `TableBoardStyled` in 3D mode, because its rows no longer have any. It only bites in the stacked phone layout; everywhere else `Board` has a height and the board is a stretched flex item. Do not turn it into a real height: the landscape phone layout has **zero** slack before the action bar falls off the bottom.
- Rendering is fill-bound, not draw-call-bound. Two things measured: turning multisampling off when the renderer is software (a quarter off the suite's wall clock), and scissoring each view down to the rectangle its scene actually paints into, `projector.extent()` (another third off a click). Repainting views individually rather than all together was tried, saved nothing, and left trays blank.
- **The context is created with the attributes it is meant to have, once.** A second `getContext` on a canvas returns the first context and silently discards the attributes — so the software-renderer probe lives on a throwaway canvas in `support.js`. Probing the real one is how this ran 4× multisampling on a CPU rasteriser for a while whilst the code said it did not.
- Nothing moves at rest: the loop drops to ten polls a second when no view is animating and nothing has asked to be drawn, and stops entirely when the last view goes. `prefers-reduced-motion` removes the travel, the lift and the sniper's pulse, because continuous motion is something this layer introduced and the flat renderer never had.
- The HQ store takes everything its card has left, and that is roughly twice what it had: **who holds a team and the control that claims it are one line at the foot of the card now, rather than a full-width button across the top of the rack**, and what reserved that button's room was 53px of margin on the store (26px on a phone). A socket projects from the store's box, so the box is how big a target a thumb has — which is why the tray gets the space rather than a smaller one being centred in it. On a phone held sideways it went from about 34px tall to roughly 60, and a socket from 13×8 pixels to something a thumb can mean. The line's own height is fixed and identical in all three directions for the same reason.

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
