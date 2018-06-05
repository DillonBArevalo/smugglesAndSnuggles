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
    game_data = {'movesLeft': 1}
    city_cards = build_deck('city').shuffle
    country_cards = build_deck('country').shuffle
    game_data['activeDeck'] = decide_first_move(city_cards, country_cards)
    flip_evens(city_cards)
    flip_evens(country_cards)
    game_data['startingBoard'] = [
      [
        {
          'cards': [city_cards.pop(), city_cards.pop()]
        },
        {
          'cards': [city_cards.pop(), city_cards.pop()]
        },
        {
          'cards': [city_cards.pop(), city_cards.pop()]
        }
      ],
      [
        {
          'cards': [city_cards.pop(), city_cards.pop()]
        },
        {
          'cards': []
        },
        {
          'cards': []
        }
      ],
      [
        {
          'cards': []
        },
        {
          'cards': [{deck: 'laws', value: rand(1..4)}]
        },
        {
          'cards': []
        }
      ],
      [
        {
          'cards': []
        },
        {
          'cards': []
        },
        {
          'cards': [country_cards.pop(), country_cards.pop()]
        }
      ],
      [
        {
          'cards': [country_cards.pop(), country_cards.pop()]
        },
        {
          'cards': [country_cards.pop(), country_cards.pop()]
        },
        {
          'cards': [country_cards.pop(), country_cards.pop()]
        }
      ]
    ]
    game_data['currentBoard'] = game_data['startingBoard']
    game_data
  end

  def json_board
    self.game_log['currentBoard'].each do |row|
      row.each do |cell|
        cell['cards'].each do |card|
          card['url'] = ActionController::Base.helpers.image_path("cards/#{card['deck']}/#{card['deck']}#{card['value']}.png")
          card['active'] = false
        end
        cell['highlighted'] = false
      end
    end
    return self.game_log.to_json
  end

  private

  def self.decide_first_move(city, country)
    if city[-1][:value] == country[1][:value] && city[1][:value] = country[-1][:value]
      return decide_first_move(city.shuffle!, country.shuffle!)
    elsif city[-1][:value] == country[1][:value]
      city[1], city[-1] = city[-1], city[1]
      country[1], country[-1] = country[-1], country[1]
    end
    city[-1][:value] > country[1][:value] ? 'country' : 'city'
  end

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
