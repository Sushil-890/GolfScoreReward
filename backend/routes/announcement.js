const express = require('express');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');

const router = express.Router();

// GET all announcements (Any authenticated user can read)
router.get('/', auth, getAnnouncements);

// POST new announcement (Admin only)
router.post('/', auth, isAdmin, createAnnouncement);

// PUT update an announcement (Admin only)
router.put('/:id', auth, isAdmin, updateAnnouncement);

// DELETE an announcement (Admin only)
router.delete('/:id', auth, isAdmin, deleteAnnouncement);

module.exports = router;
