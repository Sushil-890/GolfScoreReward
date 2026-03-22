const express = require('express');
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const { storage } = require('../utils/cloudinary');
const {
  uploadProof,
  reviewWinning,
  getAllWinnings,
  getMyWinnings
} = require('../controllers/winningController');

const router = express.Router();

const upload = multer({ storage });

// User routes
router.get('/me', auth, getMyWinnings);
router.post('/upload-proof/:winningId', auth, upload.single('proof'), uploadProof);

// Admin routes
router.get('/admin/all', auth, isAdmin, getAllWinnings);
router.patch('/review/:winningId', auth, isAdmin, reviewWinning);

module.exports = router;
