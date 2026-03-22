const Stripe = require('stripe');
const User = require('../models/User');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

// @desc Create checkout session
// @route POST /api/subscription/create-checkout-session
exports.createCheckoutSession = async (req, res) => {
  const { plan } = req.body; // 'monthly' or 'yearly'
  
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Mock response if no genuine Stripe key
    if (!process.env.STRIPE_SECRET_KEY) {
      // Direct MVP mock
      user.isSubscribed = true;
      user.plan = plan;
      // Sets one month from now
      user.renewalDate = new Date(new Date().setMonth(new Date().getMonth() + (plan === 'yearly' ? 12 : 1)));
      await user.save();
      return res.json({ url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?success=true`, mocked: true });
    }

    // Real stripe implementation logic reference
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Golf Platform - ${plan} plan` },
          recurring: { interval: plan === 'yearly' ? 'year' : 'month' },
          unit_amount: plan === 'yearly' ? 10000 : 1000, 
        },
        quantity: 1,
      }],
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/subscribe`,
      client_reference_id: req.user.id,
      metadata: { plan, userId: req.user.id }
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Verify session and fulfill subscription
// @route POST /api/subscription/verify-session
exports.verifySession = async (req, res) => {
  const { sessionId } = req.body;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === 'paid') {
      const userId = session.metadata.userId;
      const plan = session.metadata.plan;
      
      const user = await User.findById(userId);
      user.isSubscribed = true;
      user.plan = plan;
      user.stripeSubscriptionId = session.subscription;
      user.renewalDate = new Date(new Date().setMonth(new Date().getMonth() + (plan === 'yearly' ? 12 : 1)));
      await user.save();
      
      res.json({ success: true, message: 'Subscription activated' });
    } else {
      res.status(400).json({ success: false, message: 'Payment not completed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Cancellation of subscription
// @route POST /api/subscription/cancel
exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.isSubscribed = false;
    user.plan = 'none';
    await user.save();
    res.json({ message: 'Subscription cancelled' });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};
