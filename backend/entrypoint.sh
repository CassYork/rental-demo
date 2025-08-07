#!/bin/sh

# Run migrations and start server
echo "Running database migrations..."
npx medusa db:migrate

echo "Seeding database..."
yarn seed || echo "Seeding failed, continuing..."

npx medusa user -e admin@test.com -p supersecret -i admin

yarn build

echo "Starting Medusa development server..."
yarn start