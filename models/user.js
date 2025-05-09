const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 },
});

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},   
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: {type:String, required: true},
  addresses: [String],
  cart: [cartItemSchema],
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true, collection: "users" });

module.exports = mongoose.model('User', userSchema);
