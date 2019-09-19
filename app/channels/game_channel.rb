class GameChannel < ApplicationCable::Channel
  # def subscribed
  #   channel = params['room'] || 'lobby'
  #   stream_from channel
  # end

  # def receive(data)
  #   channel = params['room'] || 'lobby'
  #   type = data['type']
  #   p '*' * 100
  #   p type
  #   p data
  #   p '*' * 100
  #   if type == 'accept'
  #     @game = Game.new(game_log: Game.new_game, is_local: data['isLocal']) #could move to a before create?
  #     @game.players = [User.find(data['player1']), User.find(data['player2'])].shuffle
  #     if @game.save
  #       data['url'] = "/games/#{@game.id}/play"
  #     else
  #       data['errors'] = @game.errors
  #     end
  #   end
  #   ActionCable.server.broadcast(channel, data)
  # end

  # def unsubscribed
  #   p 'unsusb happened'
  # end
end