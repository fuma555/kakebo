import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// 使用するモデル（Claude Haikuの最新バージョン）
const MODEL = 'claude-haiku-4-5-20251001';

// 自動分類に使うカテゴリ一覧
export const CATEGORIES = ['食費', '日用品', '外食', '衣類', '交通', '娯楽', 'その他'];

// Claude APIから安定したJSON形式で結果を受け取るためのツール定義
const EXTRACT_TOOL = {
  name: 'register_receipt_items',
  description: 'レシート画像から読み取った購入日と商品の一覧を登録する',
  input_schema: {
    type: 'object',
    properties: {
      date: {
        type: 'string',
        description: 'レシートに記載された購入日（YYYY-MM-DD形式）。読み取れない場合は空文字。',
      },
      items: {
        type: 'array',
        description: '購入した商品の一覧',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: '商品名' },
            price: { type: 'number', description: '商品の金額（円、税込み）' },
            category: {
              type: 'string',
              description: '商品のカテゴリ',
              enum: CATEGORIES,
            },
          },
          required: ['name', 'price', 'category'],
        },
      },
    },
    required: ['date', 'items'],
  },
};

// アップロードされた画像形式のうちClaude APIが対応しているもの
const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// レシート画像をClaude APIに送信し、購入日と商品（名前・金額・カテゴリ）を抽出する
export async function analyzeReceiptImage(imageBuffer, mimeType) {
  if (!SUPPORTED_MIME_TYPES.includes(mimeType)) {
    throw new Error('対応していない画像形式です（JPEG/PNG/WEBP/GIFのみ対応）。');
  }

  const base64Image = imageBuffer.toString('base64');

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    tools: [EXTRACT_TOOL],
    tool_choice: { type: 'tool', name: EXTRACT_TOOL.name },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType,
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: 'このレシート画像を読み取り、購入日と商品ごとの名前・金額・カテゴリをツールで登録してください。',
          },
        ],
      },
    ],
  });

  const toolUse = message.content.find((block) => block.type === 'tool_use');
  if (!toolUse) {
    throw new Error('Claude APIからレシート情報を取得できませんでした。');
  }

  return toolUse.input;
}
