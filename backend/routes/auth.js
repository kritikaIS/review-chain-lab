const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { generateToken, auth } = require('../middleware/auth');
const emailService = require('../services/emailService');
const scholarService = require('../services/scholarService');

const router = express.Router();

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.'
  }
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // 3 OTP requests per window
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, institution, department, researchArea, bio, socialLinks } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      institution: institution || 'VIT University',
      department,
      researchArea,
      bio,
      socialLinks
    });

    await user.save();

    // Send welcome email
    await emailService.sendWelcomeEmail(email, name);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          institution: user.institution,
          department: user.department,
          researchArea: user.researchArea,
          bio: user.bio,
          socialLinks: user.socialLinks,
          trustRating: user.trustRating,
          points: user.points,
          level: user.level,
          joinedDate: user.joinedDate,
          verificationData: user.verificationData
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
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

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          institution: user.institution,
          department: user.department,
          researchArea: user.researchArea,
          bio: user.bio,
          socialLinks: user.socialLinks,
          trustRating: user.trustRating,
          points: user.points,
          level: user.level,
          joinedDate: user.joinedDate,
          verificationData: user.verificationData
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
