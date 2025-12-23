class UpdateDerivedForConsumers < ActiveRecord::Migration[4.2]
  def change
    consumers = Consumer.includes(:tallysheet_entries).all
    consumers.each do |c|
      c.update_derived
    end
  end
end
