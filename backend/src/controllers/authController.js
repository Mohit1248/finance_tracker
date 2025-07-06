const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

exports.login = async (req, res) => {
  console.log('authController.js: Received login request with body:', req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
    console.log('authController.js: Login successful, token generated:', token.substring(0, 10) + '...');
    res.json({ user: { id: user._id, email: user.email }, token });
  } catch (error) {
    console.error('authController.js: Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.logout = async (req, res) => {
  console.log('authController.js: Received logout request for user:', req.user);
  try {
    // Validate token if requested
    if (req.query.validate) {
      console.log('authController.js: Validating token');
      res.status(200).json({ message: 'Token valid' });
    } else {
      res.json({ message: 'Logged out successfully' });
    }
  } catch (error) {
    console.error('authController.js: Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

exports.register = async (req, res) => {
  console.log('authController.js: Received register request with body:', req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
    console.log('authController.js: Registration successful, token generated:', token.substring(0, 10) + '...');
    res.status(201).json({ user: { id: user._id, email: user.email }, token });
  } catch (error) {
    console.error('authController.js: Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};