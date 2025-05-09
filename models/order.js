const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }],
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  razorpay: {
    orderId: String,
    paymentId: String,
    signature: String,
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true, collection: "orders"});

module.exports = mongoose.model('Order', OrderSchema);
