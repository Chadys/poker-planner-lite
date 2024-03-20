# Technical specification

This is the spec that was written before starting the development of the app

## Description

Simple app to have poker planning session

Browser compatibility: recent browsers only, we don't care about retro-compatibility

Inspiration: [PlanningPokerOnline](https://planningpokeronline.com/)
We absolutely don't want all features of this app. We only need the ability to join a room and vote. And vote. And vote again. Simplicity and usability is a must! We already have our own issue tracker with weight and needed a small supplementary tool for our poker planning session.

Techno: [Angular](https://angular.io), websocket with an mqtt server, no proper back or database needed (for the challenge of it).

Bonus: We also want to have cool sound effects, without them becoming annoying after a time.

## Users presentation

Users can be spectator or players.

Spectator are passive and juste watch what is happening.
The PO or scrum master are the most likely to have this role.

Players are the ones that will vote on the complexity of each issue.
The developers that will actually work on the issues are those most likely to have this role.

## User stories

- **As a user** I want to be able to select an existing room or create a new one when I open the app
- **As a user** I want to be able to select my role (spectator or player) when I enter a room
- **As a player** I want to choose my name when I enter a room
- **As a spectator** I want to receive a warning message that my room won't be displayed and to share the link directly instead, when I create a room as a spectator
- **As a spectator** I want to be notified and when the last player leave the room (with similar message as previous user story)
- **As a user** I want to be able to see every player in the room
- **As a player** I want to be able to select a card (0, 0.5, 1, 2, 3, 5, 8, 13+) to vote and to see what card I selected
- **As a user** I want to see when any player has voted, without seeing what they voted for
- **As a user** I want to see a countdown and have all player cards be revealed once every player has voted for the current round
- **As a player** I want to be able to change my vote while the countdown is still ongoing which will reset it for everyone
- **As a player** I want every votes to be reset once I select a new card to vote after a round has ended
- **As a user** I want to see a player disappear from screen if they leave the room
- **As a user** I want to be able to delete another player (in case of player cleaning malfunction)
- **As a player** I want to be automatically re-added if I was deleted by mistake
- **As a player** my player name is prefilled if I filled it once
- **As a user** I can go back to rooms lobby from a room

## Technical behaviour

### URL Links

- Rooms lobby is at root / of the app
- Any room is reachable at /rooms/<room_name> and can be created dynamically by simply going to any link with this pattern

### On entering rooms lobby

- subscribe to /rooms/# and add all results to a set of room that is displayed to the user to chose from

### On entering a room

- Be asked for your role and optionally name
- If user is player:
  - Save my player name to local storage
  - publish to /rooms/<room-name>/connected-players/<player-name> with payload 1 and retain it (with good max duration like 6h)
- Subscribe to /rooms/<room-name>/connected-players/# and react to received player names
- Subscribe to /rooms/<room-name>/current-round/, keep up to date with round number
- Subscribe to /rooms/<room-name>/votes/# and react to each player votes
- If user is spectator and set of other player is empty:
  - warning message about room being empty and your presence not enough to make it visible

### On receiving a player connection

- If payload is 1:
  - add player to vote-per-player map
- Else (payload is 0 or empty):
  - remove player from vote-per-player map (special case if player is oneself, see "On being deleted")

### On current round update

- If number is different from component current local number:
  - update component local round number

### On receiving a vote

- If vote is received for current round:
  - add vote to current vote-per-player map
  - If component state is in revealed state:
    - Change component state to hide every cards
  - If vote is the last missing vote:
    - Start countdown from 3 to 0 and on 0 reveal current votes by changing component state and clear current vote-per-player map. This countdown is reset if a new vote is received while it is still ongoing

### On voting

- If vote is first one:
  - Add 1 to component local round number
  - Publish to /rooms/<room-name>/current-round/ with payload of local round number and retain it (with good max duration like 5min)
- Publish to /rooms/<room-name>/votes/<round-number>/<player-name>/ with payload of the selected card value and retain it (with good max duration like 5min)

### On leaving a room

- If user is player:
  - publish to /rooms/<room-name>/connected-players/<player-name> with empty payload and retain it to clean topic
  - (test if subscribed users receive the empty payload, if this is not the case, add a publish with payload 0 before previous empty one)

### On leaving any page

- disconnect from mqtt server

### On deleting a player

- publish to /rooms/<room-name>/connected-players/<deleted-player-name> with empty payload and retain it to clean topic
- (test if subscribed users receive the empty payload, if this is not the case, add a publish with payload 0 before previous empty one)

### On being deleted

- publish to /rooms/<room-name>/connected-players/<player-name> with payload 1 and retain it (with good max duration like 6h)
- Publish to /rooms/<room-name>/votes/<round-number>/<player-name>/ with payload of the selected card value and retain it (with good max duration like 5min)
