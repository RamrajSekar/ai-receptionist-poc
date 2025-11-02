#!/usr/bin/env bash
# Exit on first error
set -o errexit  

# Step 1: Install dependencies for backend
pip install --upgrade pip
pip install -r requirements.txt

# Step 2: Build the frontend
cd app/ui
npm install
npm run build

# Step 3: Copy frontend build output into FastAPI's static folder
mkdir -p ../ui
cp -r dist/* ../ui/
