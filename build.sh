#!/usr/bin/env bash
# Exit on first error
set -e  

echo "Step 1: Installing Python Libraries..."
# Step 1: Install dependencies for backend
pip install --upgrade pip
pip install -r requirements.lock.txt

echo "Step 2:  Building frontend..."
# Step 2: Build the frontend
cd ai-receptionist-frontend/app/ui
npm ci
npm run build

echo "Build completed successfully!"