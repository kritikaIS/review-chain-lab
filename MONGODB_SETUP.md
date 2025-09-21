# 🗄️ MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud) - RECOMMENDED

### Step 1: Create MongoDB Atlas Account
1. Go to https://cloud.mongodb.com
2. Sign up for free account
3. Create a new cluster (free tier available)

### Step 2: Get Connection String
1. In Atlas dashboard, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `peerchain`

**Example connection string:**
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/peerchain?retryWrites=true&w=majority
```

### Step 3: Create Backend .env File
Create `backend/.env` with this content:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/peerchain?retryWrites=true&w=majority

# JWT Secret (generate a strong secret)
JWT_SECRET=peerchain-super-secret-jwt-key-2024-make-it-very-long-and-random
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

## Option 2: Local MongoDB

### Step 1: Install MongoDB Locally
```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

### Step 2: Create Backend .env File
Create `backend/.env` with this content:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Local MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/peerchain

# JWT Secret (generate a strong secret)
JWT_SECRET=peerchain-super-secret-jwt-key-2024-make-it-very-long-and-random
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

## Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

## Step 5: Test Database Connection

The server will automatically connect to MongoDB when started. You'll see:
```
🚀 PeerChain Backend Server running on port 3001
📧 Email service: Configured
🔗 Frontend URL: http://localhost:8081
🌍 Environment: development
MongoDB Connected: cluster0.abc123.mongodb.net
```

## Data Storage Structure

### Users Collection
```javascript
{
  _id: ObjectId,
  name: "Dr. John Smith",
  email: "john.smith@vitstudent.ac.in",
  password: "$2b$12$...", // bcrypt hashed
  institution: "VIT University",
  department: "Computer Science",
  researchArea: "blockchain",
  bio: "Researcher focused on...",
  socialLinks: {
    linkedin: "https://linkedin.com/in/johnsmith",
    github: "https://github.com/johnsmith",
    website: "https://johnsmith.vit.edu"
  },
  trustRating: 4.6,
  points: 1850,
  level: "Silver Tier",
  joinedDate: ISODate("2024-01-15T00:00:00.000Z"),
  verificationData: {
    scholarProfile: {
      name: "Dr. John Smith",
      email: "john.smith@vitstudent.ac.in",
      institution: "VIT University",
      verified: true,
      profileUrl: "https://scholar.google.com/citations?user=johnsmith123",
      citations: 1250,
      hIndex: 15,
      verifiedAt: ISODate("2024-01-20T10:30:00.000Z")
    },
    emailVerified: true,
    completedAt: ISODate("2024-01-20T10:30:00.000Z")
  },
  dailyActivity: [
    { date: "2024-01-15", contributions: 5 },
    { date: "2024-01-16", contributions: 3 }
  ],
  chatRequests: [],
  sentRequests: [],
  isActive: true,
  lastLogin: ISODate("2024-01-20T10:30:00.000Z"),
  createdAt: ISODate("2024-01-15T00:00:00.000Z"),
  updatedAt: ISODate("2024-01-20T10:30:00.000Z")
}
```

### OTPs Collection
```javascript
{
  _id: ObjectId,
  email: "john.smith@vitstudent.ac.in",
  otp: "123456",
  expiresAt: ISODate("2024-01-20T10:35:00.000Z"),
  attempts: 0,
  isUsed: false,
  type: "email_verification",
  createdAt: ISODate("2024-01-20T10:30:00.000Z"),
  updatedAt: ISODate("2024-01-20T10:30:00.000Z")
}
```

## Troubleshooting

### Connection Issues
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for development)
- Verify username/password in connection string
- Check network connectivity

### Local MongoDB Issues
- Ensure MongoDB service is running
- Check if port 27017 is available
- Verify MongoDB installation

### Database Not Creating
- Check connection string format
- Verify database permissions
- Check MongoDB logs for errors
