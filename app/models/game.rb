class Game < ApplicationRecord
  has_one :users_won_game
  has_one :winner, through: :users_won_game, source: :user
  has_many :games_users
  has_many :players, through: :games_users, source: :user

  before_create do
    self.games_users.first.deck = 'city'
    self.games_users.last.deck = 'country'
  end

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
        [],[{deck: 'laws', value: rand(1..4)}],[]
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

  def board_with_images_as_json
    self.game_log.each do |row|
      row.each do |cell|
        cell.each do |card|
          card['url'] =ActionController::Base.helpers.image_path("cards/#{card['deck']}/#{card['deck']}#{card['value']}.png")
        end
      end
    end
    return self.game_log.to_json
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
