# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20190609000138) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "games", force: :cascade do |t|
    t.json "game_log"
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_local"
  end

  create_table "games_users", force: :cascade do |t|
    t.bigint "game_id"
    t.bigint "user_id"
    t.string "deck"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_games_users_on_game_id"
    t.index ["user_id"], name: "index_games_users_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "password_digest"
    t.string "email"
    t.boolean "admin", default: false
    t.string "avatar_file_name"
    t.string "avatar_content_type"
    t.integer "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "email_consent", default: false
  end

  create_table "users_won_games", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "game_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_users_won_games_on_game_id"
    t.index ["user_id"], name: "index_users_won_games_on_user_id"
  end

  add_foreign_key "games_users", "games"
  add_foreign_key "games_users", "users"
  add_foreign_key "users_won_games", "games"
  add_foreign_key "users_won_games", "users"
end
