const express = require('express');
const Business = require('../models/Business');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, city, search, page = 1, limit = 12, sort = '-createdAt' } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (city) filter['address.city'] = new RegExp(city, 'i');
    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [businesses, total] = await Promise.all([
      Business.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Business.countDocuments(filter),
    ]);

    res.json({
      businesses,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Business.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate('createdBy', 'name');
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.json(business);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    data.createdBy = req.user._id;
    const business = await Business.create(data);
    res.status(201).json(business);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const business = await Business.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.json(business);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const business = await Business.findByIdAndDelete(req.params.id);
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.json({ message: 'Business deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
