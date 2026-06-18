#!/bin/bash
set -e

# Navigate to the Rails app directory
cd "$(dirname "$0")/.."

echo "Waiting for database to be ready..."
until mysqladmin ping -h "${DATABASE_HOST:-localhost}" -u "${DATABASE_USER:-tally}" --password="${DATABASE_PASSWORD:-sheet!}" --silent; do
  echo "Database is unavailable - sleeping"
  sleep 1
done
echo "Database is ready!"

echo "Creating and migrating database (db:prepare)..."
bundle exec rails db:prepare

echo "Seeding database (db:seed)..."
bundle exec rails db:seed

echo "Database bootstrap completed successfully!"
