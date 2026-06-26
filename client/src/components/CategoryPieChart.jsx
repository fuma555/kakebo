import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'];

// カテゴリ別の支出割合を円グラフで表示する
export default function CategoryPieChart({ items }) {
  const totals = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.price;
    return acc;
  }, {});

  const labels = Object.keys(totals);

  if (labels.length === 0) {
    return <p className="empty-message">集計するデータがありません。</p>;
  }

  const data = {
    labels,
    datasets: [
      {
        data: labels.map((label) => totals[label]),
        backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]),
      },
    ],
  };

  return <Pie data={data} />;
}
