
# app/channels/appearance_channel.rb
class GameChannel < ApplicationCable::Channel
  def subscribed
    channel = params['room'] || 'lobby'
    stream_from channel
  end

  def receive(data)
    channel = params['room'] || 'lobby'
    ActionCable.server.broadcast(channel, data)
  end

  def unsubscribed
    p 'unsusb happened'
  end
end