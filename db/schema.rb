# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2016_04_22_090816) do
  create_table "beverages", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.boolean "available", default: true
    t.datetime "created_at"
    t.text "name"
    t.float "price"
    t.datetime "updated_at"
  end

  create_table "consumers", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "amount_of_beverages", default: 0
    t.integer "amount_of_paid_beverages", default: 0
    t.datetime "created_at"
    t.float "credit", default: 0.0
    t.float "debt", default: 0.0
    t.text "email"
    t.text "name"
    t.datetime "updated_at"
    t.boolean "visible", default: true
  end

  create_table "payments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.float "amount"
    t.bigint "consumer_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["consumer_id"], name: "index_payments_on_consumer_id"
  end

  create_table "static_flashes", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "content"
    t.datetime "created_at", null: false
    t.datetime "expires"
    t.datetime "updated_at", null: false
    t.index ["expires"], name: "index_static_flashes_on_expires"
  end

  create_table "tallysheet_entries", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "amount", default: 1
    t.integer "beverage_id"
    t.integer "consumer_id"
    t.datetime "created_at"
    t.boolean "payed", default: false
    t.datetime "updated_at"
    t.index ["beverage_id"], name: "index_tallysheet_entries_on_beverage_id"
    t.index ["consumer_id"], name: "index_tallysheet_entries_on_consumer_id"
  end

  add_foreign_key "payments", "consumers"
end
