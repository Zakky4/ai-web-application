export type Language = "ja" | "en";

export function blogPrompt(
  theme: string,
  keywords: string,
  wordCount: string,
  lang: Language
): string {
  if (lang === "ja") {
    return `あなたはプロのブログライターです。以下の条件でブログ記事をMarkdown形式で執筆してください。

テーマ: ${theme}
${keywords ? `キーワード: ${keywords}` : ""}
目安文字数: ${wordCount || "800〜1200文字"}

要件:
- H1で記事タイトル、H2で各セクション見出しをつける
- 導入文・本文（2〜3セクション）・まとめ の構成にする
- 読者にとって価値のある具体的な内容を書く
- 日本語で執筆すること`;
  }
  return `You are a professional blog writer. Write a blog post in Markdown format with the following requirements.

Topic: ${theme}
${keywords ? `Keywords: ${keywords}` : ""}
Target length: ${wordCount || "800–1200 words"}

Requirements:
- Use H1 for the title, H2 for section headings
- Structure: introduction, body (2–3 sections), conclusion
- Write practical, valuable content for readers
- Write in English`;
}

export function emailPrompt(
  recipientType: string,
  purpose: string,
  tone: string,
  lang: Language
): string {
  const recipientLabels: Record<string, { ja: string; en: string }> = {
    business: { ja: "取引先・ビジネス相手", en: "business partner / client" },
    internal: { ja: "社内・同僚", en: "internal / colleague" },
    casual: { ja: "カジュアルな知人", en: "casual acquaintance" },
  };
  const label = recipientLabels[recipientType] ?? { ja: recipientType, en: recipientType };

  if (lang === "ja") {
    return `あなたはビジネスメールのプロです。以下の条件でメールを作成してください。

宛先: ${label.ja}
用件・目的: ${purpose}
トーン: ${tone === "polite" ? "丁寧・フォーマル" : "普通・ナチュラル"}

出力形式:
件名: [件名をここに]

[メール本文をここに]

要件:
- 日本語で書くこと
- 件名と本文を必ず分けて出力する
- 簡潔で分かりやすい文章にする`;
  }
  return `You are a professional email writer. Write an email with the following details.

Recipient: ${label.en}
Purpose: ${purpose}
Tone: ${tone === "polite" ? "formal / polite" : "natural / casual"}

Output format:
Subject: [subject here]

[email body here]

Requirements:
- Write in English
- Always separate subject and body
- Keep it clear and concise`;
}

export function summarizePrompt(
  text: string,
  style: string,
  lang: Language
): string {
  const styleLabel =
    style === "bullets"
      ? lang === "ja"
        ? "箇条書き"
        : "bullet points"
      : lang === "ja"
      ? "段落形式"
      : "paragraph form";

  if (lang === "ja") {
    return `以下のテキストを${styleLabel}で要約してください。重要なポイントを漏らさず、簡潔にまとめてください。日本語で出力してください。

--- テキスト開始 ---
${text}
--- テキスト終了 ---`;
  }
  return `Summarize the following text in ${styleLabel}. Capture all key points concisely. Output in English.

--- START TEXT ---
${text}
--- END TEXT ---`;
}
