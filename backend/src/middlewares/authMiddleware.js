const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config'); // Match your config export

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Auth Header:', authHeader);

  const token = authHeader?.split(' ')[1]; // Bearer <token>
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Invalid token:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
