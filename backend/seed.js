const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Business = require('./models/Business');
const Review = require('./models/Review');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Business.deleteMany({});
  await Review.deleteMany({});
  console.log('Cleared existing data');

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@crowdreview.com',
    password: 'admin123',
    role: 'admin',
  });

  const users = await User.create([
    { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123' },
    { name: 'Bob Smith', email: 'bob@example.com', password: 'password123' },
    { name: 'Carol Davis', email: 'carol@example.com', password: 'password123' },
  ]);

  const businesses = await Business.create([
    {
      name: 'The Golden Spoon',
      description: 'A fine dining restaurant serving contemporary American cuisine with locally sourced ingredients. Known for their seasonal tasting menus and extensive wine collection.',
      category: 'restaurant',
      address: { street: '123 Main St', city: 'Seattle', state: 'WA', zipCode: '98101' },
      phone: '(206) 555-0101',
      website: 'https://goldenspoon.example.com',
      createdBy: admin._id,
    },
    {
      name: 'Tech Haven',
      description: 'Your one-stop shop for electronics, gadgets, and tech accessories. Expert staff ready to help you find the perfect device.',
      category: 'shop',
      address: { street: '456 Oak Ave', city: 'Seattle', state: 'WA', zipCode: '98102' },
      phone: '(206) 555-0202',
      website: 'https://techhaven.example.com',
      createdBy: admin._id,
    },
    {
      name: 'Sparkle Clean',
      description: 'Professional cleaning services for homes and offices. Eco-friendly products, reliable scheduling, and satisfaction guaranteed.',
      category: 'service',
      address: { street: '789 Pine Rd', city: 'Portland', state: 'OR', zipCode: '97201' },
      phone: '(503) 555-0303',
      createdBy: admin._id,
    },
    {
      name: 'Mountain View Hotel',
      description: 'Luxury boutique hotel with stunning mountain views. Features spa, pool, and farm-to-table restaurant on premises.',
      category: 'hotel',
      address: { street: '321 Summit Dr', city: 'Bend', state: 'OR', zipCode: '97701' },
      phone: '(541) 555-0404',
      website: 'https://mountainviewhotel.example.com',
      createdBy: admin._id,
    },
    {
      name: 'Sunrise Bakery',
      description: 'Artisan bakery specializing in sourdough bread, French pastries, and custom cakes. Fresh baked daily since 1998.',
      category: 'restaurant',
      address: { street: '567 Baker Ln', city: 'Seattle', state: 'WA', zipCode: '98103' },
      phone: '(206) 555-0505',
      createdBy: admin._id,
    },
    {
      name: 'FitLife Gym',
      description: 'State-of-the-art fitness center with personal training, group classes, and a heated pool. Open 24/7 for your convenience.',
      category: 'health',
      address: { street: '890 Fitness Blvd', city: 'Portland', state: 'OR', zipCode: '97202' },
      phone: '(503) 555-0606',
      website: 'https://fitlifegym.example.com',
      createdBy: admin._id,
    },
  ]);

  const reviewsData = [
    {
      business: businesses[0]._id, user: users[0]._id,
      title: 'Absolutely phenomenal dining experience',
      content: 'The tasting menu was incredible. Every course was thoughtfully prepared with amazing flavors. The wine pairing was perfect. Service was attentive without being intrusive. Will definitely return!',
      ratings: { quality: 5, service: 5, value: 4 },
      status: 'approved',
    },
    {
      business: businesses[0]._id, user: users[1]._id,
      title: 'Great food, a bit pricey',
      content: 'The food quality is outstanding and the ambiance is beautiful. My only complaint is the portions could be larger for the price. The desserts were the highlight of the meal.',
      ratings: { quality: 5, service: 4, value: 3 },
      status: 'approved',
    },
    {
      business: businesses[1]._id, user: users[0]._id,
      title: 'Best tech store in the area',
      content: 'Amazing selection and the staff really knows their stuff. They helped me find the perfect laptop for my needs and didn\'t try to upsell. Prices are competitive with online retailers.',
      ratings: { quality: 5, service: 5, value: 4 },
      status: 'approved',
    },
    {
      business: businesses[1]._id, user: users[2]._id,
      title: 'Good selection but could improve',
      content: 'Nice variety of products but the store layout is a bit confusing. Had to ask for help finding accessories. Return policy is generous though.',
      ratings: { quality: 4, service: 3, value: 4 },
      status: 'approved',
    },
    {
      business: businesses[2]._id, user: users[1]._id,
      title: 'Reliable and thorough cleaning',
      content: 'Have been using Sparkle Clean for 6 months now. They are always on time, thorough, and use eco-friendly products which I love. My home has never been cleaner!',
      ratings: { quality: 5, service: 5, value: 5 },
      status: 'approved',
    },
    {
      business: businesses[3]._id, user: users[2]._id,
      title: 'Perfect weekend getaway',
      content: 'The views are breathtaking and the rooms are beautifully appointed. The spa was relaxing and the restaurant served some of the best food we had in Oregon. Highly recommend!',
      ratings: { quality: 5, service: 4, value: 4 },
      status: 'approved',
    },
    {
      business: businesses[4]._id, user: users[0]._id,
      title: 'Best sourdough in Seattle',
      content: 'Their sourdough bread is to die for - perfectly crusty outside and soft inside. The croissants are also excellent. Gets busy on weekends so arrive early!',
      ratings: { quality: 5, service: 4, value: 5 },
      status: 'approved',
    },
    {
      business: businesses[5]._id, user: users[1]._id,
      title: 'Waiting for approval',
      content: 'Great gym with modern equipment. The personal trainers are knowledgeable. This review is pending admin approval.',
      ratings: { quality: 4, service: 4, value: 3 },
      status: 'pending',
    },
    {
      business: businesses[3]._id, user: users[0]._id,
      title: 'Another pending review',
      content: 'Lovely hotel, will write more details soon. This review is pending admin approval.',
      ratings: { quality: 4, service: 5, value: 3 },
      status: 'pending',
    },
  ];

  await Review.create(reviewsData);

  for (const biz of businesses) {
    const approved = reviewsData.filter((r) => r.business.equals(biz._id) && r.status === 'approved');
    if (approved.length > 0) {
      const sum = approved.reduce(
        (acc, r) => ({
          quality: acc.quality + r.ratings.quality,
          service: acc.service + r.ratings.service,
          value: acc.value + r.ratings.value,
        }),
        { quality: 0, service: 0, value: 0 }
      );
      const n = approved.length;
      const quality = +(sum.quality / n).toFixed(1);
      const service = +(sum.service / n).toFixed(1);
      const value = +(sum.value / n).toFixed(1);
      const overall = +((quality + service + value) / 3).toFixed(1);
      await Business.findByIdAndUpdate(biz._id, {
        ratings: { quality, service, value, overall },
        totalReviews: n,
      });
    }
  }

  console.log('\nSeed completed successfully!');
  console.log('----------------------------');
  console.log('Admin login:  admin@crowdreview.com / admin123');
  console.log('User logins:  alice@example.com / password123');
  console.log('              bob@example.com / password123');
  console.log('              carol@example.com / password123');
  console.log(`\n${businesses.length} businesses, ${users.length + 1} users, ${reviewsData.length} reviews created`);
  console.log(`${reviewsData.filter((r) => r.status === 'pending').length} reviews pending approval`);

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
