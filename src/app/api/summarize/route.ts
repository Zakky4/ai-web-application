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
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(encoder.encode(`\n\n[ERROR] ${message}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
