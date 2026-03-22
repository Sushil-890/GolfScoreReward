const express = require('express');
const auth = require('../middleware/authMiddleware');
const {
  createCheckoutSession,
  verifySession,
  cancelSubscription
} = require('../controllers/subscriptionController');

const router = express.Router();

router.post('/create-checkout-session', auth, createCheckoutSession);
router.post('/verify-session', auth, verifySession);
router.post('/cancel', auth, cancelSubscription);

module.exports = router;
