const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/User');
const Charity = require('./models/Charity');
const Draw = require('./models/Draw');
const Winning = require('./models/Winning');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mers_score_db');
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await Charity.deleteMany();
    await Draw.deleteMany();
    await Winning.deleteMany();

    console.log('Existing data cleared.');

    // 1. Create Charities
    const charities = await Charity.insertMany([
      { name: 'Red Cross Golf Fund', description: 'Supporting global emergency relief through golf tournaments.' },
      { name: 'First Tee Explorers', description: 'Empowering kids and teens through the game of golf.' },
      { name: 'Greenway Preservation', description: 'Maintaining historical golf courses and preserving natural greenways.' }
    ]);
    console.log('Charities seeded.');

    // 2. Hash default password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    // 3. Create Admin User
    const admin = new User({
      name: 'Admin ACT',
      email: 'admin@digitalheroes.com',
      password: hashedPassword,
      role: 'admin',
      isSubscribed: true,
      plan: 'yearly',
      charity: charities[0]._id,
      charityContributionPercentage: 20
    });
    await admin.save();
    // console.log('Admin user seeded (admin@digitalheroes.com / password123)');

    // 4. Create Normal Test User
    const testUser = new User({
      name: 'Tiger Wood',
      email: 'user@test.com',
      password: hashedPassword,
      role: 'user',
      isSubscribed: true, // Subscribed so they can test scores immediately
      plan: 'monthly',
      charity: charities[1]._id,
      charityContributionPercentage: 15,
      scores: [
        { value: 34, date: new Date(Date.now() - 5 * 86400000) }, // 5 days ago
        { value: 41, date: new Date(Date.now() - 4 * 86400000) },
        { value: 29, date: new Date(Date.now() - 3 * 86400000) },
        { value: 38, date: new Date(Date.now() - 2 * 86400000) }
      ] // Only 4 scores, so user can add a 5th and see it live!
    });
    await testUser.save();
    // console.log('Test user seeded (user@test.com / password123)');

    console.log('Seeding Database Completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding completely failed', err);
    process.exit(1);
  }
};

seedDB();
