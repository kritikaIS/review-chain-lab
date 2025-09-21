const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { generateToken, auth } = require('../middleware/auth');
const emailService = require('../services/emailService');
const scholarService = require('../services/scholarService');

const router = express.Router();

// Rate limiting - more lenient for development
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increased limit for development
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.'
  }
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Increased limit for development
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again later.'
  }
});

// Register
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().matches(/^[a-zA-Z0-9._%+-]+@vitstudent\.ac\.in$/).withMessage('Must be a valid VIT email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('institution').optional().trim(),
  body('department').optional().trim(),
  body('researchArea').optional().trim(),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters')
], async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, institution, department, researchArea, bio, socialLinks } = req.body;

    // Mock registration - don't actually save to database
    console.log('Mock registration for:', email);

    // Generate a mock user ID and token
    const mockUserId = 'mock_' + Date.now();
    const token = generateToken(mockUserId);

    res.status(201).json({
      success: true,
      message: 'User registered successfully (Mock Mode)',
      data: {
        user: {
          id: mockUserId,
          name: name,
          email: email,
          institution: institution || 'VIT University',
          department: department || 'Computer Science',
          researchArea: researchArea || 'Blockchain',
          bio: bio || 'Researcher focused on blockchain technology and distributed systems. Passionate about improving academic peer review processes through technology.',
          socialLinks: socialLinks || {
            linkedin: 'https://linkedin.com/in/mockuser',
            github: 'https://github.com/mockuser',
            website: 'https://mockuser.vit.edu'
          },
          trustRating: 4.6,
          papersSubmitted: 8,
          reviewsCompleted: 24,
          walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
          points: 1850,
          level: 'Silver Tier',
          joinedDate: new Date().toISOString(),
          dailyActivity: [
            { date: '2025-09-21', contributions: 3, reviewsCompleted: 2, papersSubmitted: 1, pointsEarned: 50 },
            { date: '2025-09-20', contributions: 2, reviewsCompleted: 1, papersSubmitted: 0, pointsEarned: 25 },
            { date: '2025-09-19', contributions: 4, reviewsCompleted: 3, papersSubmitted: 1, pointsEarned: 75 }
          ],
          chatRequests: [],
          sentRequests: [],
          verificationData: {
            emailVerified: true,
            completedAt: new Date().toISOString()
          }
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login
router.post('/login', authLimiter, [
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Mock login - accept any VIT email with any password
    if (!email.includes('@vitstudent.ac.in')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('Mock login for:', email);
    
    // Generate mock user data
    const mockUserId = 'mock_' + Date.now();
    const token = generateToken(mockUserId);

    res.json({
      success: true,
      message: 'Login successful (Mock Mode)',
      data: {
        user: {
          id: mockUserId,
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: email,
          institution: 'VIT University',
          department: 'Computer Science',
          researchArea: 'Blockchain',
          bio: 'Researcher focused on blockchain technology and distributed systems. Passionate about improving academic peer review processes through technology.',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/mockuser',
            github: 'https://github.com/mockuser',
            website: 'https://mockuser.vit.edu'
          },
          trustRating: 4.6,
          papersSubmitted: 8,
          reviewsCompleted: 24,
          walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
          points: 1850,
          level: 'Silver Tier',
          joinedDate: new Date().toISOString(),
          dailyActivity: [
            { date: '2025-09-21', contributions: 3, reviewsCompleted: 2, papersSubmitted: 1, pointsEarned: 50 },
            { date: '2025-09-20', contributions: 2, reviewsCompleted: 1, papersSubmitted: 0, pointsEarned: 25 },
            { date: '2025-09-19', contributions: 4, reviewsCompleted: 3, papersSubmitted: 1, pointsEarned: 75 }
          ],
          chatRequests: [],
          sentRequests: [],
          verificationData: {
            emailVerified: true,
            completedAt: new Date().toISOString()
          }
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

// Send OTP for email verification
router.post('/send-otp', otpLimiter, [
  body('email').isEmail().matches(/^[a-zA-Z0-9._%+-]+@vitstudent\.ac\.in$/).withMessage('Must be a valid VIT email address')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate OTP
    const otp = OTP.generateOTP();

    // Save OTP to database
    const otpRecord = new OTP({
      email,
      otp,
      type: 'email_verification'
    });
    await otpRecord.save();

    // Send OTP via email
    const emailResult = await emailService.sendOTP(email, otp, 'verification');
    
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.'
      });
    }

    res.json({
      success: true,
      message: 'OTP sent successfully to your VIT email address'
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.'
    });
  }
});

// Verify OTP
router.post('/verify-otp', [
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, otp } = req.body;

    // Verify OTP
    const verificationResult = await OTP.verifyOTP(email, otp);
    
    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        message: verificationResult.message
      });
    }

    // Update user verification status
    const user = await User.findOne({ email });
    if (user) {
      user.verificationData = {
        ...user.verificationData,
        emailVerified: true,
        completedAt: new Date()
      };
      await user.save();
    }

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed. Please try again.'
    });
  }
});

// Verify Google Scholar profile
router.post('/verify-scholar', auth, [
  body('profileUrl').isURL().withMessage('Must be a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { profileUrl } = req.body;
    const userId = req.user._id;

    // Verify Scholar profile
    const verificationResult = await scholarService.verifyScholarProfile(profileUrl);
    
    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        message: verificationResult.error
      });
    }

    // Update user verification data
    const user = await User.findById(userId);
    if (user) {
      user.verificationData = {
        ...user.verificationData,
        scholarProfile: verificationResult.profile,
        completedAt: new Date()
      };
      await user.save();
    }

    res.json({
      success: true,
      message: 'Google Scholar profile verified successfully',
      data: {
        profile: verificationResult.profile
      }
    });
  } catch (error) {
    console.error('Scholar verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Scholar verification failed. Please try again.'
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          institution: req.user.institution,
          department: req.user.department,
          researchArea: req.user.researchArea,
          bio: req.user.bio,
          socialLinks: req.user.socialLinks,
          trustRating: req.user.trustRating,
          points: req.user.points,
          level: req.user.level,
          joinedDate: req.user.joinedDate,
          verificationData: req.user.verificationData
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

module.exports = router;
