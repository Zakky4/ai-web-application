---
name: AI Writing Tools プロジェクト スタック情報
description: Next.js 16.2.4 + React 19 + Gemini API で構築した個人用ライティングツールのスタック、重要なバージョン差異、デプロイ先
type: project
---

Next.js 16.2.4 / React 19.2.4 / TypeScript / Tailwind CSS v4 / Cloudflare Pages にデプロイ済み。

**Why:** Next.js 16 は訓練データとの重大な差異あり。

**How to apply:**
- `dynamic`, `revalidate`, `fetchCache` などのRoute Segment Configオプションは v16.0.0 で削除済み（Cache Components有効時）。バージョン履歴を要確認
- Cloudflare Pages へのデプロイのため、Node.js 専用APIが使えない可能性あり
- `params` / `searchParams` は Promise 型（v15.0.0-RC 以降）、`await` 必須
- Gemini API (`@google/generative-ai ^0.24.1`) をRoute Handlerで呼び出しストリーミング
- 履歴はlocalStorageに保存（`src/lib/history.ts`）、最大20件
- ページ構成: `/blog`, `/email`, `/summarize` の3ツール + Root redirect (`/` -> `/blog`)
