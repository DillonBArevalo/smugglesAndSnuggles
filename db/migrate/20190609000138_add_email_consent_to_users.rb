class AddEmailConsentToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :email_consent, :boolean, default: false
  end
end
