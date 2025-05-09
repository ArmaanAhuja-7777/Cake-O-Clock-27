const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming JWT middleware adds user info
    const { products, totalAmount, paymentStatus, address } = req.body;

    // Validate if all necessary data is provided
    if (!products || !totalAmount || !address) {
      return res.status(400).json({ error: 'Missing order data' });
    }

    // Create the order
    const order = new Order({
      user: userId,
      products,
      totalAmount,
      paymentStatus: paymentStatus || 'Pending', // Default to "Pending" if not provided
      address,
    });

    // Save the order to the database
    await order.save();

    // Update the stock of the products in the order
    for (const productId of products) {
      const product = await Product.findById(productId);
      if (product && product.stock > 0) {
        product.stock -= 1; // Decrease stock for each product ordered
        await product.save();
      }
    }

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming JWT middleware adds user info
    const orders = await Order.find({ user: userId }).populate('products');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate('products');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// Verify payment status
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentStatus } = req.body;

    if (!orderId || !paymentStatus) {
      return res.status(400).json({ error: 'Missing payment data' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the payment status
    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({ message: 'Payment status updated successfully', order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};
