#!/usr/bin/env bash
# Exit on first error
set -o errexit  

echo "Step 1: Installing Python Libraries..."
# Step 1: Install dependencies for backend
pip install --upgrade pip
pip install -r requirements.lock.txt

echo "Step 2:  Building frontend..."
# Step 2: Build the frontend
cd ai-receptionist-frontend/app/ui
npm ci
npm run build

echo "Step 3: Copying build files to FastAPI UI directory..."
rm -r ../app/ui
mkdir -p ../app/ui
cp -r dist/* ../app/ui/
cp -r dist/* ../app/ui/

echo "Build completed successfully!"