const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/score');
const drawRoutes = require('./routes/draw');
const charityRoutes = require('./routes/charity');
const subRoutes = require('./routes/subscription');
const winningRoutes = require('./routes/winning');
const announcementRoutes = require('./routes/announcement');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Database connection - cached for serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false
    });
    isConnected = true;
    console.log('MongoDB connection SUCCESS');
  } catch (err) {
    console.error('MongoDB connection FAIL', err);
    throw err;
  }
};

// Ensure DB connected before every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/draws', drawRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/subscriptions', subRoutes);
app.use('/api/winnings', winningRoutes);
app.use('/api/announcements', announcementRoutes);

// Export for Vercel serverless
module.exports = app;

// Local dev only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
