class AddIsLocalToGames < ActiveRecord::Migration[5.1]
  def change
    add_column :games, :is_local, :boolean
  end
end
