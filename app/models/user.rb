class User < ApplicationRecord
  has_secure_password
  validates :username, :email, presence: true, uniqueness: true
  has_many :users_won_games
  has_many :won_games, through: :users_won_games, source: :game
  has_many :games_users
  has_many :games, through: :games_users

  has_attached_file :avatar, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "no-photo.png"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/

  def wins
    won_games.length
  end

  def losses
    games.select{|game| game.completed_at}.length - wins
  end

  def deck(game)
    self.games_users.find_by(game_id: game.id).deck
  end
end
