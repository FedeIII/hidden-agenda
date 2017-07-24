# Hidden Agenda
An abstract board game with psychology

## Getting Started

### Installing
* Install [yarn](https://yarnpkg.com/en/docs/install)
* Install dependencies
```
yarn install
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
* New pieces:
  * ~~Spy~~
  * ~~Sniper~~
* pieces capture only other teams' pieces
  * ~~Agent~~
  * ~~Spy~~
  * Sniper
* ~~Spy kill mechanics~~
* ~~Sniper kill mechanics~~
* Sniper kill mechanics: sniping after moving a piece
* CEO buffs
* Remote multiplayer
* Alignment cards
* Game ending
* Scores
* Reveal mechanics
* Accuse mechanics
* Claim control mechanics
* Port to electron

## Known Bugs
* ~~Agent direction after sliding~~
* Switch selected agent allows to direct it without moving it first
* ~~Pieces are not allowed to spawn over other pieces~~
* End turn on spy movement
