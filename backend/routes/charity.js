const express = require('express');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const { getCharities, createCharity } = require('../controllers/charityController');

const router = express.Router();

// Public routes
router.get('/', getCharities);

// Admin routes
router.post('/', auth, isAdmin, createCharity);

module.exports = router;
