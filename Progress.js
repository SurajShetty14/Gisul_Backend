const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: String,
  title: String,
  price: Number,
  duration: String,
  status: { type: String, enum: ['enrolled', 'active', 'completed'], default: 'enrolled' },
  enrolledAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', progressSchema);


