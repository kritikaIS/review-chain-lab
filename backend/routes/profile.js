const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Review = require('../models/Review');
const Paper = require('../models/Paper');
const Leaderboard = require('../models/Leaderboard');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user profile with real-time stats
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get real-time stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Get current month reviews
    const currentMonthReviews = await Review.find({
      reviewer: user._id,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Get current month papers submitted
    const currentMonthPapers = await Paper.find({
      submittedBy: user._id,
      submissionDate: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Get accepted reviews for bonus points
    const acceptedReviews = await Review.find({
      reviewer: user._id,
      isAccepted: true,
      acceptedAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const bonusPoints = acceptedReviews.reduce((sum, review) => sum + review.pointsAwarded, 0);

    // Calculate average rating received
    const averageRating = currentMonthReviews.length > 0 
      ? currentMonthReviews.reduce((sum, review) => sum + review.rating, 0) / currentMonthReviews.length 
      : 0;

    // Get current ranking
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const leaderboard = await Leaderboard.findOne({ 
      month: currentMonth, 
      year: currentYear 
    });

    let currentRank = null;
    if (leaderboard) {
      const userRanking = leaderboard.rankings.find(
        ranking => ranking.user.toString() === user._id.toString()
      );
      currentRank = userRanking ? userRanking.rank : null;
    }

    // Generate GitHub-style activity data
    const githubActivity = await generateGitHubActivity(user._id);

    // Update user's GitHub activity
    user.githubActivity = githubActivity;
    await user.save();

    res.json({
      success: true,
      data: {
        user: {
          ...user.toObject(),
          realTimeStats: {
            currentMonth: {
              reviewsCompleted: currentMonthReviews.length,
              papersSubmitted: currentMonthPapers.length,
              pointsEarned: user.monthlyStats.currentMonth.pointsEarned + bonusPoints,
              averageRating: averageRating,
              bonusPoints: bonusPoints
            },
            currentRank: currentRank,
            githubActivity: githubActivity
          }
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Get user profile by ID (public)
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get public stats
    const totalReviews = await Review.countDocuments({ reviewer: user._id });
    const totalPapers = await Paper.countDocuments({ submittedBy: user._id });
    const acceptedReviews = await Review.countDocuments({ 
      reviewer: user._id, 
      isAccepted: true 
    });

    res.json({
      success: true,
      data: {
        user: {
          ...user.toObject(),
          publicStats: {
            totalReviews,
            totalPapers,
            acceptedReviews,
            trustRating: user.trustRating,
            level: user.level
          }
        }
      }
    });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Update user profile
router.put('/me', auth, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('department').optional().trim(),
  body('researchArea').optional().trim(),
  body('socialLinks').optional().isObject()
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

    const { name, bio, department, researchArea, socialLinks } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (department) updateData.department = department;
    if (researchArea) updateData.researchArea = researchArea;
    if (socialLinks) updateData.socialLinks = socialLinks;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, select: '-password' }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Generate GitHub-style activity data
async function generateGitHubActivity(userId) {
  try {
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    
    // Get all reviews and papers from the last year
    const reviews = await Review.find({
      reviewer: userId,
      createdAt: { $gte: oneYearAgo }
    });

    const papers = await Paper.find({
      submittedBy: userId,
      submissionDate: { $gte: oneYearAgo }
    });

    // Create activity map
    const activityMap = new Map();
    
    // Process reviews
    reviews.forEach(review => {
      const date = review.createdAt.toISOString().split('T')[0];
      if (!activityMap.has(date)) {
        activityMap.set(date, { reviews: 0, papers: 0 });
      }
      activityMap.get(date).reviews++;
    });

    // Process papers
    papers.forEach(paper => {
      const date = paper.submissionDate.toISOString().split('T')[0];
      if (!activityMap.has(date)) {
        activityMap.set(date, { reviews: 0, papers: 0 });
      }
      activityMap.get(date).papers++;
    });

    // Generate 365 days of activity
    const contributions = [];
    for (let i = 364; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayActivity = activityMap.get(dateStr) || { reviews: 0, papers: 0 };
      const totalContributions = dayActivity.reviews + dayActivity.papers;
      
      // Determine color based on activity level
      let color = '#ebedf0'; // No activity
      if (totalContributions > 0) color = '#c6e48b'; // Low activity
      if (totalContributions > 2) color = '#7bc96f'; // Medium activity
      if (totalContributions > 4) color = '#239a3b'; // High activity
      if (totalContributions > 6) color = '#196127'; // Very high activity

      contributions.push({
        date: dateStr,
        count: totalContributions,
        color: color
      });
    }

    return {
      isActive: reviews.length > 0 || papers.length > 0,
      contributions,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Generate GitHub activity error:', error);
    return {
      isActive: false,
      contributions: [],
      lastUpdated: new Date()
    };
  }
}

// Get user's activity timeline
router.get('/me/activity', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Get recent reviews
    const reviews = await Review.find({ reviewer: req.user._id })
      .populate('paper', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get recent papers
    const papers = await Paper.find({ submittedBy: req.user._id })
      .sort({ submissionDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Combine and sort by date
    const activities = [
      ...reviews.map(review => ({
        type: 'review',
        data: review,
        date: review.createdAt
      })),
      ...papers.map(paper => ({
        type: 'paper',
        data: paper,
        date: paper.submissionDate
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: { activities }
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity'
    });
  }
});

module.exports = router;
