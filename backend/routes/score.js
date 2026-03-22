const express = require('express');
const auth = require('../middleware/authMiddleware');
const { getMyScores, addScore } = require('../controllers/scoreController');

const router = express.Router();

router.get('/me', auth, getMyScores);
router.post('/', auth, addScore);

module.exports = router;
