#!/bin/sh
set -e

# Wait for database
echo "Waiting for database..."
until deno run --allow-net --allow-env /app/.docker/scripts/check-db.ts; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

# Wait for DragonFly
echo "Waiting for DragonFly..."
until deno run --allow-net --allow-env /app/.docker/scripts/check-redis.ts; do
  echo "DragonFly is unavailable - sleeping"
  sleep 2
done

# Run migrations
echo "Running database migrations..."
deno task db:generate
deno task db:migrate

# Start the application
echo "Starting API server..."
exec "$@"