const Announcement = require('../models/Announcement');

// @desc Get all announcements
// @route GET /api/announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Create new announcement
// @route POST /api/announcements
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    const ann = new Announcement({ title, content });
    await ann.save();
    res.json(ann);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update an announcement
// @route PUT /api/announcements/:id
exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    const ann = await Announcement.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    res.json(ann);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete an announcement
// @route DELETE /api/announcements/:id
exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
