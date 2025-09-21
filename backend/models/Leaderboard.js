const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  rankings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rank: {
      type: Number,
      required: true
    },
    totalPoints: {
      type: Number,
      required: true,
      default: 0
    },
    reviewsCompleted: {
      type: Number,
      default: 0
    },
    papersSubmitted: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    bonusPoints: {
      type: Number,
      default: 0
    }
  }],
  topPerformer: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    bonusPointsAwarded: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for month/year lookup
leaderboardSchema.index({ year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
