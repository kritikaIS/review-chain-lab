const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  paper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paper',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 2000
  },
  detailedFeedback: {
    type: String,
    maxlength: 5000
  },
  strengths: [String],
  weaknesses: [String],
  suggestions: [String],
  status: {
    type: String,
    enum: ['draft', 'submitted', 'accepted', 'rejected'],
    default: 'draft'
  },
  isAccepted: {
    type: Boolean,
    default: false
  },
  acceptedAt: Date,
  pointsAwarded: {
    type: Number,
    default: 0
  },
  isSaved: {
    type: Boolean,
    default: false
  },
  savedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
reviewSchema.index({ paper: 1, reviewer: 1 });
reviewSchema.index({ reviewer: 1, createdAt: -1 });
reviewSchema.index({ status: 1, isAccepted: 1 });

// Update updatedAt before saving
reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
