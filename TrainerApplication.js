const mongoose = require('mongoose');

const trainerApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  trainingCourses: { type: String, required: true },
  trainingExperience: { type: String, required: true },
  linkedinProfile: { type: String },
  resumeUrl: { type: String }, // Cloudinary URL
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TrainerApplication', trainerApplicationSchema);
