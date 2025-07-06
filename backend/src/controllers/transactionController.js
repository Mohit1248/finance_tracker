const Transaction = require('../models/Transaction');
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    // Parse page and limit from query params, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { startDate, endDate } = req.query;
    const query = { user: userId };

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const transactions = await Transaction.find(query)
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(query);
    const pages = Math.ceil(total / limit);

    res.json({
      transactions,
      total,
      page,
      limit,
      pages,
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

exports.createTransaction = async (req, res) => {
  console.log('transactionController.js: Handling POST /transactions with body:', req.body);
  try {
    const userId = req.user.id;
    const transaction = new Transaction({ ...req.body, user: userId });
    await transaction.save();
    console.log('transactionController.js: Transaction created:', transaction);
    res.status(201).json({ message: 'Transaction created', transaction });
  } catch (error) {
    console.error('transactionController.js: Create transaction error:', error);
    res.status(400).json({ message: 'Error creating transaction', error: error.message, details: error.errors ? Object.values(error.errors).map(e => e.message) : null });
  }
};

exports.getTransactionSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    const query = { user: userId };
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const summary = {
      byCategory: await Transaction.aggregate([
        { $match: query },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
      ]),
      byDate: await Transaction.aggregate([
        { $match: query },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            total: { $sum: '$amount' },
          },
        },
      ]),
    };
    console.log('transactionController.js: Summary generated:', summary);
    res.json(summary);
  } catch (error) {
    console.error('transactionController.js: Summary error:', error);
    res.status(500).json({ message: 'Error generating summary', error: error.message });
  }
};