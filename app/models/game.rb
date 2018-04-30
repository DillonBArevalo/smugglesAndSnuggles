class Game < ApplicationRecord
  belongs_to :winner, class_name: :user
  belongs_to :loser, class_name: :user
  validates :winner, :loser, presence: true
end
