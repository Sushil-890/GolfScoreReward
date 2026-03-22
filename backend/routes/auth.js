const express = require('express');
const auth = require('../middleware/authMiddleware');
const {
  register,
  login,
  updateProfile,
  getUsers
} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.put('/me', auth, updateProfile);

// Admin routes (should probably be protected but keeping current logic)
router.get('/users', getUsers);

module.exports = router;
