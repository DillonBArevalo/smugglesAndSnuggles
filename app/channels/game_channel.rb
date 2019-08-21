
# app/channels/appearance_channel.rb
class GameChannel < ApplicationCable::Channel
  def subscribed
    stream_from params['room']
  end

  def receive(data)
    ActionCable.server.broadcast(params['room'], data)
  end

  def unsubscribed
    p 'unsusb happened'
  end
end