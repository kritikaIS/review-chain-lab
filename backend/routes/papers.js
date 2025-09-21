const express = require('express');
const { body, validationResult } = require('express-validator');
const Paper = require('../models/Paper');
const Review = require('../models/Review');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Submit a new paper
router.post('/submit', auth, [
  body('title').trim().isLength({ min: 10 }).withMessage('Title must be at least 10 characters'),
  body('abstract').trim().isLength({ min: 50 }).withMessage('Abstract must be at least 50 characters'),
  body('authors').isArray({ min: 1 }).withMessage('At least one author is required'),
  body('keywords').isArray({ min: 1 }).withMessage('At least one keyword is required'),
  body('category').isIn(['Computer Science', 'Engineering', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Medicine', 'Other']).withMessage('Invalid category')
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

    const { title, abstract, authors, keywords, category, doi, pdfUrl } = req.body;

    const paper = new Paper({
      title,
      abstract,
      authors,
      keywords,
      category,
      doi,
      pdfUrl,
      submittedBy: req.user._id
    });

    await paper.save();

    // Update user's paper submission count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 
        'monthlyStats.currentMonth.papersSubmitted': 1,
        'papersSubmitted': 1
      }
    });

    res.status(201).json({
      success: true,
      message: 'Paper submitted successfully',
      data: { paper }
    });
  } catch (error) {
    console.error('Paper submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit paper'
    });
  }
});

// Get all papers with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const status = req.query.status;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const papers = await Paper.find(filter)
      .populate('submittedBy', 'name email institution')
      .populate('reviews')
      .sort({ submissionDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Paper.countDocuments(filter);

    res.json({
      success: true,
      data: {
        papers,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get papers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch papers'
    });
  }
});

// Get paper by ID with reviews
router.get('/:id', async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id)
      .populate('submittedBy', 'name email institution')
      .populate({
        path: 'reviews',
        populate: {
          path: 'reviewer',
          select: 'name email institution trustRating'
        }
      });

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    res.json({
      success: true,
      data: { paper }
    });
  } catch (error) {
    console.error('Get paper error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch paper'
    });
  }
});

// Submit a review for a paper
router.post('/:id/review', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 10 }).withMessage('Comment must be at least 10 characters'),
  body('detailedFeedback').optional().trim(),
  body('strengths').optional().isArray(),
  body('weaknesses').optional().isArray(),
  body('suggestions').optional().isArray()
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

    const paperId = req.params.id;
    const { rating, comment, detailedFeedback, strengths, weaknesses, suggestions } = req.body;

    // Check if paper exists
    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Check if user already reviewed this paper
    const existingReview = await Review.findOne({ paper: paperId, reviewer: req.user._id });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this paper'
      });
    }

    // Create review
    const review = new Review({
      paper: paperId,
      reviewer: req.user._id,
      rating,
      comment,
      detailedFeedback,
      strengths,
      weaknesses,
      suggestions,
      status: 'submitted'
    });

    await review.save();

    // Update paper with new review
    await Paper.findByIdAndUpdate(paperId, {
      $push: { reviews: review._id },
      $inc: { totalReviews: 1 }
    });

    // Calculate new average rating
    const allReviews = await Review.find({ paper: paperId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Paper.findByIdAndUpdate(paperId, { averageRating: avgRating });

    // Update user's review count and points
    const pointsEarned = rating * 10; // 10 points per rating point
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 
        'monthlyStats.currentMonth.reviewsCompleted': 1,
        'monthlyStats.currentMonth.pointsEarned': pointsEarned,
        'reviewsCompleted': 1,
        'points': pointsEarned
      }
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review'
    });
  }
});

// Save a review (mark as saved)
router.post('/:paperId/review/:reviewId/save', auth, async (req, res) => {
  try {
    const { paperId, reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId, paper: paperId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is the reviewer
    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only save your own reviews'
      });
    }

    review.isSaved = true;
    review.savedAt = new Date();
    await review.save();

    res.json({
      success: true,
      message: 'Review saved successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Save review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save review'
    });
  }
});

// Accept a review (award bonus points)
router.post('/:paperId/review/:reviewId/accept', auth, async (req, res) => {
  try {
    const { paperId, reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId, paper: paperId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is the paper submitter
    const paper = await Paper.findById(paperId);
    if (paper.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the paper submitter can accept reviews'
      });
    }

    if (review.isAccepted) {
      return res.status(400).json({
        success: false,
        message: 'Review already accepted'
      });
    }

    review.isAccepted = true;
    review.acceptedAt = new Date();
    review.pointsAwarded = review.rating * 15; // Bonus points for acceptance
    await review.save();

    // Award bonus points to reviewer
    await User.findByIdAndUpdate(review.reviewer, {
      $inc: { 
        'monthlyStats.currentMonth.pointsEarned': review.pointsAwarded,
        'points': review.pointsAwarded
      }
    });

    res.json({
      success: true,
      message: 'Review accepted successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Accept review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept review'
    });
  }
});

module.exports = router;
