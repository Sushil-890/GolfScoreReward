const mongoose = require('mongoose');

const winningSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  drawId: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw', required: true },
  matchType: { type: Number, required: true }, // 5, 4, or 3
  prizeAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending Proof', 'Pending Review', 'Approved', 'Rejected', 'Paid'],
    default: 'Pending Proof'
  },
  proofImage: { type: String, default: null }, // URL or local path
  reviewNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Winning', winningSchema);
