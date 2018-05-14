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

- maybe move game construction to rails and scrape for initial board state?
  - that way we'd get the image tags as part of the card and wouldn't have to worry about hashed values for the card images, both players would get the same board, and we wouldn't need anything different for restarting a game vs building a new one.
