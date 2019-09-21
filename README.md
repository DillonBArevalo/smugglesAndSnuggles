# README

This project is not finished yet and thus this readme is for me, the developer, to put my notes. It will be updated to be a proper readme when the project is at a reasonably presentable point

## implementation notes
- action cable
  - enable auth
  - might want to include turn number and move number in move data sent to server/stored in db so people can't move twice if internet gets screwed up...
  - might not work in production yet. i think i need to enable redis in a config file somewhere

## Tasks before initial release:
- Add leave functionality to game (at the very least intentional disconnects should notify opponent)
- review game and reamatch functionality
  - review game can just be an alert
  - review game needs to be fixed on both the finished game page and the profile page
- home page
- basic responsivity
- Basic accessibility
  - form validation rework (and rerouting correctly (ajax?))
  - dynamic page titles
  - run axe
- image caching
- admin accounts
- db wipe
- add edit profile picture functionality to profile
- emote wheel
- color cleanup
- make waiting message nicer for online connection
  - also make it active? (animated)
  - player disconnect message in game
  - different message for resign vs disconnect

## bugs
- previously moved card isn't maintained when page is reloaded. allows for cheating by moving, reloading, moving same card.
  - component did mount look at last move?
- loading old games sometimes gives wrong board states. maybe an issue with flipped? maybe history?
- you are not a player in this game message doesn't seem to have a layout and thus looks awful.
  - also error page for form. look at layouts in general...
- if games get out of sync we have a real problem. you can move a card and it'll send it just fine, but if you've missed a move (say dropped offline for a sec and then reconnected having missed a move)
- TomTom still in lobby after joining game (he invited, i think):
  Ignoring message processed after the WebSocket was closed: "{\"command\":\"message\",\"identifier\":\"{\\\"channel\\\":\\\"LobbyChannel\\\",\\\"room\\\":\\\"lobby\\\"}\",\"data\":\"{\\\"type\\\":\\\"leave\\\",\\\"playerDetails\\\":{\\\"id\\\":\\\"8\\\",\\\"name\\\":\\\"tomtom\\\"}}\"}")

## code cleanup
  - refactor game by extracting methods into new file and extending game with class?
  - remove game container to own component
  - Clean css/class names/variable names
  - remove extra data from move history (card details beyond card number and deck)
  - better alt for overflow (also probably rework order of cards in stack for SR?)
  - Make sure all pages have appropriate landmarks
  - move render card out so I don't have to repeat code in cell window and cell
  - remove unused code

## Other items of low priority

- advanced keyboard support
- SR support for gameplay
- make winner not automatically switch turns
- undo last move
- animate removal of move circles and moves \<p\> (rubber band)
- move timer for comp/competitive
- add new version of laws
- implement a heartbeat for players connected in a game?
