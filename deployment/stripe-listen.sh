#!/bin/bash

STRIPE_CMD="stripe listen --forward-to localhost:8080/api/webhooks/stripe"

echo "Checking for existing stripe listen processes..."
pids=$(pgrep -f "$STRIPE_CMD" | grep -v "$$")
if [ -n "$pids" ]; then
    echo "Killing existing process(es): $pids"
    kill $pids
    sleep 1
fi

LOG_FILE="/tmp/stripe_listen.log"
echo "Starting stripe listen in the background..."
nohup $STRIPE_CMD > "$LOG_FILE" 2>&1 &
STRIPE_PID=$!

echo "Process started with PID $STRIPE_PID. Waiting for webhook secret..."

secret=""
for i in {1..30}; do
    if grep -q -E "whsec_[a-zA-Z0-9_]+" "$LOG_FILE"; then
        secret=$(grep -o -E "whsec_[a-zA-Z0-9_]+" "$LOG_FILE" | head -n 1)
        break
    fi
    sleep 0.5
done

if [ -n "$secret" ]; then
    echo "Found webhook secret: $secret"
    
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    ENV_FILE="$SCRIPT_DIR/.env"
    
    if [ ! -f "$ENV_FILE" ]; then
        if [ -f ".env" ]; then
            ENV_FILE=".env"
        elif [ -f "deployment/.env" ]; then
            ENV_FILE="deployment/.env"
        fi
    fi

    if [ -f "$ENV_FILE" ]; then
        sed -i '/^STRIPE_WEBHOOK_SECRET=/d' "$ENV_FILE"
        echo "STRIPE_WEBHOOK_SECRET=$secret" >> "$ENV_FILE"
    else
        echo "Warning: .env file not found"
    fi
else
    echo "Error: Webhook secret not found after 15 seconds. Check logs at $LOG_FILE"
    exit 1
fi
