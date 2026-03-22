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

// Ensure DB is connected before every request (handles serverless cold starts)
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB reconnected');
    } catch (err) {
      console.error('MongoDB reconnect FAIL', err);
      return res.status(500).json({ message: 'Database connection failed' });
    }
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/draws', drawRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/subscriptions', subRoutes);
app.use('/api/winnings', winningRoutes);
app.use('/api/announcements', announcementRoutes);

// // Expose uploads directory statically for proof images (Not required as we now use Cloudinary)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false
    });
    console.log('MongoDB connection SUCCESS');
  } catch (err) {
    console.error('MongoDB connection FAIL', err);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
