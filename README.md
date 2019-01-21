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

## next steps

1. ~play online~
2. matchmaking
  - Add request game function
  - Rework routing appropriately
    - just games/:id but your id must match a player in that game
    - also change routing in newGame (in apiRequests)
  - Only allow proper players into a game
  - fix w/l to not include local games
  - add in progress local games so they don't have to remember the url if they wanna pick it back up later?
3. code cleanup
  - refactor game by extracting methods into new file and extending game with class?
  - remove game container to own component
  - Clean css/class names
4. aesthetics
  - favicon
  - cache images
  - media queries for board size
  - header breakpoints
  - make waiting message nicer for online connection - also make it active? (animated)
  - Integrate amazon [s3](https://aws.amazon.com/s3/) for file storage
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
