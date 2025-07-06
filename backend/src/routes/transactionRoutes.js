const express = require('express');
const { getTransactions, createTransaction, getTransactionSummary } = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

console.log('transactionRoutes.js: Setting up /transactions routes');
router.get('/transactions', authMiddleware, getTransactions);
router.post('/transactions', authMiddleware, createTransaction);
router.get('/summary', authMiddleware, getTransactionSummary);

module.exports = router;