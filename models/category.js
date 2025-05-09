const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  // Adding an array of product references for this category
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, { timestamps: true , collection: "categories"} );

module.exports = mongoose.model('Category', CategorySchema);
