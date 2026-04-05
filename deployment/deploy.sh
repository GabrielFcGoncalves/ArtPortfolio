#!/bin/bash

# Configuration
COMPOSE_FILE="docker-compose.beta.yaml"

# Change to the script's directory and then to the deployment folder 
# to ensure the path to the compose file is always correct.
cd "$(dirname "$0")"

if [[ "$1" == "--down" ]]; then
    if [[ "$2" == "-v" ]]; then
        echo "Stopping containers and removing volumes..."
        docker compose -f "$COMPOSE_FILE" down -v
    else
        echo "Stopping containers..."
        docker compose -f "$COMPOSE_FILE" down
    fi
    exit 0
fi

echo "Building and starting the portfolio stack..."
docker compose -f "$COMPOSE_FILE" up --build -d