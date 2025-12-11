#!/bin/bash

# Exit on first error
set -e

# Install backend dependencies if not already installed
if [ ! -d "backend/node_modules" ]; then
  npm ci --prefix backend
fi

# Run the backend server
npm start --prefix backend

