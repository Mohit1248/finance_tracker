import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { getTransactions } from '../services/transactionService';
import { formatDate } from '../utils/formatDate';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

function Charts({ transactions }) {
  const [categoryChartData, setCategoryChartData] = useState({ labels: [], datasets: [] });
  const [dateChartData, setDateChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (transactions && transactions.length > 0) {
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
          const date = formatDate(t.date);
          acc[date] = (acc[date] || 0) + t.amount;
          return acc;
        }, {});
      const dateLabels = Object.keys(expensesByDate).sort();
      const dateData = Object.values(expensesByDate);

      setCategoryChartData({
        labels: categoryLabels,
        datasets: [{
          label: 'Expenses by Category',
          data: categoryData,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          borderWidth: 1,
        }],
      });

      setDateChartData({
        labels: dateLabels,
        datasets: [{
          label: 'Expenses by Date',
          data: dateData,
          fill: false,
          borderColor: '#FF6384',
          tension: 0.1,
        }],
      });
    }
  }, [transactions]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true, title: { display: true, text: 'Amount ($)' } } },
    plugins: { legend: { position: 'top' }, title: { display: true, text: '' } },
  };

  return (
    <div className="card">
      <h2 className="form-title">Expense Analysis</h2>
      <div style={{ height: '400px' }}>
        <h4>Expenses by Category</h4>
        <Bar data={categoryChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: 'Expenses by Category' } } }} />
      </div>
      <div style={{ height: '400px', marginTop: '20px' }}>
        <h4>Expenses by Date</h4>
        <Line data={dateChartData} options={{ ...chartOptions, scales: { ...chartOptions.scales, x: { title: { display: true, text: 'Date' } } }, plugins: { ...chartOptions.plugins, title: { text: 'Expenses by Date' } } }} />
      </div>
    </div>
  );
}

export default Charts;