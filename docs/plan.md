# AI Writing Tools — 実装プラン

## Context
個人利用向けのAIライティングツールをゼロから構築する。ブログ記事生成・メール作成・文章要約の3機能をひとつのNext.jsアプリにまとめる。Gemini API（無料枠）を使い、シンプル・ミニマルなUIで日英切り替えに対応。生成した文章はクリップボードコピー・ファイルDL・localStorage履歴で扱えるようにする。

---

## 技術スタック
| 要素 | 選択 |
|------|------|
| フレームワーク | Next.js 14 (App Router) + TypeScript |
| スタイリング | Tailwind CSS |
| AIモデル | Gemini 1.5 Flash（`@google/generative-ai`）|
| 状態管理 | React useState + localStorage |
| デプロイ | Vercel（任意） |

---

## ディレクトリ構成
```
ai-web-application/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 共通レイアウト（Sidebar付き）
│   │   ├── page.tsx            # トップ（/blog へリダイレクト）
│   │   ├── blog/page.tsx       # ブログ記事生成ページ
│   │   ├── email/page.tsx      # メール作成ページ
│   │   ├── summarize/page.tsx  # 要約ページ
│   │   └── api/
│   │       ├── blog/route.ts
│   │       ├── email/route.ts
│   │       └── summarize/route.ts
│   ├── components/
│   │   ├── Sidebar.tsx         # ナビゲーション（ブログ/メール/要約）
│   │   ├── ToolLayout.tsx      # 入力+出力の共通レイアウト
│   │   ├── OutputPanel.tsx     # 生成結果表示・コピー・DLボタン
│   │   ├── LanguageToggle.tsx  # 日英切り替えUI
│   │   └── HistoryDrawer.tsx   # 過去の生成履歴パネル
│   └── lib/
│       ├── gemini.ts           # Gemini クライアント初期化
│       ├── prompts.ts          # 各機能のプロンプトテンプレート
│       └── history.ts          # localStorage ヘルパー
├── .env.local                  # GEMINI_API_KEY
└── package.json
```

---

## 各機能の仕様

### 1. ブログ記事生成（/blog）
- 入力: テーマ（必須）、キーワード（任意）、文字数目安、言語（日/英）
- 出力: Markdown形式のブログ記事（見出し・本文・まとめ付き）
- APIルート: `POST /api/blog`

### 2. メール作成（/email）
- 入力: 宛先タイプ（取引先/社内/カジュアル）、目的・用件、トーン（丁寧/普通）、言語
- 出力: 件名 + 本文のメール文章
- APIルート: `POST /api/email`

### 3. 文章要約（/summarize）
- 入力: 長文テキスト貼り付け、要約スタイル（箇条書き/段落）、言語
- 出力: 要約された文章
- APIルート: `POST /api/summarize`

---

## 実装ステップ

### Step 1 — プロジェクト初期化
```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
npm install @google/generative-ai
```

### Step 2 — Gemini クライアント（src/lib/gemini.ts）
- `GoogleGenerativeAI` を初期化して `gemini-1.5-flash` モデルを使う
- ストリーミングレスポンス対応（`generateContentStream`）でUX向上

### Step 3 — APIルート（3本）
- リクエストのパラメータをプロンプトテンプレートに組み込む
- Gemini APIを呼び出してストリーミングで返す
- エラーハンドリング（API超過・ネットワークエラー）

### Step 4 — プロンプトテンプレート（src/lib/prompts.ts）
- 言語（日/英）に応じてプロンプトを切り替え
- 各機能に適したシステムプロンプトを定義

### Step 5 — UIコンポーネント
- `Sidebar`: 3ツールへのナビゲーション + 履歴ボタン
- `ToolLayout`: 左=入力フォーム、右=OutputPanel の2カラム
- `OutputPanel`: 生成テキスト表示、コピーボタン、.mdダウンロードボタン
- `HistoryDrawer`: localStorage から過去20件を表示

### Step 6 — localStorage 履歴
- `src/lib/history.ts` で保存・取得・削除のヘルパーを作る
- 最大20件、古いものから自動削除

---

## 環境変数
```
# .env.local
GEMINI_API_KEY=your_api_key_here
```

---

## 検証方法
1. `npm run dev` で起動 → `http://localhost:3000`
2. ブログ生成: テーマを入力して生成→コピー・DLが動作するか
3. メール作成: 各パラメータを変えて正しいフォーマットで出るか
4. 要約: 長い文章を貼り付けて要約されるか
5. 言語切り替え: 日/英それぞれで正しい言語で生成されるか
6. 履歴: 生成後に履歴に残り、再表示できるか
7. エラー: 空入力・API キー未設定時にエラーメッセージが出るか
