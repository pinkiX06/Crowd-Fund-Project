const express = require('express');
const Review = require('../models/Review');
const Business = require('../models/Business');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');
const { recalcRatings } = require('./reviews');

const router = express.Router();

router.get('/reviews', auth, adminOnly, async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status !== 'all') filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate('user', 'name email')
        .populate('business', 'name category')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments(filter),
    ]);

    res.json({
      reviews,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/reviews/:id/approve', auth, adminOnly, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', adminNote: req.body.adminNote || '' },
      { new: true }
    ).populate('user', 'name').populate('business', 'name');

    if (!review) return res.status(404).json({ message: 'Review not found' });

    await recalcRatings(review.business._id);
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/reviews/:id/reject', auth, adminOnly, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', adminNote: req.body.adminNote || '' },
      { new: true }
    ).populate('user', 'name').populate('business', 'name');

    if (!review) return res.status(404).json({ message: 'Review not found' });

    await recalcRatings(review.business._id);
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const [totalBusinesses, totalUsers, totalReviews, pendingReviews] = await Promise.all([
      Business.countDocuments(),
      User.countDocuments(),
      Review.countDocuments(),
      Review.countDocuments({ status: 'pending' }),
    ]);
    res.json({ totalBusinesses, totalUsers, totalReviews, pendingReviews });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
