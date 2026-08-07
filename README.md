# Hidden Agenda
An abstract board game with psychology

* **Play over the internet:** https://hidden-agenda.azyr.io — make a room, share the code, one seat per player.
  This is what the front door offers: the game is people in different places holding cards nobody else
  can see.
* **Play hot-seat:** https://fedeiii.github.io/hidden-agenda/?hotseat — everyone round one screen. Also
  an option in the lobby, on either site. The Pages build has no server behind it, which is why that
  link says so up front.

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

The client takes four URL handles: `?hotseat` plays in one tab instead of asking for a room (the index
is the lobby), and three that are local-only — `?flat` turns the 3D renderer off, `?test=play`
or `?test=endgame` drops you into a mid-game state, and `?skin=dossier|blueprint|vault` pins the
visual direction instead of letting the game draw one. `HA_SKIN` does the same for every room the
server makes.

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

* **GitHub Pages** serves `docs/` from `master` — hot-seat only, no server, which is why the link at the
  top of this file carries `?hotseat`. Without it the index offers a room and nothing answers; the lobby
  says so and offers the one-tab table beside it, but the link should not need the detour.
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
### v3.11.0
* **A spy shows the whole walk, not just its next step.** It moves a cell at a time and then has to
  move again, and the board only ever marked the step in hand — so the player was holding the rest of
  it in their head, which is a lot to ask of the one piece that can end up almost anywhere. Each move
  is marked in a colour of its own now: **red** where it can go this step, **teal** where the second
  could take it, and **gold** for the third a CEO buff adds. A colour per step rather than one red
  fading out, so which move a cell belongs to can be read off that cell alone. A cell it could reach
  both now and later is a legal cell first, in red, so nothing that can be clicked has been made to
  look like something that cannot
* None of it is a legal move and none of it can be clicked: the preview is its own list, and the
  server still re-derives legality from the cells the current move may actually reach
* **A spy has no turning step any more.** Its facing has always come from the step it just took, so
  by the time the last one landed the board was asking for a decision that had already been made —
  point it where it is already pointing, then put it down. It settles where it lands now, facing the
  way it walked, and the turn is over. Coming out of an HQ is unchanged: it arrives with no facing
  of its own, so it is still pointed and put down by hand
  * Which took a bug with it on the way in: settling ends the turn without the drop that used to
    reset the piece state machine, so one spy's walk was left lying around for the next one to pick
    up — and a buffed spy that picked it up thought it had already taken two of its three steps, and
    moved once. That state belongs to whatever is in hand, and between turns nothing is
* **How to Play's Spy and CEO Buffs photographs were taken again**, so the pages show what the board
  actually looks like: two rings on the Spy's own page, three on the buffed one
* **How to Play turns its pages from either end now.** *Main Menu* and *Index* stay at the top, where
  leaving the book belongs, and the previous/next pair sits both above the text and below it — so on
  a phone, where a page is a long read, the way on is wherever you happen to be rather than only at
  the bottom. Turning a page starts the next one at the top, which it did not: every screen here is
  the same component with different props, so nothing was moving the scroll, and turning the page
  from the foot of one dropped you that far down the next
* **A photograph's caption no longer prints over the photograph.** It sat in a fixed strip at the
  foot of the mat, so a caption long enough to wrap to a fourth line — which is most of them on a
  phone — grew up over the picture instead of down
* **A rule page starts near the top of the screen.** The header, the way out, the page title and the
  pager stacked four deep and took 210px of a 700px phone before the first word — a third of the
  screen, on the device with the least of it. The title and the page-turn pair share one line now,
  as a running head with a ‹ and a › either side of the title, and the frame around the whole lobby
  is tighter on a narrow screen. Down to 131px, and the foot of the page still names both
  destinations in full

### v3.10.2
* **Every door on the How to Play index is the same size now.** The cards were laid out as a grid,
  which hands each row entirely to whatever is in it — so *Winning*'s two doors came out nearly three
  times the width of *The Pieces*' five, and the same kind of thing read as two different offers. A
  card takes its share of the row but stops a little over its own minimum instead, so every group
  widens together and a short one centres its cards rather than inflating them to fill
* **The favicon carries its own manila ground** instead of being drawn on transparency

### v3.10.1
A handful of fixes to the rules pages shipped in v3.10.0.

* **The CEO Buff badge was clipped by its own note.** \`overflow: hidden\` (added to stop a note's
  background painting across a floated image) was also a clipping box, and the badge deliberately
  pokes above the note's own top edge. \`display: flow-root\` gives the same float-avoidance without
  clipping anything, and the note and the exhibit now carry explicit \`z-index\`s so a photograph
  wins if the two ever get close enough to touch
* **The Killing page's photo cropped out the point of it** — the cemetery tally is at the foot of
  the HQ card, below where the crop ended. It shows the whole card now
* **Taking Control of a Team's two ways to take control are two exhibits now**, side by side in one
  row on a wide screen and stacked on a narrow one, rather than five photographs in a single strip
* **"Back" is "Main Menu"** on the rules pages, and goes straight there regardless of how many pages
  deep the reader has clicked — Index is already the one-step-back door

### v3.10.0
How to Play is a real menu item now, not a markdown file a player was unlikely to open mid-game. Twenty
pages plus a cheat sheet, grouped by topic, in the Dossier voice rather than the developer notes' —
told the same way the game itself talks to a player.

* **The screenshots are an actual game**, not diagrams — a real hot-seat session, cropped tight to
  just the play being illustrated, click-to-fullscreen since a crop this small is exactly the thing
  worth seeing at full size
* **Piece pages show the move and the kill side by side**, and the CEO, Sniper and Taking Control
  pages show the *effect* of what they describe — a buffed agent with both its cells lit, a sniper's
  line running dark through the board and stopping at whatever blocks it (or not, once buffed), a
  four-beat sniper kill from before the crossing to the board after
* **A cheat sheet page** — every rule as bullets, sized to fit one screen with no scrolling on a
  desktop, one door away from the index
* **"How to Play" is its own case-file tab in the main menu**, apart from Start/Join/Hot-seat, because
  learning the game is a different kind of choice than picking one of those
* Fixed a note's own highlighted background painting straight across a floated image next to it —
  it narrows to sit beside one now, the way a paragraph already did, rather than either overlapping
  it or dropping below regardless of the room available
* The Turnstile bot check is a fixed strip at the foot of the screen now, rather than sitting inline
  in the name form

### v3.9.0
The lobby is a menu now rather than everything on one screen: your name, the bot check, a resume
list when you have one, and three doors — start a game, join one, or hot-seat instead. Each door is
its own page, carrying what used to sit in one long column.

* **Both doors are real paths, `#/start` and `#/join`**, not only React state — so the browser's own
  back button leaves a submenu the way it leaves anything else
* **A link straight into either one still works.** A bookmark or a shared URL with no earlier page
  in this tab's history gets one synthesised underneath it, so the first press of back reaches the
  menu instead of leaving the app
* **Escape is the keyboard's own back**, doing the exact same thing the button and the browser's
  back both do, rather than a lookalike of it — and it is a no-op on the main menu, which has
  nowhere within this screen to leave

### v3.8.0
Creating or joining an online room now passes a Cloudflare Turnstile check first — a bot filter with
no puzzle to solve for a real visitor, sitting in front of the lobby's `create`/`join`/automatch
rather than in front of the game itself.

* **Best-effort, the same shape as persistence and ratings.** With no secret configured — a laptop
  with no `.env`, or the test server, which deliberately runs one — the check disables itself and
  says so in the log, rather than refusing every request a client cannot possibly satisfy
* **The server decides, not the client.** A new frame tells every socket whether the check is
  actually active before it has asked for anything, so the widget only ever appears when something
  is really going to check it — and the browser suite needed no changes at all
* **A token is single-use.** Any refusal on the lobby screen resets the widget, because reaching the
  server already spent the solve whether what came back was `bad_turnstile` or something else
* **Reclaiming a seat you already hold asks nothing.** Same reasoning as the cooldown it already
  skips: a refresh is not a new arrival

### v3.7.0
The game has a mark: a seal cut from the board's own pointy-top hexagon, with the name inked into a
plain logotype beside it.

* **The lobby title carries it**, next to the typed "Hidden Agenda" it always said — the lobby is always
  Dossier regardless of what skin a game later draws, so the mark is a literal Dossier red rather than a
  token
* **The browser tab and the home-screen icon carry it too**: an SVG favicon, PNG fallbacks at 16 and 32
  px, and a full-bleed apple-touch-icon, all in `public/` so the build copies them for both origins the
  same way it always has
* **A shared link unfurls into a card now** — `og-image.png`, the seal and the logotype on the same
  manila the game itself opens on, with Open Graph and Twitter Card tags pointing at it

### v3.6.0
Players have ratings, and there is a queue that uses them.

* **Every browser is rated, and nobody registers for anything.** Your browser mints an id for itself the
  first time it needs one and the server keeps a rating against it — so a game leaves a trace without
  there being an account, a password or a database to lose
  * The rating belongs to the *browser*, not to you: clearing your storage starts again, and your phone
    and your laptop are two players. That is the price of not asking anybody to sign up, and it is worth
    being straight about rather than pretending otherwise
  * A browser with storage switched off plays unrated, and the rest of the table is rated amongst
    themselves. Nobody is turned away for it
* **It is not Elo.** A game here is two to six players with a full ordering, which Elo has no way to
  express, and the friend-and-foe deal puts real luck into every result — so the model carries an
  explicit *uncertainty* about each player and reacts to it, converging quickly while it knows nothing
  about you and slowly once it does
  * You start on exactly **1000**, and the number shown is deliberately conservative — it rises through
    your first games even on ordinary results, as the game gets less unsure of you
  * One table's five pairwise results are not five independent readings, because everybody played the
    same board off the same deal. The noise term is set to say so: a first six-player win is worth
    1000 → 1510 rather than 1000 → 1877, and thirty wins still reach 2313
* **A rating is a *derived* number, and the games are what is stored.** Every finished game and every
  walk-out is one line appended to a log, and the ratings are folded out of it on the way up. So the
  formula can be retuned and the whole history replayed through it, instead of everybody's rating being
  thrown away to change how it works
* **Walking out of a game in progress costs you.** A full loss against everybody who was still at the
  table, and if you were the last two, the player you left behind takes a partial win — the game was
  taken away from them rather than lost
  * Closing the laptop and pressing LEAVE cost the same. A game nobody comes back to is charged to
    everybody who had gone when the server gives up on it
  * Doing it repeatedly costs a wait before your next game: thirty seconds, doubling each time, capped
    at an hour and coming back down a level a day. Refreshing is never blocked by it — that is getting
    back into a game you are already in
* **Playing the same person over and over counts for less each time**, smoothly rather than being cut
  off: the fifth game against your regular opponent still counts, the fiftieth barely does. It is also
  what stops two browsers alone in a room from feeding each other wins
* **Automatch.** *Find me a game* puts you in a queue and the server picks the table — widening what it
  will accept the longer you wait, and holding out about fifteen seconds for a fourth player before
  settling for two. A match makes an ordinary private room and the host still presses START: what this
  replaces is finding a table, not playing at one
* **The numbers are on screen where they matter**: beside every name in the waiting room, averaged on
  every row of the room finder so you can see what you would be walking into, and on the score sheet at
  the end of a game next to what it did to you

### v3.5.0
* **Everybody's score is on the table while the game is still going.** The friend-and-foe screen's
  ledger now says what each player is on: a hundred to start with, fifty once one of their alignments
  has gone public, nothing at all when both have
  * Only the baseline, and that is the honest half rather than a simplification. The rest of a score is
    the friend team's points less the foe team's, which needs a pair of cards this game spends its whole
    length hiding — so it cannot be shown for anybody but yourself. What is left is public for the whole
    table, and it is the half a player can do something about
  * Both routes count, because both cost the same fifty. Paying to reveal and being guessed correctly
    set the one field; the row beside the number still says which of the two it was, and guessing right
    costs the accuser nothing
  * One function — `py.getBaseScore`, which the final score sheet now starts from as well, so the number
    a player is shown mid-game and the total it turns into cannot drift apart

### v3.4.1
* **Your name is remembered.** The lobby asks on the way into every room — after a game, after leaving
  one, after a refresh at the front door — so the field opens filled in with whatever you last played
  under. The one the server seated you as, not one it refused as already taken
* **Leaving works when there is nothing to leave through.** It was a request to the server, so with no
  open socket the button did nothing at all — and the two moments a player most wants out are exactly
  the ones with no socket: a connection that has dropped, and a seat a second window has taken. It
  tells the server if it can and takes you back to the index either way

### v3.4.0
Rooms have names, you can go looking for one, and you can walk away from one.

* **Every room is named**, and the field opens on a draw from two lists of themed words — `secret-agent`,
  `cunning-traitor`, `unlucky-quartermaster` — so a name is mandatory without a host having to think of
  one. The code is still what you type; the name is what the table calls itself
* **Public by default, and public rooms are listed on the index.** Search by name, and a space matches a
  hyphen, so typing what somebody read out to you works. Each row says what the room is called, who
  opened it, how full it is and whether it has started
* **Private is one thing only: not in the list.** The code still joins it, so a shared link to a private
  table works exactly as it did
* **Started rooms sort to the end and stay there**, because they are no use to a stranger and are exactly
  what somebody coming back to their own game is looking for. Selecting one you have a seat in puts you
  back in that seat rather than refusing you as a latecomer
* **Coming back to the front door offers your seat.** A refresh already kept the room in the URL;
  arriving on the plain address — a bookmark, a new tab — did not, and the game you were in the middle of
  was invisible from the one screen that could have taken you back to it
* **A second window no longer fights the first for a seat.** Whichever asked most recently holds it, and
  the other says so instead of going quietly dead
* **You can leave.** From the waiting room, from the friend-and-foe screen, from the board and from the
  score table — and the seat count everybody else is looking at goes down as you go
* **Leaving the board asks first**, because a started room takes no new seats and there is no way back
  in. Leaving a waiting room does not: the room is still there and its code still joins it
* **A game needs two, so leaving one that would strand somebody takes them with you** and says as much
  before you do it. The player left behind is told the game ended rather than being dropped back at the
  front door wondering what happened
* **A player leaving a three-hander is just a shorter table.** The turn passes on if it was theirs,
  whatever team they held goes back to being nobody's, and nothing on the board moves — pieces belong to
  teams here, not to people

### v3.3.0
The front door is a room.

* **The index is the online lobby.** This game is people in different places holding cards nobody else
  can see, so that is what it offers first: a name, a room, a code to share
* **Hot-seat is an option on it**, and `?hotseat` in the URL — which the switch writes back, so a reload
  keeps you where you were rather than dropping you on the default. The
  [Pages link](https://fedeiii.github.io/hidden-agenda/?hotseat) carries it, because that build has no
  server behind it
* **A build with nothing behind `/ws` says so.** Pressing NEW ROOM where no server answers now explains
  itself and points at the table that needs none, instead of retrying in silence
* **The lobby no longer claims to be connecting** before it has opened a socket — it said so twice, in a
  notice and a banner, on a screen where nothing was in flight. That screen is the first thing anybody
  reads now
* **Documentation**: `MULTIPLAYER-PLAN.md` is gone. Every phase of it shipped, so it had become a file
  that said "done" six times; what is still true lives in `CLAUDE.md` and `deploy/README.md`, and the
  two open items it was holding — the box's EOL Node 18, and a Cloudflare token to rotate — moved to the
  runbook with the rest of the box

### v3.2.0
The interface has three faces.

* **Three visual directions**, each committed to its own material world rather than being a palette
  swap of the others
  * **Dossier** — the file room. Manila card, typewriter, rubber stamps that sit slightly crooked and
    press when you push them, and the board sunk into a dark blotter well
  * **Blueprint** — industrial secrets, taken literally: cyanotype ground with the drawing grid on
    it, chalk line work, ferro red for anything armed, and controls whose corner is cut rather than
    rounded
  * **Vault** — the attaché case. Milled gunmetal, oxblood and brass, bevelled switches that sink
    when pressed, knurling along the foot of a panel, and the deepest board recess of the three
* **The main menu is always Dossier.** A game starts as a form on a desk and only gets a look of its
  own once the table sits down to its cards
* **Hot-seat draws its skin on the way in to friend & foe** and keeps it for the rest of the evening.
  Dossier is in the draw, so staying is a real outcome rather than a missed one
* **Online, the room owns its skin.** Whoever opens the room draws it, the server keeps it beside the
  phase, and it goes out in the same frame as the seat list — so the waiting room already looks like
  the game will, on every screen, without the clients negotiating anything
* **The alignment cards now carry two facts on two channels.** Green and red still say friend or foe;
  which team is a separate mark in that team's own colour, placed where each direction's material
  would put it — an index tab on the Dossier copy, a hatched finish callout on the Blueprint sheet, an
  anodised plate in a brass bezel in the Vault. Both codings survive; they stop sharing one mark
* **The host can overrule the draw** — in the waiting room and on the friend-and-foe screen, and
  nowhere else. Changing it re-dresses every screen in the room at once; once the board is up the
  furniture stops moving, because a player mid-turn is holding a model of four teams and somebody
  else's face. Hot-seat has no host, so the control is simply there while the table looks at its cards
* The detail each direction was proposed with, now actually there: a routing slip with initials
  boxes, file tabs and rubber stamps in Dossier; a ruled title block, board coordinates, a dimension
  line and a do-not-reproduce watermark in Blueprint; embossed tape, tamper tape across a claimed
  tray and brass switches in Vault
* **The turn strip says how many CEOs are down.** The game ends at three and nothing on screen had
  ever mentioned it
* **The cards say "Friend" and "Foe" in words**, at the deal and in the game. Green and red had been
  carrying that alone, which is a lot to ask of two hues being read across a table
  * And each direction says it in its own material: typed in the corner of the flimsy and ruled
    underneath in Dossier, reversed out of a filled tab and numbered `FIG. 1` / `FIG. 2` in Blueprint,
    on a small bevelled tag in Vault
* **A card says what the alignment is worth** — *their points are yours*, *their points come off
  yours*. That is the whole of what friend and foe mean and the one thing about them no colour can say
* **And it names the team twice, in two channels**: over a block of the team's own colour, and as the
  colour itself called out the way each direction calls out a material — a colour of record glued to
  the file, a half-hatched finish reference on the drawing, an anodised jewel in the case
* **Accusing and revealing are screens that explain themselves.** A wrong accusation costs the right
  to accuse that alignment for the rest of the game — the entire risk of the move, and previously
  invisible: the menu just closed. Now each step says what is already public about the player you are
  about to accuse, and the result says whether you were right, what it cost, and who it cost
* **The table's ledger says how each alignment became public** — paid for, or taken, and by whom
* **Fixed: a team you controlled could be taken out from under you.** Claiming a team is deploying its
  CEO, so a team whose CEO is already on the board cannot be claimed — but only half of the action knew
  that. The claim was refused while that CEO was selected anyway, so on the next player's turn they
  could pick up your CEO and move it. Both halves ask the same rule now, and the control says so by
  being disabled rather than by accepting a click and quietly doing something else
* **Claiming a team is a control on that same line** — a rubber stamp on the file, a drafted rectangle
  on the drawing, a brass switch in the case — offered only where there is something to claim. The
  full-width button that used to sit across the top of every rack is gone, and **the tray is about twice
  as tall for it**: on a phone held sideways a socket went from thirteen pixels across to something a
  thumb can mean
* **The board sits in a recess of its own**, framed with a hairline and darker than the ground, so the
  table is a section of the page rather than a shape floating on it
* **FRIEND & FOE is a full screen now**, showing your two cards at the size they were dealt at, and a
  ledger of what the rest of the table has revealed — with a black bar where an alignment is withheld.
  Online it always shows *your* pair; it used to go looking for the turn holder's, which only looked
  harmless because the server had already redacted it away
* `?skin=dossier|blueprint|vault` pins the look in a local game, the way `?flat` pins the renderer

Under it, and deliberately: a skin is custom properties on `<html>`, not a theme threaded through
styled-components, so switching one is a single attribute write and not a second and third CSS class
for every component in the app. A skin may change colour, type, a border's colour and ornament — and
may not change a border's *width* or anything else with a length, because the invisible boxes a click
lands on are projected from the board's own size. The feedback colours are untouched in all three:
red still means *you may go there*.

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
  * **Dragging carries the piece.** The actual token comes out of its tray, rides under the cursor
    across the table and settles onto the cell it is dropped on — no dragged image anywhere. Which
    piece was pressed and whether the move is legal are still decided exactly where they were
  * **Pieces travel.** Deploying by clicking sends the piece arcing out of its HQ to the cell, and
    so does a drop; height comes from the distance left, so a long deploy lofts and a one-cell move
    barely leaves the board
  * No WebGL, or a lost context, and the original flat board comes straight back. `?flat` forces it
* **Fixed** — a snipe that was lined up could not be put away again, and since a piece cannot be
  picked up while one is armed and the turn cannot be passed either, a player who thought better of
  the shot left the game with nothing anybody could do. SNIPE! is a toggle now, and says so
* **Fixed** — a piece picked up out of an HQ vanished for as long as the cursor was over that HQ, and
  came back sliced in half at the board's left edge. Opening the scissor is not enough to draw
  outside a view: the viewport clips a shape to itself whatever the scissor allows, so the board now
  widens both and re-frames its projection by exactly the amount that leaves every hexagon where it
  already was
* **Fixed** — the whole board was being rendered at about half the colour it was painted in. The
  lights were summing to half of what a colour needs to render as itself, and metalness compounded
  it: with no environment map to reflect there is nothing to gain from it, only diffuse to lose. A
  token now reads as its own artwork and an HQ rack as its own team colour
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
  * `CLAUDE.md` and `deploy/README.md` describe what is there now
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
* ~~UI revamp~~
* 3D
* ~~Remote multiplayer~~
* ~~Room finder~~
* ~~Leaving a game~~
* Port to electron

## Known Bugs
* ~~LEAVE did nothing at all when the connection was down or a second window had taken the seat~~
* ~~A refresh mid-game looked like it worked and then swallowed every move afterwards: two sockets held
  the one seat and took it off each other, so actions went out on whichever had just lost it~~
* ~~A player who reloaded was marked offline by the connection they had just replaced~~
* ~~The lobby said it was connecting before it had opened a socket at all~~
* ~~A team you controlled could be claimed out from under you, which handed its CEO to whoever clicked~~
* ~~The interface said nothing about the game it was wrapped around~~
* ~~A piece dragged out of an HQ was invisible over that HQ, and cut in half at the board's edge~~
* ~~Pieces and HQ racks rendered at about half the colour they were painted in~~
* ~~A snipe that was lined up and then declined deadlocked the game~~
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
