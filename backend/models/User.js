const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@vitstudent\.ac\.in$/, 'Please provide a valid VIT email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  institution: {
    type: String,
    default: 'VIT University'
  },
  department: {
    type: String,
    trim: true
  },
  researchArea: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: 500
  },
  socialLinks: {
    linkedin: String,
    github: String,
    website: String
  },
  trustRating: {
    type: Number,
    default: 3.0,
    min: 0,
    max: 5
  },
  papersSubmitted: {
    type: Number,
    default: 0
  },
  reviewsCompleted: {
    type: Number,
    default: 0
  },
  walletAddress: {
    type: String,
    unique: true,
    sparse: true
  },
  points: {
    type: Number,
    default: 100
  },
  level: {
    type: String,
    default: 'Bronze Tier',
    enum: ['Bronze Tier', 'Silver Tier', 'Gold Tier', 'Platinum Tier', 'Diamond Tier']
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  dailyActivity: [{
    date: String,
    contributions: Number
  }],
  verificationData: {
    scholarProfile: {
      name: String,
      email: String,
      institution: String,
      verified: Boolean,
      profileUrl: String,
      citations: Number,
      hIndex: Number,
      verifiedAt: Date
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate wallet address if not exists
userSchema.pre('save', function(next) {
  if (!this.walletAddress) {
    this.walletAddress = '0x' + Math.random().toString(16).substr(2, 40);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
