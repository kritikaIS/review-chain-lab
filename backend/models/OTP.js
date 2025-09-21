const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  otp: {
    type: String,
    required: true,
    length: 6
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['email_verification', 'password_reset'],
    default: 'email_verification'
  }
}, {
  timestamps: true
});

// Index for automatic cleanup of expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to generate OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function(email, otp) {
  const otpRecord = await this.findOne({
    email,
    otp,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  });

  if (!otpRecord) {
    return { success: false, message: 'Invalid or expired OTP' };
  }

  if (otpRecord.attempts >= 3) {
    return { success: false, message: 'Maximum attempts exceeded' };
  }

  // Mark as used
  otpRecord.isUsed = true;
  await otpRecord.save();

  return { success: true, message: 'OTP verified successfully' };
};

module.exports = mongoose.model('OTP', otpSchema);
