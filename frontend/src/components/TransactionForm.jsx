import { useState } from 'react';
import { createTransaction } from '../services/transactionService';

function TransactionForm({ onAdd }) {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date('2025-07-05T20:16:00+05:30').toISOString().split('T')[0],
    category: 'Food',
    description: '',
    type: 'expense', // Default to expense, user can change to income
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || isNaN(formData.amount)) {
      setError('Please enter a valid amount.');
      return;
    }
    try {
      const transaction = await createTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      onAdd(transaction);
      setFormData({ ...formData, amount: '', description: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding transaction');
    }
  };

  return (
    <div className="card">
      <h2 className="form-title">Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="form-input"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Amount ($)</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="form-input"
            required
            placeholder="Enter amount"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="form-input"
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Salary">Salary</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-input"
            placeholder="Enter description"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="submit-button">
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;