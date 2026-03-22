const User = require('../models/User');

// @desc Get current user's scores
// @route GET /api/scores/me
exports.getMyScores = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('charity');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const userObj = user.toObject();
    userObj.scores.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(userObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Add a new score
// @route POST /api/scores
exports.addScore = async (req, res) => {
  try {
    const { value } = req.body;
    if (value < 1 || value > 45) return res.status(400).json({ message: 'Score must be between 1 and 45' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (!user.isSubscribed) return res.status(403).json({ message: 'You must have an active subscription to add scores' });

    user.scores.push({ value, date: new Date() });
    
    // Logic to keep only 5 scores
    if (user.scores.length > 5) {
      user.scores.sort((a, b) => new Date(a.date) - new Date(b.date));
      while (user.scores.length > 5) {
        user.scores.shift();
      }
    }

    await user.save();
    
    const sortedScores = [...user.scores].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(sortedScores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
