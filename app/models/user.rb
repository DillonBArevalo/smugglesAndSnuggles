class User < ApplicationRecord
  has_secure_password
  validates :username, :email, presence: true, uniqueness: true
  has_many :won_games, class_name: :games, foreign_key: :winner
  has_many :lost_games, class_name: :games, foreign_key: :loser

  has_attached_file :avatar, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "no-photo.png"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/

  def record
    "#{won_games.length}/#{lost_games.length}"
  end
end
