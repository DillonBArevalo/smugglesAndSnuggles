# README

## This project is not finished yet and thus this readme is for me, the author, to put my notes. It will be updated to be a proper readme when the project is at a reasonably presentable point

## notes

1 play online
  - move history
  - add isOver
  - remove current version of laws
  - pubnub takes a second to connect. block deck render against it
  - error handling for pubnub/fetches
  - deck at bottom
  - undo last move?
2 matchmaking
  - Use react to construct new game lobby
2.5 code cleanup
  - refactor game by extracting methods into new file and extending game with class?
3 aesthetics
  - favicon
  - cache images
  - media queries for board size
4 key generation
  - add key generation and keyed sign-up
  - maybe use mailer for sending out keys so it doesn't have to be manual.
5 initial release
6 laws
  - add new version of laws
7 game reviews
  - add ability to locally revisit

## Other items of low priority

- Add game chat
- Add opponent info in game

## implementation thoughts

- For flipping decks. we can say that one deck is always bottom and add a flipping behavior in the js. We can then curry all relevant functions and bind them in the constructor to the appropriate flipped or non-flipped version.

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
