class CreateGamesUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :games_users do |t|
      t.references :game, foreign_key: true
      t.references :user, foreign_key: true
      t.string :deck

      t.timestamps
    end
  end
end
