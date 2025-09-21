# 🎓 PeerChain - Academic Verification System

A comprehensive academic verification platform for VIT University students and researchers with two-step authentication, real-time email verification, and Google Scholar profile integration.

## 🌟 Features

### ✅ **Two-Step Academic Verification**
- **Google Scholar Profile Verification**: Real-time checking of Scholar profiles with VIT email verification
- **VIT Email OTP Verification**: Secure email-based verification with time-limited OTPs
- **Double Assurance Security**: Both verifications required for full platform access

### ✅ **Complete Authentication System**
- **User Registration**: VIT email validation and secure password hashing
- **JWT Authentication**: Secure token-based authentication
- **Session Management**: Persistent login with automatic token refresh
- **Password Security**: bcrypt hashing with salt rounds

### ✅ **Real Email Integration**
- **Gmail SMTP**: Professional email service with HTML templates
- **OTP System**: 6-digit codes with 5-minute expiration
- **Welcome Emails**: Automated onboarding emails
- **Rate Limiting**: Protection against spam and abuse

### ✅ **Advanced Profile Features**
- **GitHub-Style Activity Graph**: Daily contribution tracking
- **Social Profile Links**: LinkedIn, GitHub, personal websites
- **Points-Based Interaction**: Scholar connection system
- **Trust Rating System**: Academic credibility scoring

### ✅ **Modern Tech Stack**
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB + JWT
- **Email**: Nodemailer with Gmail SMTP
- **Web Scraping**: Cheerio for Google Scholar verification

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Gmail account for email service

### 1. Clone and Setup
```bash
git clone <repository-url>
cd review-chain-lab
npm install
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file (see setup-backend.md)
cp .env.example .env
# Edit .env with your configuration

# Start backend
npm run dev
```

### 3. Frontend Setup
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:3001/api" > .env

# Start frontend
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:8081
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/health

## 🔧 Configuration

### Backend Environment (.env)
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/peerchain
JWT_SECRET=your-super-secret-jwt-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:8081
```

### Frontend Environment (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 📱 User Flow

### 1. Registration
1. User provides VIT email (@vitstudent.ac.in)
2. System validates email format
3. Account created with secure password hashing
4. Welcome email sent automatically

### 2. Email Verification
1. User requests OTP to their VIT email
2. 6-digit OTP sent via Gmail SMTP
3. User enters OTP within 5 minutes
4. Email verification status updated

### 3. Google Scholar Verification
1. User provides Scholar profile URL
2. System scrapes profile data using Cheerio
3. Verifies "Verified email at vitstudent.ac.in"
4. Extracts citations, h-index, institution
5. Profile data stored and linked

### 4. Full Access
1. Both verifications complete
2. User gains access to all features
3. Can submit papers, review, connect with scholars
4. Points-based interaction system activated

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Verification
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/verify-scholar` - Verify Google Scholar profile

### System
- `GET /health` - Health check

## 🔒 Security Features

### Authentication Security
- JWT tokens with expiration
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- CORS protection

### Email Security
- Time-limited OTPs (5 minutes)
- Maximum 3 attempts per OTP
- Automatic OTP cleanup
- Rate limiting on email sending

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Secure headers with Helmet

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (VIT format),
  password: String (hashed),
  institution: String,
  department: String,
  researchArea: String,
  bio: String,
  socialLinks: Object,
  trustRating: Number,
  points: Number,
  level: String,
  verificationData: {
    scholarProfile: Object,
    emailVerified: Boolean,
    completedAt: Date
  }
}
```

### OTP Model
```javascript
{
  email: String,
  otp: String,
  expiresAt: Date,
  attempts: Number,
  isUsed: Boolean,
  type: String
}
```

## 🧪 Testing the System

### Test Registration
1. Use VIT email format: `test.student2024@vitstudent.ac.in`
2. Complete registration form
3. Check email for welcome message

### Test Email Verification
1. Click "Send OTP" in verification page
2. Check email for 6-digit code
3. Enter code to verify

### Test Scholar Verification
1. Use real Google Scholar URL: `https://scholar.google.com/citations?user=KSjD7pwAAAAJ`
2. System will scrape and verify profile
3. Check for VIT email verification in profile

## 🚨 Troubleshooting

### Common Issues

**Email Not Sending**
- Check Gmail app password
- Verify EMAIL_USER and EMAIL_PASS
- Check Gmail security settings

**Database Connection**
- Ensure MongoDB is running
- Check MONGODB_URI format
- Verify database permissions

**Scholar Verification Failing**
- Profile must be public
- Must show "Verified email at vitstudent.ac.in"
- Check network connectivity

**CORS Errors**
- Update FRONTEND_URL in backend .env
- Check VITE_API_URL in frontend .env

## 🔮 Future Enhancements

### Short-term
- Real-time notifications
- Advanced profile analytics
- Mobile app development
- Admin dashboard

### Long-term
- Multi-university support
- Blockchain integration
- AI-powered verification
- Global academic network

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact: support@peerchain.ac.in
- Documentation: [Link to docs]

---

**Built with ❤️ for the VIT University academic community**
