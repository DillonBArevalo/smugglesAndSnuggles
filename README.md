# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

## notes

TODO:
- add stack view
- add law logic
- add websockets
- put your deck at bottom visually
- add real game generation


rails todo:
- game
  - add move history.
  - separate initial state from current state
  - add turns left (int max size = 2)
  - add isOver bool


my understanding of the laws:
  1 cuddle puddle: movement onto the law is free (does not take a move). Does not mean you can move that card again. any card can always move onto the pile. If you do not end your move on the law it is not considered snuggling the law as you were instead smuggled through it.
  ~~2 impawsible odds: If attempting to smuggle through this law, the order is reversed and low cards can smuggle higher ones (this one seems simple)~~
  ~~3 bear-boned plan: If you control the law (currently your card is on top of the center pile) then you can move the same card twice. If you start the turn on it any cards can move twice, if you don't, the only card that could actually be moved twice is the center one, because it already had to go once to get there. There's no way to lose control mid turn, so there aren't any complications along those lines.~~
  4 unhuggables: seems straightforward, if attempting to end your turn on this pile you need to have a smaller (or equal) card than your opponent. If you control it you may (as always) move freely onto it no matter the size of your cards.

