#!/bin/bash

echo "🚀 Starting PeerChain Backend Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   mongod"
    echo ""
    echo "   Or use MongoDB Atlas (cloud) and update MONGODB_URI in .env"
    echo ""
fi

# Navigate to backend directory
cd backend

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it with the required configuration."
    echo "   See setup-backend.md for details."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🔧 Starting server..."
npm run dev
