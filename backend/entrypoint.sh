#!/bin/sh

echo "Running DB create..."
yarn medusa db:create

echo "Running DB migrate..."
yarn medusa db:migrate

echo "Seeding database..."
yarn run seed

echo "Creating admin user..."
yarn medusa user -e admin@test.com -p supersecret -i admin

echo "Starting Medusa server..."
yarn run start
