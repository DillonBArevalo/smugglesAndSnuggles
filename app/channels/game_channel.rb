class GameChannel < ApplicationCable::Channel
  def subscribed
    channel = params['room']
    stream_from channel
  end

  def receive(data)
    channel = params['room']
    type = data['type']
    if type == 'move'
      @game = Game.find(data['gameId'])
      game_data = @game.game_log
      game_data['movesLeft'] = data['movesLeft']
      game_data['activeDeck'] = data['activeDeck']
      game_data['currentBoard'] = data['board']
      game_data['winner'] = data['winner']
      game_data['moveHistory'].push(data['moveData'])
      if data['winner']
        @game.winner = @game.winner_by_deck(data['winner'])
        @game.completed_at = Time.now
      end
      @game.save
    elsif type == 'accept'
      @game = Game.new(game_log: Game.new_game, is_local: data['isLocal'])
      player1 = User.find(data['player1'])
      player2 = User.find(data['player2'])
      @game.players = [player1, player2].shuffle
      if @game.save
        data['url'] = "/games/#{@game.id}/play"
      else
        data['errors'] = @game.errors
      end
    end
    (data['isLocal'].to_s.downcase == 'false' || type == 'accept') && ActionCable.server.broadcast(channel, data)
  end

  def unsubscribed(args)
    p 'unsusb happened', args
  end
end