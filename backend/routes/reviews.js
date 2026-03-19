const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Business = require('../models/Business');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

async function recalcRatings(businessId) {
  const reviews = await Review.find({ business: businessId, status: 'approved' });
  if (reviews.length === 0) {
    await Business.findByIdAndUpdate(businessId, {
      ratings: { quality: 0, service: 0, value: 0, overall: 0 },
      totalReviews: 0,
    });
    return;
  }
  const sum = reviews.reduce(
    (acc, r) => ({
      quality: acc.quality + r.ratings.quality,
      service: acc.service + r.ratings.service,
      value: acc.value + r.ratings.value,
    }),
    { quality: 0, service: 0, value: 0 }
  );
  const n = reviews.length;
  const quality = +(sum.quality / n).toFixed(1);
  const service = +(sum.service / n).toFixed(1);
  const value = +(sum.value / n).toFixed(1);
  const overall = +((quality + service + value) / 3).toFixed(1);

  await Business.findByIdAndUpdate(businessId, {
    ratings: { quality, service, value, overall },
    totalReviews: n,
  });
}

router.get('/business/:businessId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const filter = { business: req.params.businessId, status: 'approved' };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      Review.find(filter).populate('user', 'name avatar').sort('-createdAt').skip(skip).limit(parseInt(limit)),
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

router.get('/my', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('business', 'name category')
      .sort('-createdAt');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post(
  '/',
  auth,
  upload.array('photos', 5),
  [
    body('business').notEmpty().withMessage('Business ID is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Review content is required'),
    body('ratings.quality').isInt({ min: 1, max: 5 }),
    body('ratings.service').isInt({ min: 1, max: 5 }),
    body('ratings.value').isInt({ min: 1, max: 5 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const businessExists = await Business.findById(req.body.business);
      if (!businessExists) return res.status(404).json({ message: 'Business not found' });

      const existingReview = await Review.findOne({ business: req.body.business, user: req.user._id });
      if (existingReview) return res.status(400).json({ message: 'You already reviewed this business' });

      const photos = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

      const review = await Review.create({
        business: req.body.business,
        user: req.user._id,
        title: req.body.title,
        content: req.body.content,
        ratings: {
          quality: parseInt(req.body.ratings.quality),
          service: parseInt(req.body.ratings.service),
          value: parseInt(req.body.ratings.value),
        },
        photos,
      });

      const populated = await review.populate('user', 'name avatar');
      res.status(201).json(populated);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = { router, recalcRatings };
