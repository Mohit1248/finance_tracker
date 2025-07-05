const Transaction = require('../models/Transaction');
const Joi = require('joi');

const transactionSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').required(),
  amount: Joi.number().positive().required(),
  category: Joi.string().required(),
  description: Joi.string().allow(''),
  date: Joi.date().iso(),
});

exports.createTransaction = async (req, res, next) => {
  try {
    const { error } = transactionSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const transaction = new Transaction({
      ...req.body,
      user: req.user.id,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    console.log('getTransactions: Processing request for user:', req.user.id);
    const { startDate, endDate, page = 1, limit = 10 } = req.query;
    const query = { user: req.user.id };
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const transactions = await Transaction.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ date: -1 });

    const total = await Transaction.countDocuments(query);
    console.log('getTransactions: Found', transactions.length, 'transactions for user:', req.user.id);
    if (transactions.length === 0) {
      console.log('No transactions found for user:', req.user.id);
    }
    res.json({ transactions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('getTransactions error:', error);
    next(error);
  }
};