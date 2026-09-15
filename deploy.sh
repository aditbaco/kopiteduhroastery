#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Configuration
APP_DIR="/var/www/teduhcoffeeroastery"
SERVICE_NAME="teduhcoffeeroastery" # e.g. systemctl restart teduhcoffeeroastery

echo "Starting deployment process..."

# Navigate to application directory
cd $APP_DIR

echo "Pulling latest changes from Git..."
git pull origin main # Or whatever your production branch is

echo "Installing dependencies..."
pnpm install

echo "Generating Prisma client..."
pnpm db:generate

echo "Running database migrations..."
# Using deploy instead of dev for production
pnpm prisma migrate deploy

echo "Building the application..."
pnpm build

echo "Restarting the application service..."
# Assuming systemd is used to manage the node process on Alma Linux
sudo systemctl restart $SERVICE_NAME

echo "Checking service status..."
sudo systemctl status $SERVICE_NAME --no-pager

echo "Deployment completed successfully!"
