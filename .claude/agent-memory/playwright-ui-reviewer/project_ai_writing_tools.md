---
name: AI Writing Tools プロジェクト UI パターン
description: Next.js + Gemini API で構築した個人用ライティングツールの UI 構造・コンポーネント・既知の問題
type: project
---

AI Writing Tools は Next.js App Router + Tailwind CSS で構築した3ページ構成のライティングツール。

**スタック**: Next.js (App Router), Tailwind CSS, react-markdown, react-hot-toast, Noto Sans JP

**ページ構成**:
- `/blog` — ブログ記事生成（テーマ・キーワード・文字数）
- `/email` — メール作成（宛先タイプ・用件・トーン）
- `/summarize` — 文章要約（テキスト貼り付け・スタイル選択）
- `/` — `/blog` へリダイレクト

**主要コンポーネント**:
- `Sidebar` — デスクトップ: 固定サイドバー(w-56)、モバイル: ハンバーガー+ドロワー
- `OutputPanel` — Markdown レンダリング、コピー/DLボタン付き
- `LanguageToggle` — 日本語/English トグル (type 属性なし)
- `HistoryDrawer` — 右側スライドパネル、localStorage 管理

**2026-05-01 時点の既知 UI 問題**:
1. `label[for]` と `input[id]` の紐付けが全フォームで未実装
2. `LanguageToggle` のボタンに `type="button"` がなく、フォーム内で誤動作リスク
3. モバイル(375px): 「日本語」ボタンが縦書きになる（LanguageToggle の `px-3` が不足）
4. `目安文字数` select の options が英語モード時も日本語のまま（未翻訳）
5. プレースホルダーテキスト: gray-400 on white で約 2.85:1（WCAG AA 4.5:1 未満）
6. 「Ctrl + Enter で生成」ヒントテキスト: gray-400 で同コントラスト不足
7. 履歴ドロワーの「削除」ボタン: gray-300 で約 1.88:1（WCAG AA 大幅未満）
8. `aside` 要素に `aria-label` なし
9. タブレット(768px): 生成結果エリアのプレースホルダーテキストが折り返し
10. モバイルでドロワー外に「履歴」ボタンが浮いて見える（`position: fixed` の重なり）

**Why:** 個人ツールだが Cloudflare Pages にデプロイ済みで一般公開されている
**How to apply:** 次回レビューでは上記問題の修正状況を最初に確認する
