class Game < ApplicationRecord
  has_one :users_won_game
  has_one :winner, through: :users_won_game, source: :user
  has_many :games_users
  has_many :players, through: :games_users, source: :user

  def self.new_game
    city_cards = build_deck('city').shuffle
    country_cards = build_deck('country').shuffle
    flip_evens(city_cards)
    flip_evens(country_cards)
    [
      [
        [city_cards.pop(), city_cards.pop()],
        [city_cards.pop(), city_cards.pop()],
        [city_cards.pop(), city_cards.pop()]
      ],
      [
        [city_cards.pop(), city_cards.pop()],[],[]
      ],
      [
        [],['law' + rand(1..4).to_s],[]
      ],
      [
        [],[],[country_cards.pop(), country_cards.pop()]
      ],
      [ [country_cards.pop(), country_cards.pop()],
        [country_cards.pop(), country_cards.pop()],
        [country_cards.pop(), country_cards.pop()]
      ]
    ]
  end

  private

  def self.build_deck(deck_name)
    deck = []
    8.times do |i|
      deck << {value: i + 1, deck: deck_name}
    end
    deck
  end

  def self.flip_evens(deck)
    flip = false
    deck.map! do |card|
      if flip
        card[:faceDown] = true
      end
      flip = !flip
      card
    end
  end
end
