class GamesController < ApplicationController
  before_action do
    redirect_to '/sessions/new' unless logged_in?
  end

  def index
    @games = Game.all
  end

  def new # pre game lobby
    @game = Game.new
  end

  def create # creates a new game and redirects to play
    @game = Game.new(game_log: Game.new_game, is_local: params[:game][:is_local]) #could move to a before create?
    @game.players = [current_user, User.find(params[:player2])].shuffle
    if @game.save
      redirect_to "/games/#{@game.id}/play"
      # maybe redirect to "/games/:id" when the show is set up
    else
      p @game.errors
    end
  end

  def play
    @player = current_user
    @game = Game.find(params[:id])
    if !@game.players.include?(current_user)
      @errors = ['You are not a player in this game']
    end
    @game_data = @game.json_board
    render layout: 'game'
  end

  def show # review an already played game

  end

  def update
    @game = Game.find(params['id'])
    game_data = @game.game_log
    game_data['movesLeft'] = params['movesLeft']
    game_data['activeDeck'] = params['activeDeck']
    game_data['currentBoard'] = params['board']
    game_data['winner'] = params['winner']
    game_data['moveHistory'].push(params['moveData'])
    if params['winner']
      @game.winner = @game.winner_by_deck(params['winner'])
      @game.completed_at = Time.now
    end
    @game.save
  end

  def keys
    render json: {publishKey: ENV['PUBLISH_KEY'], subscribeKey: ENV['SUBSCRIBE_KEY'], uuid: session[:id]}
  end
end
