const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: async () => {
      // Set default category as 'Cake' if no category is provided
      const defaultCategory = await Category.findOne({ name: 'Cake' });
      return defaultCategory ? defaultCategory._id : null;
    },
  },
  stock: { type: Number, default: 1 },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true, collection: "products"});

// Create an instance of the Product model before saving to ensure category linking
ProductSchema.pre('save', async function (next) {
  if (!this.category) {
    const defaultCategory = await Category.findOne({ name: 'Cake' });
    if (defaultCategory) {
      this.category = defaultCategory._id;
    }
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
