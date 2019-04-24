# README

## This project is not finished yet and thus this readme is for me, the developer, to put my notes. It will be updated to be a proper readme when the project is at a reasonably presentable point

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
- loading old games sometimes gives wrong board states. maybe an issue with flipped? maybe history?

## decisions that need to be made:

1. victory/defeat screen - mockup
  - have a function to communicate to the server and other player that the game is over. This needs to get run when a player resigns. maybe run it on component unmount as well (probably don't want an internet disconnect to resign though... so maybe not)?

## next steps

1. ~play online~
2. ~matchmaking~
3. aesthetics
  - play redesign:
    - game board section
      - 4 card class categories, for if there are 1, 2, 3, or 4 cards. A little sloppy, but fine short term.
    - stack
    - move confirmation
  - cache images
  - make waiting message nicer for online connection - also make it active? (animated)
  - Integrate amazon [s3](https://aws.amazon.com/s3/) for file storage
4. code cleanup
  - refactor game by extracting methods into new file and extending game with class?
  - remove game container to own component
  - Clean css/class names
  - remove extra data from move history (card details beyond card number and deck)
  - better alt for overflow (also probably rework order of cards in stack for SR?)
  - maybe use straight websockets instead of pubnub?
5. key generation
  - add key generation and keyed sign-up
  - maybe use mailer for sending out keys so it doesn't have to be manual.
6. initial release
7. laws
  - add new version of laws
8. game reviews
  - add ability to locally revisit
9. Additional features
  - move timer for comp/competitive
  - undo last move
  - advanced keyboard support
  - SR support for gameplay
  - settings for default move confirmation state

## Other items of low priority

- Add game chat
- Add opponent info in game

## TODOS:
  - add media queries to make sure "x bears' turn" never overflows...
  - animate removal of move circles and moves <p>
  - move render card out so I don't have to repeat code in cell window and cell

----------
## pubnub notes:
subscribe:
loading message until connect callback at which time a message with a time delay to remove itself gets posted saying you're connected.
local storage for uuid?
restore: true
and a start timestamp to make sure i get missed messages if i reload
callback is what happens when you get a message

in subscribe can have presence. when one person gets a presence message from the other you can send a message to the other notifying that both are in the room. when someone leaves your opponent has disconnected (or reconnected) can be displayed.
can attach a state object that other users get in the join event.

pubnub.state can get you the state of another user. pass it the channel and a uuid. you can then use a callback and an error. if you pass state you are setting state

publish:
has channel, message, callback, and error in an object
do not stringify stuff, just send actual object. they stringify for you
within publish add a callback and an error. minimum console.logs, but they are success and failure for sending.

history:
pubnub.history can give you the history of a channel. Make this happen on reconnect to make sure you have the latest game state.
can specify count: 1 to just get latest state
end given a timetoken can give you all the messages newer than your current timetoken.
localStorage.getItem(subkey) for last time token?

---------

Keys file:

make a dotfile for your keys that looks something like this:

```
#!/bin/bash

export SUBSCRIBE_KEY="my_pubnub_sub_key"
export PUBLISH_KEY="my_pubnub_pub_key"

bin/rails s
```
and start your server with `sh .keys`
