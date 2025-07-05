import { useState, useEffect } from 'react';
import { formatDate } from '../utils/formatDate'; // Import formatDate
import { getTransactions } from '../services/transactionService';
import Pagination from './Pagination';

function TransactionList({ onTransactionsUpdate }) {
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async (params = {}) => {
    try {
      const response = await getTransactions({ page, ...params, startDate, endDate });
      setTransactions(response.transactions);
      setTotalPages(response.pages);
      if (onTransactionsUpdate) onTransactionsUpdate(response.transactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const handleFilter = () => {
    fetchTransactions();
  };

  return (
    <div className="card">
      <h2 className="form-title">Transaction History</h2>
      <div style={{ marginBottom: '15px' }}>
        <div className="form-group" style={{ display: 'inline-block', width: '45%', marginRight: '10%' }}>
          <label className="form-label">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group" style={{ display: 'inline-block', width: '45%' }}>
          <label className="form-label">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-input"
          />
        </div>
        <button onClick={handleFilter} className="submit-button" style={{ padding: '10px 15px', width: 'auto', marginTop: '10px' }}>
          Filter
        </button>
      </div>
      {transactions.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td>{formatDate(t.date)}</td>
                  <td>{t.type}</td>
                  <td>{t.type === 'expense' ? `-$${t.amount.toFixed(2)}` : `+$${t.amount.toFixed(2)}`}</td>
                  <td>{t.category}</td>
                  <td>{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
}

export default TransactionList;