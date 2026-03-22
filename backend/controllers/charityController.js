const Charity = require('../models/Charity');

// @desc Get all charities
// @route GET /api/charities
exports.getCharities = async (req, res) => {
  try {
    const charities = await Charity.find();
    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Create a charity
// @route POST /api/charities
exports.createCharity = async (req, res) => {
  try {
    const charity = new Charity(req.body);
    await charity.save();
    res.status(201).json(charity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
