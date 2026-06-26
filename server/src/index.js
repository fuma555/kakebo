import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { analyzeReceiptImage } from './receiptParser.js';

const app = express();

// 画像はメモリ上で受け取り、ディスクには保存しない（最大10MB）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.use(cors());
app.use(express.json());

// レシート画像を受け取り、Claude APIで解析した結果（日付・商品一覧）を返す
app.post('/api/receipts/analyze', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '画像ファイルがアップロードされていません。' });
  }

  try {
    const result = await analyzeReceiptImage(req.file.buffer, req.file.mimetype);
    res.json(result);
  } catch (error) {
    console.error('レシート解析エラー:', error);
    res.status(500).json({ error: error.message || 'レシートの解析に失敗しました。' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});
