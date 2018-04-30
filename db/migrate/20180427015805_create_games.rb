class CreateGames < ActiveRecord::Migration[5.1]
  def change
    create_table :games do |t|
      t.references :winner, references: :user
      t.references :loser, references: :user
      t.json :game_log

      t.timestamps
    end
  end
end
