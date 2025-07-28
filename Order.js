const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: Number, unique: true, required: true }, // ✅ Added incrementing orderId
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courses: [
    {
      courseId: String,
      title: String,
      price: Number
    }
  ],
  totalAmount: Number,
  status: { type: String, enum: ['success', 'failure'], default: 'success' },
  paymentDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
