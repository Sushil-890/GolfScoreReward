const express = require('express');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const {
  simulateDraw,
  publishDraw,
  getLatestDraw,
  getAdminLatestDraw,
  getAdminHistory
} = require('../controllers/drawController');

const router = express.Router();

// Public routes
router.get('/latest', getLatestDraw);

// Admin routes (Protected by auth and isAdmin)
router.post('/simulate', auth, isAdmin, simulateDraw);
router.post('/publish/:id', auth, isAdmin, publishDraw);
router.get('/admin/latest', auth, isAdmin, getAdminLatestDraw);
router.get('/admin/history', auth, isAdmin, getAdminHistory);

module.exports = router;
