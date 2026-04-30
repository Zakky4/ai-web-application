import { NextRequest } from "next/server";
import { getModel } from "@/lib/gemini";
import { summarizePrompt, Language } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const { text, style, lang } = await req.json();

  if (!text?.trim()) {
    return new Response(JSON.stringify({ error: "要約するテキストを入力してください" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (text.length > 10000) {
    return new Response(JSON.stringify({ error: "テキストは10,000文字以内で入力してください" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const prompt = summarizePrompt(text, style ?? "bullets", (lang as Language) ?? "ja");

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const model = getModel();
        const result = await model.generateContentStream(prompt);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
