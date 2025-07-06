const express = require('express');
const app = express();
const cors = require('cors'); // Ensure cors is imported
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Specify the frontend origin
  credentials: true, // Allow credentials (cookies)
};
console.log('CORS middleware loaded with options:', corsOptions);

app.use(cors(corsOptions)); // Apply CORS middleware
app.use(express.json()); // Parse JSON bodies

// Log all incoming requests
app.use((req, res, next) => {
  console.log('app.js: Received request:', req.method, req.url, 'Headers:', req.headers);
  next();
});

app.use('/api/auth', authRoutes);
console.log('app.js: Mounted /api/auth routes');
app.use('/api/transactions', transactionRoutes);
console.log('app.js: Mounted /api/transactions routes');
app.use('/api/upload', uploadRoutes);
console.log('app.js: Mounted /api/upload routes');
app.use(errorHandler);

module.exports = app;