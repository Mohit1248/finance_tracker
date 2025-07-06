const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  console.log('transactionController.js: Handling GET /transactions for userId:', req.user?.id);
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;
    const query = { user: userId }; // Changed from userId to user
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const transactions = await Transaction.find(query)
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Transaction.countDocuments(query);
    console.log('transactionController.js: Fetched transactions, page:', page, 'limit:', limit, 'total:', total);
    res.json({ transactions, total, page, limit });
  } catch (error) {
    console.error('transactionController.js: Get transactions error:', error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};

exports.createTransaction = async (req, res) => {
  console.log('transactionController.js: Handling POST /transactions with body:', req.body);
  try {
    const userId = req.user.id;
    const transaction = new Transaction({ ...req.body, user: userId });
    await transaction.save();
    console.log('transactionController.js: Transaction created:', transaction);
    res.status(201).json(transaction);
  } catch (error) {
    console.error('transactionController.js: Create transaction error:', error);
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
};

exports.getTransactionSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const summary = {
      byCategory: await Transaction.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
      ]),
      byDate: await Transaction.aggregate([
        { $match: { user: userId } },
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
    res.status(500).json({ message: 'Error generating summary' });
  }
};