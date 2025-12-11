#!/bin/bash

# Exit on first error
set -e

# Move into backend folder
cd "$(dirname "$0")/backend"

# Install backend dependencies if not already installed
if [ ! -d "node_modules" ]; then
  npm ci --only=production
fi

# Run the backend server
npm start

