const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Signup user and return JWT token
exports.signup = async (req, res) => {
  const { name, email, password, phone, addresses, role } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      addresses,
      role: role || 'customer', // Default to 'customer' if no role is provided
    });

    // Save the new user to the database
    await newUser.save();

    // Generate JWT token for the user (using the user ID, email, and role)
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'secret', // Use JWT secret from environment
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Return the response with the token
    res.status(201).json({
      message: 'User registered successfully',
      token: token, // Send the generated JWT token in the response
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

// Login user and return JWT token
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token (you can add user information to the payload)
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret', // JWT secret
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send the token in the response
    res.status(200).json({
      message: 'Login successful',
      token: token, // This is the JWT token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
};
