# README

This project is not finished yet and thus this readme is for me, the developer, to put my notes. It will be updated to be a proper readme when the project is at a reasonably presentable point

## Tasks before initial release:
- replace pubnub with websockets
- review game and reamatch functionality
  - review game can just be an alert
  - review game needs to be fixed on both the finished game page and the profile page
- lobby functionality (invite and accept games)
- home page
- basic responsivity
- Basic accessibility
  - form validation rework (and rerouting correctly (ajax?))
  - dynamic page titles
- image caching
- admin accounts
- db wipe
- add edit profile picture functionality to profile
- emote wheel
- color cleanup
- make waiting message nicer for online connection - also make it active? (animated)
  - player disconnect message in game
  - different message for resign vs disconnect

## bugs
- 3 players online (phone, chrome, and incognito) and all three aren't showing up in the lobby
- requesting multiple times works (shouldn't)
  - correct message shows after sending, but when you click the name from the list again it gives you the form again
  - line 32 in lobby. error is in setPlayerInviteStatus: doesn't save state in players dataset, only in selected player. dumb.
- phone user seems to trigger a leave event but not leave lobby.
  - state goes to undefined but stays in lobby. strange. maybe talk to PN about it?
- people sometimes don't show up in the lobby
- safari seems to log an error with PN sometimes. more investigating could be good.
  - looks to be on unsubscribeAll()?
- previously moved card isn't maintained when page is reloaded. allows for cheating by moving, reloading, moving same card.
  - component did mount look at last move?
- loading old games sometimes gives wrong board states. maybe an issue with flipped? maybe history?

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


---------

## Running a local version:

Keys file:

make a dotfile for your keys that looks something like this:

```
#!/bin/bash

export SUBSCRIBE_KEY="my_pubnub_sub_key"
export PUBLISH_KEY="my_pubnub_pub_key"

bin/rails s
```
and start your server with `sh .keys`
