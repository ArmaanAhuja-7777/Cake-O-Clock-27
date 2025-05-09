const Product = require('../models/product');
const Category = require('../models/category');

// Create a product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, categoryId, stock, isAvailable } = req.body;
    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      category: categoryId || 'Cake', // Default to Cake if no category is provided
      stock,
      isAvailable,
    });

    await product.save();

    // Add product to category
    if (categoryId) {
      await Category.findByIdAndUpdate(categoryId, { $push: { products: product._id } });
    }

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get product by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    const category = await Category.findOne({ name: categoryName }).populate('products');

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json(category.products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products by category' });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(productId, updates, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate('category');
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  };
  

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);



    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Remove product reference from category
    await Category.updateMany(
      { products: productId },
      { $pull: { products: productId } }
    );

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
