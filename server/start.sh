#!/bin/bash
# Build backend
cd server
npm install
npm run build

# Build frontend
cd ../client
npm install
npm run build

# Start server
cd ../server
npm start
