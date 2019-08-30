class IndexController < ApplicationController
  def home
    @game = Game.new
    render 'home'
  end
end
