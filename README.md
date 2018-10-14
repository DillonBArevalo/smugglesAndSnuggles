# README

## This project is not finished yet and thus this readme is for me, the author, to put my notes. It will be updated to be a proper readme when the project is at a reasonably presentable point

## notes

TODO:
- put your deck at bottom visually
- favicon?
- media queries for board size


rails todo:
- game
  - add move history.
  - add isOver bool
  - cache images


my understanding of the laws:
  ~~1 cuddle puddle: movement onto the law is free (does not take a move). Does not mean you can move that card again. any card can always move onto the pile. If you do not end your move on the law it is not considered snuggling the law as you were instead smuggled through it.~~
  ~~2 impawsible odds: If attempting to smuggle through this law, the order is reversed and low cards can smuggle higher ones (this one seems simple)~~
  ~~3 bear-boned plan: If you control the law (currently your card is on top of the center pile) then you can move the same card twice. If you start the turn on it any cards can move twice, if you don't, the only card that could actually be moved twice is the center one, because it already had to go once to get there. There's no way to lose control mid turn, so there aren't any complications along those lines.~~
  4 unhuggables: seems straightforward, if attempting to end your turn on this pile you need to have a smaller (or equal) card than your opponent. If you control it you may (as always) move freely onto it no matter the size of your cards.


Next steps:
 - Update laws
 - Use react to construct new game lobby
 - research and use fetch vs axios vs anything else that sounds good. no CORS request, so that's easy. Need js request in controller for passing it and need environment variables.
 - dotenv for env variable of pubnub key.
 - pass pubnub key in api call (fetch) and use closures to hide it
 - add key generation and keyed sign-up
 - maybe use mailer for sending out keys so it doesn't have to be manual.


1 play online
2 matchmaking
3 aesthetics
4 key generation
5 initial release
6 laws


undo last move?
refactor game by extracting methods into new file and extending game with class?


pubnub:
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

credentials include to make sessions go in a fetch request.


Check flipping
if move to defend on own zone then  either person can move the card and it stays flipped. everything goes wrong

you can always move cards in your zone - even if opponents
not an issue on live local
