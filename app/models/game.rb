class Game < ApplicationRecord
  belongs_to :city_bears, class_name: :user
  belongs_to :country_bears, class_name: :user
  belongs_to :winner, class_name: :user
  validates :city_bears, :country_bears, presence: true

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
        [],['law' + rand(1..4)],[]
      ],
      [
        [],[],[countryCards.pop(), countryCards.pop()]
      ],
      [ [countryCards.pop(), countryCards.pop()],
        [countryCards.pop(), countryCards.pop()],
        [countryCards.pop(), countryCards.pop()]
      ]
    ]
  end

  private

  def build_deck(deck_name)
    deck = []
    8.times do |i|
      deck << {value: i + 1, deck: deck_name}
    end
    deck
  end

  def flip_evens(deck)
    flip = false
    deck.map! do |card|
      if flip do
        card[:faceDown] = true
      end
      flip = !flip
      card
    end
  end
end
