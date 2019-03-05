module GamesHelper
  def generate_card_images_json
    cards = {
      'city' => {
        'flipped' => image_url("cards/city/city-flipped.png")
      },
      'country' => {
        'flipped' => image_url("cards/country/country-flipped.png")
      }
    }
    8.times do |num|
      num_str = "#{num + 1}"
      ['city', 'country'].each do |deck|
        cards[deck][num_str] = image_url("cards/#{deck}/#{deck}#{num_str}.png")
      end
    end
    return cards.to_json
  end
end
