# Backend Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Gmail account for email service

## 1. Install Backend Dependencies

```bash
cd backend
npm install
```

## 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/peerchain

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-random
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
FRONTEND_URL=http://localhost:8081
```

## 3. Gmail Setup for Email Service

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in EMAIL_PASS

## 4. MongoDB Setup

### Option A: Local MongoDB
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

### Option B: MongoDB Atlas (Cloud)
1. Create account at https://cloud.mongodb.com
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in .env

## 5. Start Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 6. Frontend Configuration

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

## 7. Test the Setup

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Visit: http://localhost:8081
4. Try registering with a VIT email
5. Check email for OTP
6. Test Google Scholar verification

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/verify-scholar` - Verify Google Scholar profile
- `GET /api/auth/me` - Get current user
- `GET /health` - Health check

## Troubleshooting

### Email Issues
- Check Gmail app password
- Verify EMAIL_USER and EMAIL_PASS
- Check Gmail security settings

### Database Issues
- Verify MongoDB is running
- Check MONGODB_URI format
- Ensure database permissions

### CORS Issues
- Update FRONTEND_URL in .env
- Check frontend VITE_API_URL

### Google Scholar Issues
- Profile must be public
- Must show "Verified email at vitstudent.ac.in"
- Check network connectivity
