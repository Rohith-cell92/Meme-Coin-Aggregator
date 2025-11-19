#!/bin/bash

echo "🚀 Setting up Meme Coin Aggregator Service..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check Redis
if ! command -v redis-cli &> /dev/null; then
    echo "⚠️  Redis CLI not found. Make sure Redis is running."
    echo "   You can start Redis with: docker run -d -p 6379:6379 redis:latest"
else
    if redis-cli ping &> /dev/null; then
        echo "✅ Redis is running"
    else
        echo "⚠️  Redis is not responding. Make sure Redis is running on localhost:6379"
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "✅ .env file already exists"
fi

# Build the project
echo "🔨 Building project..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the service:"
echo "  npm run dev    # Development mode"
echo "  npm start      # Production mode"
echo ""
echo "To run tests:"
echo "  npm test"
echo ""

