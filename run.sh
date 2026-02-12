#!/bin/bash

# Function to show usage
usage() {
    echo "Usage: $0 [dev|prod]"
    echo "  dev  : Run in development mode (SQLite, Hot Reload)"
    echo "  prod : Run in production mode (PostgreSQL via Supabase)"
    exit 1
}

# Check argument
if [ -z "$1" ]; then
    usage
fi

MODE=$1

if [ "$MODE" == "dev" ]; then
    echo "🚀 Starting in DEVELOPMENT mode..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
elif [ "$MODE" == "prod" ]; then
    echo "🌍 Starting in PRODUCTION mode..."
    if [ ! -f .env ]; then
        echo "❌ Error: .env file not found. Please create one from .env.example"
        exit 1
    fi
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
else
    echo "❌ Invalid mode: $MODE"
    usage
fi
