class GamesController < ApplicationController
  before_action do
    redirect_to '/sessions/new' unless logged_in?
  end

  def index
    @games = Game.all
  end

  def new # pre game lobby
    @game = Game.new
    # communicate with other via websockets
    # one sends user_id, other makes game.
  end

  def create # creates a new game and redirects to play
    @game = Game.new(game_log: Game.new_game) #could move to a before create?
    @game.players = [current_user, User.find(params[:player2])].shuffle
    p params[:player2]
    if @game.save
      redirect_to "/users/#{params[:player2]}/games/#{@game.id}/play"
    else
      p @game.errors
    end
  end

  def play
    @player = current_user
    @game = Game.find(params[:id])
    @game_data = @game.json_board
    @opponent = User.find(params[:user_id])
  end

  def show # review an already played game

  end

  def update

  end

  def keys
    render json: {publishKey: ENV['PUBLISH_KEY'], subscribeKey: ENV['SUBSCRIBE_KEY'], uuid: session[:id]}
  end
end
