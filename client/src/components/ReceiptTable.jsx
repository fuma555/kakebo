// 読み取った商品（日付・商品名・カテゴリ・金額）の一覧テーブル
export default function ReceiptTable({ items }) {
  if (items.length === 0) {
    return <p className="empty-message">まだ登録されたレシートがありません。</p>;
  }

  // 新しい日付のものを上に表示する
  const sorted = [...items].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <table className="receipt-table">
      <thead>
        <tr>
          <th>日付</th>
          <th>商品名</th>
          <th>カテゴリ</th>
          <th>金額</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((item) => (
          <tr key={item.id}>
            <td>{item.date || '不明'}</td>
            <td>{item.name}</td>
            <td>{item.category}</td>
            <td>{item.price.toLocaleString()}円</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
