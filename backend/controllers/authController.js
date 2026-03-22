const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc Register a new user
// @route POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, charityId, charityContributionPercentage, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Password complexity check
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (password.length < 8 || !passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long and contain alphabets, numbers, and special characters.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      charity: charityId,
      charityContributionPercentage: charityContributionPercentage >= 10 ? charityContributionPercentage : 10,
      role: role === 'admin' ? 'admin' : 'user'
    });
    
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('charity');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role,
        isSubscribed: user.isSubscribed,
        plan: user.plan
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update user profile (Charity settings)
// @route PUT /api/auth/me
exports.updateProfile = async (req, res) => {
  try {
    const { charityId, charityContributionPercentage } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (charityId) user.charity = charityId;
    if (charityContributionPercentage >= 10) user.charityContributionPercentage = charityContributionPercentage;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Admin get all users
// @route GET /api/auth/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('charity');
    res.json(users);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};
