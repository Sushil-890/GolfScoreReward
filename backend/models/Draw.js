const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  numbers: [{ type: Number, required: true }],
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['simulated', 'published'], default: 'simulated' },
  prizePool: {
    total: { type: Number, default: 0 },
    jackpotRollover: { type: Number, default: 0 }, // From last month
    match5Pool: { type: Number, default: 0 }, // 40%
    match4Pool: { type: Number, default: 0 }, // 35%
    match3Pool: { type: Number, default: 0 }, // 25%
  },
  stats: {
    match5: { type: Number, default: 0 },
    match4: { type: Number, default: 0 },
    match3: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Draw', drawSchema);
