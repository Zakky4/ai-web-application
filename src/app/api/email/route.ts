import { NextRequest } from "next/server";
import { getModel } from "@/lib/gemini";
import { emailPrompt, Language } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const { recipientType, purpose, tone, lang } = await req.json();

  if (!purpose?.trim()) {
    return new Response(JSON.stringify({ error: "用件・目的を入力してください" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (purpose.length > 1000) {
    return new Response(JSON.stringify({ error: "用件・目的は1000文字以内で入力してください" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const prompt = emailPrompt(
    recipientType ?? "business",
    purpose,
    tone ?? "polite",
    (lang as Language) ?? "ja"
  );

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
