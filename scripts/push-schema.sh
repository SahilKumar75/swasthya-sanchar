#!/bin/bash
# Script to push Prisma schema to production database

echo "🔄 Pushing Prisma schema to production database..."

# Load production environment variables
if [ -f .env.production ]; then
  export $(cat .env.production | grep -v '^#' | xargs)
fi

# Push schema
npx prisma db push --accept-data-loss

echo "✅ Schema push complete!"
