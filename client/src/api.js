// バックエンドにレシート画像を送信し、Claude APIによる解析結果を取得する
export async function analyzeReceipt(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/receipts/analyze', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'レシートの解析に失敗しました。');
  }

  return response.json();
}
