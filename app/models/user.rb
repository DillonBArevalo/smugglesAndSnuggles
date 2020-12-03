class User < ApplicationRecord
  has_secure_password
  validates :username, :email, presence: true, uniqueness: true
  has_many :users_won_games
  has_many :won_games, through: :users_won_games, source: :game
  has_many :games_users
  has_many :games, -> { order "updated_at DESC" }, through: :games_users

  has_one_attached :avatar
  # validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/

  def wins
    won_games.length
  end

  def losses
    games.select{|game| game.completed_at}.length - wins
  end

  def deck(game)
    self.games_users.find_by(game_id: game.id).deck
  end

  def get_avatar(config)
    if self.avatar.attached?
      Rails.application.routes.url_helpers.rails_representation_url(self.avatar.variant(config).processed, only_path: true)
      # self.avatar.variant(config)
    else
      ActionController::Base.helpers.image_url('no-photo.png')
    end
  end
end
