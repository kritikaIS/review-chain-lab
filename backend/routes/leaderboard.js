const express = require('express');
const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');
const Review = require('../models/Review');
const Paper = require('../models/Paper');

const router = express.Router();

// Get current month leaderboard
router.get('/current', async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    let leaderboard = await Leaderboard.findOne({ 
      month: currentMonth, 
      year: currentYear 
    });

    if (!leaderboard) {
      // Generate leaderboard if it doesn't exist
      leaderboard = await generateMonthlyLeaderboard(currentMonth, currentYear);
    }

    // Populate user details
    await leaderboard.populate('rankings.user', 'name email institution trustRating points level');

    res.json({
      success: true,
      data: { leaderboard }
    });
  } catch (error) {
    console.error('Get current leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard'
    });
  }
});

// Get leaderboard for specific month/year
router.get('/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        message: 'Invalid month'
      });
    }

    let leaderboard = await Leaderboard.findOne({ 
      month: monthNum, 
      year: yearNum 
    });

    if (!leaderboard) {
      return res.status(404).json({
        success: false,
        message: 'Leaderboard not found for this month/year'
      });
    }

    // Populate user details
    await leaderboard.populate('rankings.user', 'name email institution trustRating points level');

    res.json({
      success: true,
      data: { leaderboard }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard'
    });
  }
});

// Generate monthly leaderboard
async function generateMonthlyLeaderboard(month, year) {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Get all users with their monthly stats
    const users = await User.find({}).select('name email institution trustRating points monthlyStats');

    const rankings = [];

    for (const user of users) {
      // Get reviews completed this month
      const reviewsCompleted = await Review.countDocuments({
        reviewer: user._id,
        createdAt: { $gte: startDate, $lte: endDate }
      });

      // Get papers submitted this month
      const papersSubmitted = await Paper.countDocuments({
        submittedBy: user._id,
        submissionDate: { $gte: startDate, $lte: endDate }
      });

      // Get accepted reviews (bonus points)
      const acceptedReviews = await Review.find({
        reviewer: user._id,
        isAccepted: true,
        acceptedAt: { $gte: startDate, $lte: endDate }
      });

      const bonusPoints = acceptedReviews.reduce((sum, review) => sum + review.pointsAwarded, 0);

      // Calculate total points for the month
      const totalPoints = user.monthlyStats.currentMonth.pointsEarned + bonusPoints;

      // Calculate average rating received
      const userReviews = await Review.find({
        reviewer: user._id,
        createdAt: { $gte: startDate, $lte: endDate }
      });

      const averageRating = userReviews.length > 0 
        ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length 
        : 0;

      rankings.push({
        user: user._id,
        totalPoints,
        reviewsCompleted,
        papersSubmitted,
        averageRating,
        bonusPoints
      });
    }

    // Sort by total points (descending)
    rankings.sort((a, b) => b.totalPoints - a.totalPoints);

    // Add rank numbers
    rankings.forEach((ranking, index) => {
      ranking.rank = index + 1;
    });

    // Award bonus points to top performer
    const topPerformer = rankings[0];
    const topPerformerBonus = 100; // 100 bonus points for top performer

    if (topPerformer) {
      // Update top performer's points
      await User.findByIdAndUpdate(topPerformer.user, {
        $inc: { points: topPerformerBonus }
      });

      topPerformer.bonusPoints += topPerformerBonus;
    }

    // Create leaderboard document
    const leaderboard = new Leaderboard({
      month,
      year,
      rankings,
      topPerformer: topPerformer ? {
        user: topPerformer.user,
        bonusPointsAwarded: topPerformerBonus
      } : null
    });

    await leaderboard.save();
    return leaderboard;
  } catch (error) {
    console.error('Generate leaderboard error:', error);
    throw error;
  }
}

// Get user's ranking in current month
router.get('/user/:userId/current', async (req, res) => {
  try {
    const { userId } = req.params;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const leaderboard = await Leaderboard.findOne({ 
      month: currentMonth, 
      year: currentYear 
    });

    if (!leaderboard) {
      return res.status(404).json({
        success: false,
        message: 'Current month leaderboard not found'
      });
    }

    const userRanking = leaderboard.rankings.find(
      ranking => ranking.user.toString() === userId
    );

    if (!userRanking) {
      return res.status(404).json({
        success: false,
        message: 'User not found in current leaderboard'
      });
    }

    res.json({
      success: true,
      data: { 
        ranking: userRanking,
        totalParticipants: leaderboard.rankings.length
      }
    });
  } catch (error) {
    console.error('Get user ranking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user ranking'
    });
  }
});

// Trigger leaderboard generation (admin endpoint)
router.post('/generate/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        message: 'Invalid month'
      });
    }

    // Check if leaderboard already exists
    const existingLeaderboard = await Leaderboard.findOne({ 
      month: monthNum, 
      year: yearNum 
    });

    if (existingLeaderboard) {
      return res.status(400).json({
        success: false,
        message: 'Leaderboard already exists for this month/year'
      });
    }

    const leaderboard = await generateMonthlyLeaderboard(monthNum, yearNum);

    res.json({
      success: true,
      message: 'Leaderboard generated successfully',
      data: { leaderboard }
    });
  } catch (error) {
    console.error('Generate leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate leaderboard'
    });
  }
});

module.exports = router;
