# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

[
  { name: 'Getränk', price: 1.00 },
  { name: 'Wurst', price: 2.00 },
  { name: 'Steak', price: 3.00 },
  { name: 'Runde', price: 25.00 }
].each do |beverage_data|
  beverage = Beverage.find_or_initialize_by(name: beverage_data[:name])
  beverage.price = beverage_data[:price]
  beverage.available = true
  beverage.save!
end

def clean_for_email(str)
  str.to_s.downcase
     .gsub('ä', 'ae').gsub('ö', 'oe').gsub('ü', 'ue').gsub('ß', 'ss')
     .gsub(/[^a-z0-9]/, '')
end

csv_path = Rails.root.join('db', 'userseed.csv')
if File.exist?(csv_path)
  File.foreach(csv_path) do |line|
    line = line.strip
    next if line.empty?
    
    parts = line.split(',')
    next unless parts.size >= 2
    
    nachname = parts[0].strip
    vorname = parts[1].strip

    if nachname.present? && vorname.present?
      full_name = "#{vorname} #{nachname}"
      email = "#{clean_for_email(vorname)}.#{clean_for_email(nachname)}@example.com"

      consumer = Consumer.find_or_initialize_by(name: full_name)
      consumer.email = email
      consumer.visible = true
      consumer.save!
    end
  end
end
