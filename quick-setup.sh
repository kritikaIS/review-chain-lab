#!/bin/bash

echo "🚀 PeerChain Quick Setup"
echo "========================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    echo "VITE_API_URL=http://localhost:3001/api" > .env
    echo "✅ Frontend .env created"
else
    echo "✅ Frontend .env already exists"
fi

# Check if backend .env exists
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cat > backend/.env << EOF
# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Atlas Connection String (REPLACE WITH YOUR ACTUAL STRING)
MONGODB_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/peerchain?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=peerchain-super-secret-jwt-key-2024-make-it-very-long-and-random
JWT_EXPIRES_IN=7d

# Email Configuration (REPLACE WITH YOUR GMAIL CREDENTIALS)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
FRONTEND_URL=http://localhost:8081
EOF
    echo "✅ Backend .env created"
    echo "⚠️  IMPORTANT: Update backend/.env with your MongoDB and Gmail credentials!"
else
    echo "✅ Backend .env already exists"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Get MongoDB Atlas connection string from https://cloud.mongodb.com"
echo "2. Update backend/.env with your MongoDB URI"
echo "3. Set up Gmail app password and update EMAIL_USER/EMAIL_PASS"
echo "4. Start backend: cd backend && npm run dev"
echo "5. Start frontend: npm run dev"
echo ""
echo "📖 See MONGODB_SETUP.md for detailed instructions"
