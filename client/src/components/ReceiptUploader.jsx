import { useState } from 'react';
import { analyzeReceipt } from '../api.js';

// レシート画像をアップロードし、Claude APIの解析結果を親コンポーネントへ渡す
export default function ReceiptUploader({ onAnalyzed }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const result = await analyzeReceipt(file);
      onAnalyzed(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="receipt-uploader">
      <label className="upload-button">
        {loading ? '解析中...' : 'レシート画像をアップロード'}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          hidden
        />
      </label>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
