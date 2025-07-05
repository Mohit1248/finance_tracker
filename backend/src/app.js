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
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/upload', uploadRoutes);
app.use(errorHandler);



module.exports = app;