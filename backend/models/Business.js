const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['restaurant', 'shop', 'service', 'hotel', 'entertainment', 'health', 'education', 'other'],
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  phone: { type: String, default: '' },
  website: { type: String, default: '' },
  image: { type: String, default: '' },
  photos: [{ type: String }],
  ratings: {
    quality: { type: Number, default: 0 },
    service: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
    overall: { type: Number, default: 0 },
  },
  totalReviews: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

businessSchema.index({ name: 'text', description: 'text' });
businessSchema.index({ category: 1 });
businessSchema.index({ 'address.city': 1 });

module.exports = mongoose.model('Business', businessSchema);
