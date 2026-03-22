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
const allowedOrigins = [
  process.env.FRONTEND_URL, 
  process.env.FRONTEND_URL_PROD,
  'http://localhost:5173' // Hardcoded fallback for local dev
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

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
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connection SUCCESS');
  } catch (err) {
    console.error('MongoDB connection FAIL', err);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
