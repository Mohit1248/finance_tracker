import { useState, useEffect } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Charts from '../components/Charts';
import { getTransactions } from '../services/transactionService';


function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

 const fetchTransactions = async () => {
  try {
    const { transactions: data, pages } = await getTransactions({ page: 1 }); // Initial page
    setTransactions(data);
    console.log('Dashboard.jsx: Fetched transactions:', data);
  } catch (err) {
    console.error('Error fetching transactions:', err);
  }
};
  return (
    <div>
      <div className="grid">
        <div className="card">
          <TransactionForm onAdd={fetchTransactions} />
        </div>
        <div className="card">
          <Charts transactions={transactions} />
        </div>
      </div>
      <div className="card">
        <TransactionList onTransactionsUpdate={setTransactions} />
      </div>
    </div>
  );
}

export default Dashboard;