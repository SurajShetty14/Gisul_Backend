const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [
    {
      courseId: { type: String, required: true },
      title: String,
      price: Number,
      duration: String,
      imageUrl: String, // Add this field for course image
      quantity: { type: Number, default: 1 },
      addedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Cart', cartSchema); 