import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getTransactions } from '../services/transactionService';
import { formatDate } from '../utils/formatDate'; // Import formatDate
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Charts({ transactions }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const categories = [...new Set(transactions.map(t => t.category))];
      const amounts = categories.map(cat =>
        transactions
          .filter(t => t.category === cat && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
      );
      const dates = [...new Set(transactions.map(t => formatDate(t.date)))]; // Use formatDate
      const dailyExpenses = dates.map(date =>
        transactions
          .filter(t => formatDate(t.date) === date && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
      );

      setChartData({
        labels: ['By Category', 'By Date'],
        datasets: [
          {
            label: 'Expenses by Category',
            data: amounts,
            backgroundColor: 'rgba(76, 81, 191, 0.6)',
            borderColor: 'rgba(76, 81, 191, 1)',
            borderWidth: 1,
          },
          {
            label: 'Expenses by Date',
            data: dailyExpenses,
            backgroundColor: 'rgba(99, 179, 237, 0.6)',
            borderColor: 'rgba(99, 179, 237, 1)',
            borderWidth: 1,
          },
        ],
      });
    }
  }, [transactions]);

  return (
    <div className="card">
      <h2 className="form-title">Expense Analysis</h2>
      <div style={{ height: '400px' }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { stacked: true }, y: { beginAtZero: true } },
          }}
        />
      </div>
    </div>
  );
}

export default Charts;