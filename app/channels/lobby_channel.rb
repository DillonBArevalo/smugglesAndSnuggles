class LobbyChannel < ApplicationCable::Channel
  def subscribed
    channel = params['room'] || 'lobby'
    stream_from channel
  end

  def receive(data)
    channel = params['room'] || 'lobby'
    type = data['type']
    if type == 'accept'
      @game = Game.new(game_log: Game.new_game, is_local: data['isLocal'])
      player1 = User.find(data['player1'])
      player2 = User.find(data['player2'])
      @game.players = [player1, player2].shuffle
      if @game.save
        data['url'] = "/games/#{@game.id}/play"
        ActionCable.server.broadcast(channel, {'playerDetails': {'id': player1['id'].to_s, 'name': player1['name']}, 'type': 'leave'})
        ActionCable.server.broadcast(channel, {'playerDetails': data['playerDetails'], 'type': 'leave'})
      else
        data['errors'] = @game.errors
      end
    elsif type == 'startGame'
    end
    ActionCable.server.broadcast(channel, data)
  end

  def unsubscribed
    p 'unsusb happened'
  end
end