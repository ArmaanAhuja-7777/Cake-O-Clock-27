const User = require('../models/user');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('cart.product');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    const existingItem = user.cart.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.status(200).json({ message: 'Added to cart', cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  try {
    const user = await User.findById(req.user.userId);
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();
    res.status(200).json({ message: 'Removed from cart', cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};
