#!/usr/bin/env bash
set -e

# Run migrations
cd /app
alembic upgrade head || true

# Start server
exec uvicorn app.main:app --host 0.0.0.0 --port 8001
