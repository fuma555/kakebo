import { useReceipts } from './hooks/useReceipts.js';
import ReceiptUploader from './components/ReceiptUploader.jsx';
import ReceiptTable from './components/ReceiptTable.jsx';
import CategoryPieChart from './components/CategoryPieChart.jsx';
import MonthlyBarChart from './components/MonthlyBarChart.jsx';
import './App.css';

export default function App() {
  const { items, addReceiptResult } = useReceipts();

  return (
    <div className="app">
      <h1>かけぼ - レシート読み込み家計簿</h1>

      <ReceiptUploader onAnalyzed={addReceiptResult} />

      <section className="charts">
        <div className="chart-box">
          <h2>カテゴリ別の割合</h2>
          <CategoryPieChart items={items} />
        </div>
        <div className="chart-box">
          <h2>月別の支出</h2>
          <MonthlyBarChart items={items} />
        </div>
      </section>

      <section>
        <h2>登録した商品一覧</h2>
        <ReceiptTable items={items} />
      </section>
    </div>
  );
}
