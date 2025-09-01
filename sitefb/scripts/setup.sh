#!/usr/bin/env bash
set -e

# Create backend/.env if missing by prompting the user
if [ ! -f backend/.env ]; then
  echo "Configurer backend/.env"
  read -p "DATABASE_URL: " DATABASE_URL
  read -p "DISCORD_CLIENT_ID: " DISCORD_CLIENT_ID
  read -p "DISCORD_CLIENT_SECRET: " DISCORD_CLIENT_SECRET
  read -p "DISCORD_BOT_TOKEN: " DISCORD_BOT_TOKEN
  read -p "JWT_SECRET: " JWT_SECRET
  read -p "ENCRYPTION_KEY: " ENCRYPTION_KEY
  read -p "FRONTEND_URL: " FRONTEND_URL
  read -p "REDIRECT_URI_DEV: " REDIRECT_URI_DEV
  read -p "REDIRECT_URI_PROD: " REDIRECT_URI_PROD
  read -p "CORS_ORIGINS: " CORS_ORIGINS
  read -p "ENV: " ENV
  cat > backend/.env <<EONV
DATABASE_URL=$DATABASE_URL
DISCORD_CLIENT_ID=$DISCORD_CLIENT_ID
DISCORD_CLIENT_SECRET=$DISCORD_CLIENT_SECRET
DISCORD_BOT_TOKEN=$DISCORD_BOT_TOKEN
JWT_SECRET=$JWT_SECRET
ENCRYPTION_KEY=$ENCRYPTION_KEY
FRONTEND_URL=$FRONTEND_URL
REDIRECT_URI_DEV=$REDIRECT_URI_DEV
REDIRECT_URI_PROD=$REDIRECT_URI_PROD
CORS_ORIGINS=$CORS_ORIGINS
ENV=$ENV
EONV
fi

# Setup Python virtual environment
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

# Run migrations and start backend
cd backend
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
