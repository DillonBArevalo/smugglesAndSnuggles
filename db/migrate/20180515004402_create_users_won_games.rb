class CreateUsersWonGames < ActiveRecord::Migration[5.1]
  def change
    create_table :users_won_games do |t|
      t.references :user, foreign_key: true
      t.references :game, foreign_key: true

      t.timestamps
    end
  end
end
