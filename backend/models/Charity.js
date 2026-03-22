const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // URL or local path
  upcomingEvents: [{ title: String, date: Date }]
}, { timestamps: true });

module.exports = mongoose.model('Charity', charitySchema);
