module GamesHelper
  def generate_card_images
    cards = {
      'city' => {
        'flipped' => image_url('cards/city/city-flipped.png'),
        'overflow' => image_url('cards/city/city-overflow.png')
      },
      'country' => {
        'flipped' => image_url('cards/country/country-flipped.png'),
        'overflow' => image_url('cards/country/country-overflow.png')
      }
    }
    8.times do |num|
      num_str = "#{num + 1}"
      ['city', 'country'].each do |deck|
        cards[deck][num_str] = image_url("cards/#{deck}/#{deck}#{num_str}.png")
      end
    end
    return cards
  end
  def generate_move_confirmation_images
    {
      'checkboxChecked' => image_url('checkBox_ticked.png'),
      'checkboxUnchecked' => image_url('checkBox_unticked.png'),
      'checkIcon' => image_url('checkMark_button.png'),
      'xIcon' => image_url('X_button.png')
    }
  end
  def generate_icon_images
    {
      'inspectIcon' => image_url('inspectIcon.png'),
      'redoIcon' => image_url('redoIcon.png')
    }
  end
  def generate_banner_images
    {
      'city' => image_url('winBanner_city.png'),
      'country' => image_url('winBanner_country.png')
    }
  end
  def generate_image_assets_json
    assets = {
      'banners' => generate_banner_images(),
      'cards' => generate_card_images(),
      'moveConfirmation' => generate_move_confirmation_images(),
      'icons' => generate_icon_images()
    }
    return assets.to_json
  end
end
