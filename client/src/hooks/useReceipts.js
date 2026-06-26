import { useEffect, useState } from 'react';

const STORAGE_KEY = 'kakebo-receipt-items';

// レシートから読み取った商品データをローカルストレージで永続化するフック
export function useReceipts() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // itemsが変化するたびにローカルストレージへ保存し、リロード後も残るようにする
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Claude APIの解析結果（日付＋商品配列）を一覧に追加する
  const addReceiptResult = (result) => {
    const newItems = result.items.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      date: result.date,
      name: item.name,
      price: item.price,
      category: item.category,
    }));
    setItems((prev) => [...prev, ...newItems]);
  };

  return { items, addReceiptResult };
}
