class GamesController < ApplicationController
  def index
    @games = Game.all
  end

  def new # pre game lobby
  end

  def create # creates a new game and redirects to play
    @game = Game.new()
  end

  def play
    @game =
  end

  def show # review an already played game

  end

  def update

  end
end
