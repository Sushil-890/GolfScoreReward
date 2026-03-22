const Winning = require('../models/Winning');
const User = require('../models/User');

// @desc Upload proof of winning
// @route POST /api/winning/upload-proof/:winningId
exports.uploadProof = async (req, res) => {
  try {
    const winning = await Winning.findOne({ _id: req.params.winningId, userId: req.user.id });
    if (!winning) return res.status(404).json({ message: 'Winning record not found' });
    
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Cloudinary return the URL in req.file.path
    winning.proofImage = req.file.path; 
    winning.status = 'Pending Review';
    await winning.save();
    
    res.json(winning);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Admin review proof
// @route PATCH /api/winning/review/:winningId
exports.reviewWinning = async (req, res) => {
  try {
    const { status, notes } = req.body; // status: 'Approved', 'Rejected', 'Paid'
    
    const winning = await Winning.findById(req.params.winningId);
    if (!winning) return res.status(404).json({ message: 'Record not found' });

    winning.status = status;
    if (notes) winning.reviewNotes = notes;
    
    await winning.save();

    // If Paid, update User's totalWon
    if (status === 'Paid') {
      const user = await User.findById(winning.userId);
      if (user) {
        user.totalWon = (user.totalWon || 0) + winning.prizeAmount;
        await user.save();
      }
    }

    res.json(winning);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all winnings (Admin)
// @route GET /api/winning/admin/all
exports.getAllWinnings = async (req, res) => {
  try {
    const winnings = await Winning.find().populate('userId', 'name email').populate('drawId', 'date numbers');
    res.json(winnings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get current user's winnings
// @route GET /api/winning/me
exports.getMyWinnings = async (req, res) => {
  try {
    const winnings = await Winning.find({ userId: req.user.id }).populate('drawId', 'date numbers');
    res.json(winnings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
