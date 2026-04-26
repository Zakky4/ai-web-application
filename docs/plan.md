# AI Writing Tools — 実装プラン

## Context
個人利用向けのAIライティングツールをゼロから構築する。ブログ記事生成・メール作成・文章要約の3機能をひとつのNext.jsアプリにまとめる。Gemini API（無料枠）を使い、シンプル・ミニマルなUIで日英切り替えに対応。生成した文章はクリップボードコピー・ファイルDL・localStorage履歴で扱えるようにする。

---

## 技術スタック
| 要素 | 選択 |
|------|------|
| フレームワーク | Next.js (App Router) + TypeScript |
| スタイリング | Tailwind CSS v4 |
| フォント | Noto Sans JP（`next/font/google`） |
| AIモデル | Gemini 2.5 Flash（`@google/generative-ai`）|
| 状態管理 | React useState + localStorage |
| Markdownレンダリング | react-markdown |
| トースト通知 | react-hot-toast |
| デプロイ | Vercel（任意） |

---

## ディレクトリ構成
```
ai-web-application/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 共通レイアウト（Noto Sans JP・Toaster）
│   │   ├── page.tsx            # トップ（/blog へリダイレクト）
│   │   ├── blog/page.tsx       # ブログ記事生成ページ
│   │   ├── email/page.tsx      # メール作成ページ
│   │   ├── summarize/page.tsx  # 要約ページ
│   │   └── api/
│   │       ├── blog/route.ts
│   │       ├── email/route.ts
│   │       └── summarize/route.ts
│   ├── components/
│   │   ├── Sidebar.tsx         # ナビゲーション（デスクトップ固定・モバイルドロワー）
│   │   ├── OutputPanel.tsx     # 生成結果表示（Markdownレンダリング）・コピー・DLボタン
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

## 実装済みの改善

### フォント変更
- Geist → Noto Sans JP（weight: 400/500/700）
- `next/font/google` で自己ホスティング、CSS変数 `--font-noto-sans-jp` 経由で全体適用

### Markdownレンダリング
- `OutputPanel.tsx` に `react-markdown` を導入
- 見出し・箇条書き・太字・コードブロック・引用をHTMLにレンダリング
- 各要素にTailwindクラスで統一スタイルを適用

### Ctrl+Enter ショートカット
- 全フォームに `onKeyDown` ハンドラを追加（Ctrl/⌘ + Enter で生成実行）
- テキストエリアには個別にも追加（通常Enterとの競合を防止）

### モバイル対応
- `Sidebar`: デスクトップは固定表示（`hidden md:flex`）、モバイルはハンバーガーボタン + ドロワー
- 各ページのコンテンツエリア: `flex-col md:flex-row`（モバイルで縦積み）
- `main` に `pt-16 md:pt-6` を設定してモバイルトップバーとの重なりを回避

### トースト通知
- `react-hot-toast` の `<Toaster>` を `layout.tsx` に設置
- 各ページのインラインエラー表示を `toast.error()` に置き換え
- Noto Sans JP フォント・既存配色（赤系ボーダー）に合わせたスタイル

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
7. エラー: 空入力・APIキー未設定時にトースト通知でエラーが出るか
8. Ctrl+Enter: 各ページでショートカット生成が動作するか
9. モバイル: 画面幅768px未満でドロワーナビが動作するか
