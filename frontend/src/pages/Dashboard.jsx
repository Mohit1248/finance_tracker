import { useState, useEffect } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getTransactions } from '../services/transactionService';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState('2025-07-01');
  const [endDate, setEndDate] = useState('2025-07-07');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [startDate, endDate, currentPage]);

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions({ page: currentPage, limit: 20, startDate, endDate }); // Updated limit to 20
      console.log('Dashboard.jsx: Fetched transactions response:', JSON.stringify(response, null, 2));
      setTransactions(response.transactions || []);
      setTotalPages(response.pages || 1);
      setError(null);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions. Please try again.');
    }
  };

  // Prepare data for Expenses by Category (Bar Chart) with cap
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .map(t => ({ ...t, amount: Math.min(Math.abs(t.amount), 10000) * (t.amount < 0 ? -1 : 1) }))
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
  const categoryLabels = Object.keys(expensesByCategory);
  const categoryData = Object.values(expensesByCategory);

  // Prepare data for Expenses by Date (Line Chart) with cap
  const expensesByDate = transactions
    .filter(t => t.type === 'expense')
    .map(t => ({ ...t, amount: Math.min(Math.abs(t.amount), 10000) * (t.amount < 0 ? -1 : 1) }))
    .reduce((acc, t) => {
      const date = new Date(t.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + t.amount;
      return acc;
    }, {});
  const dateLabels = Object.keys(expensesByDate).sort();
  const dateData = Object.values(expensesByDate);

  const categoryChartData = {
    labels: categoryLabels,
    datasets: [{
      label: 'Expenses',
      data: categoryData,
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      borderWidth: 1,
    }],
  };

  const dateChartData = {
    labels: dateLabels,
    datasets: [{
      label: 'Expenses',
      data: dateData,
      fill: false,
      borderColor: '#FF6384',
      tension: 0.1,
    }],
  };

  const chartOptions = {
    scales: { y: { beginAtZero: true, title: { display: true, text: 'Amount ($)' } } },
    plugins: { legend: { position: 'top' }, title: { display: true, text: '' } },
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div>
      <div className="grid">
        <div className="card">
          <TransactionForm onAdd={fetchTransactions} onError={setError} />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        <div className="card">
          <h3>Charts</h3>
          <h4>Expenses by Category</h4>
          <Bar data={categoryChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: 'Expenses by Category' } } }} />
          <h4>Expenses by Date</h4>
          <Line data={dateChartData} options={{ ...chartOptions, scales: { ...chartOptions.scales, x: { title: { display: true, text: 'Date' } } }, plugins: { ...chartOptions.plugins, title: { text: 'Expenses by Date' } } }} />
        </div>
      </div>
      <div className="card">
        <h3>Filter by Date Range</h3>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={fetchTransactions}>Apply Filter</button>
        <TransactionList onTransactionsUpdate={setTransactions} transactions={transactions} />
        <div style={{ marginTop: '10px' }}>
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
          <span> Page {currentPage} of {totalPages} </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;