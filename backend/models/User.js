const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  value: { type: Number, min: 1, max: 45, required: true },
  date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: true,
    minlength: [8, 'Password must be at least 8 characters long'],
    validate: {
      validator: function(v) {
        // Only validate if it doesn't look like a bcrypt hash (starts with $2b$)
        if (v.startsWith('$2b$')) return true;
        return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(v);
      },
      message: 'Password must contain at least one alphabet, one number, and one special character.'
    }
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  // Subscription Engine
  isSubscribed: { type: Boolean, default: false }, // Should be false until they pay
  stripeSubscriptionId: { type: String }, // Link to Stripe
  plan: { type: String, enum: ['monthly', 'yearly', 'none'], default: 'none' },
  renewalDate: { type: Date },
  
  scores: [scoreSchema],
  
  // Charity Integration
  charity: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity' },
  charityContributionPercentage: { type: Number, min: 10, max: 100, default: 10 },
  
  // Dashboard Tracking
  totalWon: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
