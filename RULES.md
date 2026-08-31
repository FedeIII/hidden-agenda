# Hidden Agenda — Rules

Derived from the implementation, not from a designer's notes: everything below was read out of
`src/domain/`, `src/game/` and `server/`, and the non-obvious parts were confirmed by running the
domain code. Where the code does something a player would not guess, it is written down here as it
behaves, and the ones that look accidental are collected in [Appendix B](#appendix-b--edge-cases-and-quirks).

Source of truth per section is noted like `pz.js#getAgentPositions` so a rule and its code stay
findable from each other.

---

## 1. What the game is

Four corporations — **black, red, white and yellow** — fight on a hex board. Two to six players
command them, but **no player owns a corporation**. On your turn you may move *any* piece of *any*
team.

What you own instead is a secret pair of cards: one **friend** team, whose success scores for you,
and one **foe** team, whose success scores against you. Everybody is pushing everybody's pieces
around, and the whole game is reading which pushes were sincere.

---

## 2. Components

### The board

Seven rows of hexagons, `4 · 5 · 6 · 7 · 6 · 5 · 4` — **37 cells** (`cells.js#CELLS_BY_ROW`).

```
      0,0  0,1  0,2  0,3
    1,0  1,1  1,2  1,3  1,4
  2,0  2,1  2,2  2,3  2,4  2,5
3,0  3,1  3,2  3,3  3,4  3,5  3,6
  4,0  4,1  4,2  4,3  4,4  4,5
    5,0  5,1  5,2  5,3  5,4
      6,0  6,1  6,2  6,3
```

A position is `[row, cell]`. Row 3 is the middle row and is the widest; rows widen towards it and
narrow away from it, which is why a direction does not translate into the same column shift
everywhere (see [Appendix A](#appendix-a--directions-and-geometry)).

There is no board edge to fall off during play: a piece may be *pointed* outwards, and a move that
would carry it off the board is handled by an explicit rule (§6.1).

### The teams

| Index | Colour | Name |
| --- | --- | --- |
| `0` | black | BLACK |
| `1` | red | RED |
| `2` | white | WHITE |
| `3` | yellow | YELLOW |

All four teams are in play in every game, whatever the number of players.

### The pieces

Each team has **8 pieces** — 32 on the table:

| Piece | Code | Per team | Value |
| --- | --- | --- | --- |
| Agent | `A1`–`A5` | 5 | 5 pts |
| CEO | `C` | 1 | 20 pts |
| Spy | `S` | 1 | 10 pts |
| Sniper | `N` | 1 | 10 pts |

A piece id is `team-TYPE[number]`: `0-A1` is black's first agent, `3-N` is yellow's sniper
(`pz.js#getTeam/getType/getNumber`). A team is therefore worth **65 points** of its own material
(`constants.js#POINTS_PER_PIECE_TYPE`).

Every piece starts in its team's **HQ** (the store beside the board), off the table.

### Facing

Every deployed piece faces one of six directions. Facing is not decoration: it decides where agents
and spies may move, what they may kill, and what a sniper can see.

### The alignment cards

Two decks — a **friend** deck and a **foe** deck — of eight cards each: two per team
(`deal.js`). Each player is dealt one card from each. The two are never the same team.

Cards are secret. Two players can share the same friend; one player's friend is often another's
foe; a team may be nobody's friend at all.

---

## 3. Setup

1. Choose **2 to 6 players** (`py.js#MIN_PLAYERS/MAX_PLAYERS`) and enter their names. Seating order
   is turn order.
2. Each player is dealt a friend card and a foe card, looked at privately, and put face down.
3. All 32 pieces start in their HQs. Nothing is on the board.
4. The first player named takes the first turn.

Hot-seat, the alignment phase passes the screen round one player at a time. Online, the server deals
and each client only ever receives its own pair — nobody else's card is even transmitted
(`server/redact.js`).

---

## 4. The turn

On your turn you take **exactly one piece action**, plus as many free actions as you like:

| Action | Cost | Limit |
| --- | --- | --- |
| Activate a piece (deploy, move, or turn a sniper) | **the turn** | exactly one, and it is compulsory |
| Claim control of a team, or cancel a claim | free | any number, before your piece action ends |
| Reveal one of your own cards | free | twice per game (one per card) |
| Accuse another player | free | until you get one wrong |

Then press **NEXT TURN** and play passes to the next player in seating order, cyclically
(`py.js#nextTurn`).

**One button on that screen is not yours.** `SNIPE!` belongs to every player *except* the one whose
move it answers — it is how the rest of the table answers the move that has just been made, and it
can be pressed at any point during somebody else's turn, and for a little while after it. See §9.

Two consequences worth stating plainly:

- **You cannot pass.** `NEXT TURN` only lights up once a piece has completed an activation
  (`hasTurnEndedReducer.js`). If every piece you would like to move is stuck, you must find one that
  is not.
- **Any team's piece.** Ownership is not per-piece. The only restriction is team control (§10), and
  it only covers pieces still sitting in an HQ.

Once your piece action is finished, the board is frozen for you: no more moving, no more claiming.
Revealing and accusing are still live, and so is everybody else's chance to shoot at what you just
did.

---

## 5. Activating a piece

Every piece follows the same four-beat sequence. It is the same whether you click or drag
(`useCellAction.js`, `drag/index.jsx`).

1. **Select** — click the piece, or begin dragging it. Its legal destinations light up.
2. **Move or deploy** — click (or drop on) a highlighted cell. A spy repeats this beat two or three
   times.
3. **Point** — with no destinations left, the piece aims at whatever cell you hover: it turns to face
   the direction that cell lies in, if that direction is one it is allowed to take
   (`tableBoard.jsx`, `hexagon/index.jsx`). Pointing at a distant cell works; only the direction
   matters, not the distance.
4. **Confirm** — click. The facing is committed and your turn action is spent.

Rules that fall out of that sequence:

- **You must move before you can turn.** Aiming is only offered once the selected piece has no legal
  destination left, which for a moving piece means after it has moved. A sniper never has a
  destination, so it can aim immediately — that *is* its move.
- **Facing is a preview until you confirm.** Hovering changes what the piece shows, but the committed
  direction is only written when you put the piece down (`pz.js#toggledPiece`).
- **Selecting is free; confirming is not.** Clicking a piece and then clicking it again puts it back
  without spending the turn. One exception: a spy can no longer be deselected once it has taken its
  first step (`pz.js#hasToToggle`).
- **Nothing spends the turn unless it changes the board.** What is confirmed is measured against the
  board as the turn began, and an activation that leaves every piece where it stood, facing the way
  it faced, is not one (`pz.js#hasBoardChanged`). Picking up a deployed sniper and putting it down
  again costs nothing, and neither does sweeping it round and back onto the heading it already had.
  Nor does walking a spy off its cell and back onto it if it arrives on the facing it left with — the
  turn is still there to spend.
- **A piece that cannot move can still be put back.** Selecting a blocked agent and clicking away
  simply deselects it — no turn spent.

---

## 6. Deployment

Any piece may be brought out of its HQ instead of moving one already on the board. Deploying uses the
whole turn — a spy deployed this turn does not also get its steps.

A piece may be deployed to any cell that is:

- **empty**, and
- **not inside an enemy sniper's line of fire** (§9).

(`pz.js#getInitialLocationCells`.) Your own snipers' lines do not restrict you; only enemy ones do.

The sniper carries one extra restriction — see §6.4.

A freshly deployed piece may then be pointed in **any** of the six directions, including outwards off
the board edge.

---

## 6.1 Agent (5 per team)

**Move:** exactly **two cells straight ahead**, in the direction it faces.

- Blocked if **any** piece — friend or enemy — stands **one cell ahead**.
- Blocked if a **friendly** piece stands two cells ahead.
- **Kills** by landing on an **enemy** two cells ahead.

**Turn:** after moving, it may turn to its current facing or **one step to either side** — the three
front directions, never backwards (`pz.js#getThreeFrontDirections`). Before moving it cannot turn at
all.

**Walking off the board:** if the cell two ahead is off the board, the agent leaves the table and is
**redeployed** — you place it on any legal free cell, and it may then face any direction. It is the
same board-wide choice as a fresh deployment, minus the cell it came from
(`pz.js#getRegularAgentPositions`). This also applies when the agent is facing straight out and even
the first cell ahead is off the board.

**Buffed** (adjacent to its own CEO, §8): it may move **one or two** cells ahead, and may kill an
enemy **one** cell ahead. A friendly one cell ahead still blocks it completely.

## 6.2 CEO (1 per team)

**Move:** any distance in a straight line, in **any of the six directions** — as far as the board or
the first piece allows.

- **Blocked by any piece**, and it **cannot kill**. It stops on the cell before an occupant, whatever
  team that occupant is (`pz.js#getCeoPositions`, `getFreeCells`).

**Turn:** none. A CEO always faces the direction it just moved in, and cannot be aimed separately
(`pz.js#getCeoDirections`). Only on deployment may it be pointed freely.

**Why it matters:**

- It **buffs** its own team's pieces on the six adjacent cells (§8).
- **Deploying it turns a claim into real control** of its team (§10).
- **Killing it kills that team's whole HQ** — every piece of that team that was never deployed dies
  with it (`pz.js#killWholeTeam`). Pieces already on the board survive.
- **Three dead CEOs end the game** (§13).

## 6.3 Spy (1 per team)

**Move:** **one cell in any direction, twice** — three times when buffed. Each step is chosen
separately, so it can zig-zag.

- Its **intermediate steps must land on empty cells**. An unbuffed spy therefore cannot kill with its
  first step; a buffed one cannot kill with its first or second
  (`pz.js#isSpyMiddleMovement`).
- Its **last step may kill an enemy — but only from behind**. The spy must arrive from one of the
  three cells in the target's **rear arc**: directly behind it, or either rear diagonal
  (`pz.js#getThreeBackPositions`). Walking into an enemy's face or flank is not a legal destination.
- It never kills a friendly piece.

**Turn:** none — it faces the direction of its last step and cannot be aimed separately. Only on
deployment may it be pointed freely.

**No changing your mind:** once the spy has taken its first step it cannot be deselected. You must
spend all its steps.

## 6.4 Sniper (1 per team)

**Move:** none. Once deployed a sniper never leaves its cell (`pz.js#getSniperPositions`).

**Its activation is a rotation.** Select it and point it in **any** of the six directions; that is
the whole turn.

**Line of fire:** every cell in a straight line in the direction it faces, stopping **at and
including the first occupied cell**. Buffed, the line runs to the board edge **through** pieces
(`pz.js#getSnipedPositionsBy`).

**Deployment restriction:** a sniper may only be placed on a cell where **at least one** of the six
lines is free of enemy pieces — no deploying into a spot with no shot in any direction
(`pz.js#hasAvailableDirectionsForSniper`).

A sniper does not kill by moving onto anything. It kills through the `SNIPE!` mechanism — §9.

## 6.5 Movement at a glance

| | Deploy | Move | Kills | Turns | Buffed |
| --- | --- | --- | --- | --- | --- |
| **Agent** | any free cell | exactly 2 ahead | enemy 2 ahead | ±1 step, after moving | 1 *or* 2 ahead; kills at 1 |
| **CEO** | any free cell | any distance, 6 directions | never | faces its move | — (buffs others) |
| **Spy** | any free cell | 1 cell × 2 | enemy on the last step, from behind | faces its step | 1 cell × 3 |
| **Sniper** | free cell with a clear line | never | via `SNIPE!` | freely, every turn | sees through pieces |

Every deployment cell must also be outside every enemy sniper's line of fire.

---

## 7. Killing

A piece that ends its move on an occupied cell **kills the occupant** (`pz.js#killPieces`). Legality
is what keeps this honest — no piece is ever offered a destination occupied by a friendly, and the
CEO is never offered an occupied destination at all.

Dead pieces leave the board and go to the **cemetery of the killing piece's team**, which is what
scores the kill (§14). A kill by sniper is credited to the sniper's team.

**Killing a CEO also kills every piece of its team still in the HQ**, whether it died to a move onto
its cell or to a sniper, and the HQ is credited to whoever killed it. Deployed pieces of that team
carry on as normal, and can still be moved by anybody.

---

## 8. CEO buffs

A piece is **buffed** while it stands on one of the six cells adjacent to **its own team's** CEO
(`pz.js#setCeoBuffs`, `isNextToCeo`).

**Buffs are recalculated for every piece at NEXT TURN, and only then.** What counts is where things
stood when the turn began; walking next to a CEO does not buff the walker until the next turn starts.

| Piece | Buffed |
| --- | --- |
| Agent | moves 1 *or* 2 cells ahead, and can kill at 1 |
| Spy | three steps instead of two |
| Sniper | line of fire passes through pieces, all the way to the edge |
| CEO | nothing — a CEO does not buff itself |

---

## 9. Snipers, in full

Snipers are the reason a move can be undone, and the only thing in the game that does **not** belong
to the player taking the turn.

**Marking.** During a turn, any piece that **moves into, out of, or through** an enemy sniper's line
of fire is marked as seen by that sniper (`pz.js#getSnipersInSight`). A whole path is checked, not
just its endpoints — a piece that crosses a line and keeps going is just as marked as one that stops
in it. Snipers only ever mark **enemy** pieces, and only movement marks: a piece that turns on the
spot has crossed nothing, even one standing in a line already.

**Whose shot it is.** `SNIPE!` belongs to **everyone except the player whose move it answers**. A
sniper answers a move, so the player who made that move is the one person who may not take the shot
— and every other player may, without waiting for a turn of their own. Nobody owns a sniper any more
than they own any other piece.

That player is the one on turn while the shot is being lined up inside their own turn, and stays
that player once they have passed the turn on — see **Timing** below. `domain/snipeWindow.js#getMover`
is the single reading of it, used by the button, by the server and by the note described next.

* **Online** — the button is dead for the seat being answered and live for everybody else, and the
  server refuses it either way round (`server/validate.js#isSnipeAction`). The same goes for the
  click that fires: the lit sniper answers to the other seats, not to the mover.
* **Hot-seat** — one screen, one mouse, and the app cannot tell who reached for it, so the button
  stays live for everybody, the player being answered included. Who presses it is a rule between the
  people in the room, and the screen now says which rule: a note beside the button naming **the one
  other player**, when there is only one, or naming **the player who may not**, when naming the rest
  would be a list (`useSnipe.js#useSnipeNote`).

**Firing.** Press **`SNIPE!`** — available whenever a shot is there to line up. Every sniper that has
a marked target lights up. Clicking a lit sniper fires it, and three things happen at once
(`pz.js#killSnipedPiece`):

1. **Every marked piece dies**, credited to the sniper that was clicked.
2. **The rest of the board rolls back to how it stood at the start of the marked move.** That move is
   undone, along with everything it did — a piece it killed on the way is alive again and standing
   where it was, and if it killed a CEO, that team's HQ is back too.
3. **The turn the move was made in ends**, and that player passes it on as usual. A shot taken after
   they have already passed it on ends nothing: whoever is holding the turn now has not moved yet.

**A sniper killed by the very move it saw fires from the cell it stood in.** The mover walks its line
and ends the walk on its cell, so the shot is owed to a piece that is in the cemetery and has no
token left on the board to click. That cell answers for it: while the snipe is armed it carries a
ring, a label and an arrow saying so (`pz.js#getFallenSnipers`). Firing it rolls the board back like
any other shot — which brings the sniper back to life, standing where it was, and kills the piece
that had killed it.

**Timing.** The window is the turn the movement happened in **and lasts until the next player moves
something**. Passing the turn on is not the end of it: whoever is handed the turn may still line the
shot up, and so may everybody else, right up to the moment somebody moves a piece. Picking pieces up
and putting them down does not count — only a move closes it. It survives exactly one turn change,
so a seat that is passed over rather than moving does not hold the shot open forever
(`domain/snipeWindow.js`). Notice it or lose it; there is no holding fire past that.

**Pressing `SNIPE!` freezes the turn.** A turn that had ended counts as unfinished again, so NEXT TURN
goes dead, and while the snipe is armed nothing on the board can be selected except a lit sniper
(`hasTurnEndedReducer.js#snipeState`, `pz.js#hasToToggle`). Once the table has reached for the button,
the shot happens — there is no arming it and then thinking better of it. Firing puts the snipe away
again, which is what hands the board back when the shot was taken on somebody else's turn.

**Deployment is protected.** No piece may be deployed into an enemy sniper's line of fire, so nothing
ever arrives already marked.

**Turning a sniper does not mark the pieces already standing in its new line, and turning under one
does not mark the piece that turned.** Marks come from movement, not from being looked at, and that
holds in both directions. Sweeping a sniper round to face a stationary enemy sets up the shot for the
moment that enemy moves — it does not take it; and a piece caught in a line can turn where it stands
without handing over a second shot at a move it made last turn.

---

## 10. Team control

`teamControl[team]` tracks who commands a team's HQ (`teams.js`).

**A player may hold at most one team at a time.** Taking a second releases the first.

### Getting control

**By CEO.** Press that team's **Claim Control** button — it selects that team's CEO — then deploy the
CEO onto the board. Control becomes real the moment the CEO lands
(`teams.js#movePieceForControl`). Until then it is only a claim, and you can cancel it. Deploying the
CEO is your piece action for the turn.

A team whose **CEO is already on the board cannot be claimed this way**. The claim is refused
(`teams.js#claimControl`) — pressing the button still selects that CEO, so you can move it, but no
control changes hands. Once a CEO is out, the only way to take its team is to reveal.

**By reveal.** Turning one of your own cards face up hands you that team **immediately**, CEO or no
CEO, deployed or not (§11).

### What control does

**Only the controller may deploy pieces out of that team's HQ.** Pieces of that team already on the
board stay public property — anyone on turn can move them
(`pz.js#isToggledTeamControlled`).

### Snatching

Control changes hands freely, in both directions:

- Revealing a card takes that team off whoever held it by CEO.
- Claiming and deploying the CEO takes the team off whoever revealed it — provided that CEO is still
  in the HQ.

Claiming a team you already control and then cancelling does **not** cost you the team.

Claiming is refused once your turn action has been spent.

---

## 11. Revealing

On your turn, press **REVEAL** and turn your **Friend** or **Foe** card face up. It stays face up for
the rest of the game.

- **Cost: −50 points** at scoring, per card revealed (§14). Revealing both costs 100.
- **Gain: control of that team**, immediately (§10).
- Revealing does not end your turn, and you may reveal both cards.

There is also a private **FRIEND & FOE** reminder in the hot-seat game: a warning screen, then your
own two cards, for when you have forgotten them. It reveals nothing to anybody and costs nothing.

---

## 12. Accusing

On your turn, press **ACCUSE**, pick another player — you are never offered yourself — pick
**Friend** or **Foe**, and name a team (`py.js#accuse`).

- **Right** — that player's card is turned face up. They pay the −50 as if they had revealed it, and
  **you may accuse again**. Being right costs you nothing.
- **Wrong** — you may **never accuse that slot again** for the rest of the game. Guess someone's
  friend wrong and you are barred from all future *friend* accusations; your *foe* accusations are
  untouched.
- A slot that is already face up is shown as the card it is, not offered as a target. Naming it
  correctly anyway would do nothing; naming it wrongly would still bar you.

**An accusation-forced reveal hands over no team control** — only your own voluntary reveal does that.

Accusing does not end your turn. You can keep accusing as long as you keep being right.

---

## 13. End of the game

The game ends the instant the **third CEO** is killed
(`constants.js#NUMBER_OF_PLAYERS_KILLED_FOR_GAME_END`, `pz.js#hasGameFinished`). One team is left
with a living CEO.

Every alignment card is then turned face up — scoring needs all of them.

---

## 14. Scoring

### Team points

Each team scores (`teams.js#getPointsForTeam`):

```
team points = value of every piece this team killed
            + value of this team's own pieces still alive on the board
```

with piece values **agent 5, spy 10, sniper 10, CEO 20**.

- Pieces still sitting in the **HQ at the end score nothing** — undeployed is not the same as
  surviving.
- Kills are credited to the **killing piece's team**; a snipe is credited to the sniper you clicked.

### Player points

```
player score = 100
             − 50 for each of your own cards face up (revealed or correctly accused)
             + your friend team's points
             − your foe   team's points
```

(`py.js#getPoints`.) **Highest score wins.**

So the arithmetic of the whole game: build your friend up, tear your foe down, and stay unread — the
50 you pay to seize a team is the price of everybody knowing what you want.

---

## 15. Playing online

The rules above are unchanged online. What the server adds
(`server/validate.js`, `server/redact.js`, `server/rooms.js`):

- **Rooms** hold up to 6 seats and are opened with a 4-character code. Names are up to 16 characters
  and must be unique in a room. Nobody can join a room that has already started.
- **Alignments are never transmitted to the wrong seat.** A seat's own two cards are the only ones its
  client ever receives. Redaction stops only at the end of the game, because scoring needs all of them.
- **Only the seat on turn may act** — which is exactly the local rule, since the turn holder may move
  any team's pieces anyway. There is nothing per-piece to check. The **snipe is the exception, and it
  points the other way**: arming it and firing the lit sniper are refused *to* the seat on turn and
  allowed to every other seat (§9). Nothing else about a lit sniper is special — an ordinary toggle of
  an ordinary piece is still the turn holder's alone.
- **Legality is re-derived server-side.** Locally, legality is enforced by which cells the interface
  makes clickable; online the server checks every move and direction against the same domain code.
- **Starting a game and dealing cards belong to the server.** A client cannot ask for either.
- **A closed laptop cannot end a game.** If the player on turn has been disconnected for 60 seconds,
  anyone may press NEXT TURN — and only that (`server/apply.js#TURN_GRACE_MS`).

---

## Appendix A — Directions and geometry

A direction is a pair `[v, h]`: `v` is `1` up / `0` sideways / `-1` down, `h` is `1` left / `0` right.
Six combinations, listed in ring order (`utils.js#possibleDirections`) so that "previous" and
"following" are 60° rotations and "opposite" is 180°:

| `[v, h]` | Direction |
| --- | --- |
| `[1, 1]` | up-left |
| `[1, 0]` | up-right |
| `[0, 0]` | right |
| `[-1, 0]` | down-right |
| `[-1, 1]` | down-left |
| `[0, 1]` | left |

An agent's three front directions are its facing plus its two neighbours in this ring; a target's
rear arc is the three cells opposite.

**Translating a direction into a cell is not uniform.** Because the rows widen towards row 3 and
narrow after it, the same direction shifts the column differently above, on, and below the middle row
(`cells.js#createGetPositionInDirection`). Going up-left from `[2,1]` reaches `[1,0]`; going up-left
from `[4,1]` reaches `[3,1]`. On the board this is invisible — the hexes line up — but it is why no
code anywhere should do coordinate arithmetic by hand.

The interface renders one extra hexagon either side of every row and an extra row above and below,
purely so a piece on the border can still be pointed outwards.

---

## Appendix B — Edge cases and quirks

Behaviours that are in the game as implemented and that a player could be surprised by. Each was
confirmed by running the domain code; each is a candidate bug rather than a rule anybody designed.

**A spy can kill head-on if some unrelated piece happens to have it behind them.**
The "must arrive from behind" check tests whether *any* piece on the board has the spy in its rear
arc, rather than the piece being attacked (`pz.js#hasPieceBackwards`). With one enemy on the board
the rule works as intended; let a second piece anywhere on the table — either team — happen to have
its back to the spy, and the spy may walk into the first one's face and kill it.
`getPieceAtPosition(position, pieces)` is the piece the check meant to look at.

**A buffed agent one step from the edge is redeployed instead of stepping one.**
A buffed agent's one-cell move is only offered when the two-cell cell exists. Facing a spot where the
second cell is off the board, it takes the whole-board redeploy instead — losing the short step the
buff was supposed to give it (`pz.js#getBuffedAgentPositions`).

**Firing one sniper fires all of them, and one team can be credited with killing its own piece.**
Clicking a lit sniper kills *every* marked piece on the board, including pieces marked by a different
team's sniper, and credits them all to the team of the sniper you clicked. The README's roadmap has
"kill priority between snipers?" open, unticked.

**A spy that gets stuck mid-move locks the turn.**
A spy cannot be deselected once it has stepped, and the turn only ends when it has taken all its
steps. If after the first step every neighbouring cell holds a friendly, or an enemy it cannot take
from behind, it can neither finish nor be put down — and the turn cannot be passed. It takes a
corner and three pieces, so it is rare rather than impossible.

**An armed snipe that nobody resolves stalls the game.**
Pressing `SNIPE!` stops the player on turn from passing it on, and only a player who is not on turn
can fire. With three or more players another of them can always resolve it, but in a two-player game
the one who armed it is the only one who can, so if they walk away the turn cannot move. The
disconnection hatch does not cover this — it releases a turn whose *holder* has gone.

**If every player is on a negative score, nobody is declared the winner.**
The winner is folded up from a placeholder with a score of 0, which beats every negative score, so
the announcement is left blank (`py.js#getWinner`). Ties go to the player latest in seating order.
