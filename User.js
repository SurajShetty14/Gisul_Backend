const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  phone: { type: String, required: false }, // Made optional for OAuth users
  password: { type: String, required: false }, // Made optional for OAuth users
  // OAuth fields
  oauthProvider: { type: String, enum: ['google', 'facebook', null], default: null },
  // Profile fields
  fullName: { type: String, default: '' },
  gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
  country: { type: String, default: '' },
  language: { type: String, default: 'English' },
  timezone: { type: String, default: 'UTC' },
  profilePic: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
