# Hidden Agenda
An abstract board game with psychology

## Getting Started

### Installing
* Install dependencies
```
npm install
```
* Build dist folder
```
yarn do
```
* Open index.html in the dist folder

### Developer
Watch for changes to build again the dist folder
```
yarn go
```

## Changelog
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
* ~~Sniper kill mechanics~~
  * ~~kill before move~~
  * ~~allow to snipe if any sniper is placed~~
  * ~~block sniper-related spawns:~~
    * ~~block sniper directions on position~~
    * ~~block pieces position in snipers lines of sight~~
    * ~~block sniper position if no available line of sight in any direction~~
  * ~~select sniper after clicking on snipe~~
  * ~~kill after move~~
* ~~CEO buffs~~
  * ~~Agent~~
  * ~~Spy~~
  * ~~Sniper~~
* ~~Cementeries~~
  * ~~assign kills~~
  * ~~show kills~~
  * ~~killing a ceo kills the rest of team pieces~~
* ~~Game ending~~
* Scores
  * ~~team scores~~
    * ~~killed pieces~~
    * ~~survivor pieces~~
    * ~~piece score table~~
  * player scores
* ~~Alignment cards~~
* Reveal mechanics
* Accuse mechanics
* Claim control mechanics
* Remote multiplayer
* Port to electron

## Known Bugs
* Spies reset their movement when clicked on after first movement
* Spies shouldn't be able to kill on their first move (or second move if buffed)
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
