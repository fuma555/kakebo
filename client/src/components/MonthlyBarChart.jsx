import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// 月別の支出合計を棒グラフで表示する
export default function MonthlyBarChart({ items }) {
  const totals = items.reduce((acc, item) => {
    const month = item.date ? item.date.slice(0, 7) : '不明';
    acc[month] = (acc[month] || 0) + item.price;
    return acc;
  }, {});

  const months = Object.keys(totals).sort();

  if (months.length === 0) {
    return <p className="empty-message">集計するデータがありません。</p>;
  }

  const data = {
    labels: months,
    datasets: [
      {
        label: '月別支出合計（円）',
        data: months.map((month) => totals[month]),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  return <Bar data={data} />;
}
