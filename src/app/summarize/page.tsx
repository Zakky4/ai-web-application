"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Sidebar from "@/components/Sidebar";
import OutputPanel from "@/components/OutputPanel";
import LanguageToggle from "@/components/LanguageToggle";
import { Language } from "@/lib/prompts";
import { saveHistory, HistoryItem } from "@/lib/history";

export default function SummarizePage() {
  const [text, setText] = useState("");
  const [style, setStyle] = useState("bullets");
  const [lang, setLang] = useState<Language>("ja");
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSelectHistory = (item: HistoryItem) => {
    setOutput(item.content);
    setLang(item.lang as Language);
  };

  const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;

    setOutput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, style, lang }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error ?? "エラーが発生しました");
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setOutput(fullText);
        }
      }

      const title = text.slice(0, 50) + (text.length > 50 ? "..." : "");
      saveHistory({ tool: "summarize", title, content: fullText, lang });
    } catch {
      toast.error("ネットワークエラーが発生しました");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar onSelectHistory={handleSelectHistory} />

      <main className="flex-1 flex flex-col min-w-0 p-4 md:p-6 overflow-hidden pt-16 md:pt-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">文章要約</h2>
            <p className="text-sm text-gray-500 mt-0.5">長文テキストを貼り付けると要点をまとめます</p>
          </div>
          <LanguageToggle value={lang} onChange={setLang} />
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="w-full md:w-72 md:shrink-0 flex flex-col gap-4"
          >
            <div className="flex flex-col min-h-40 md:flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                要約するテキスト <span className="text-red-400">*</span>
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="要約したいテキストをここに貼り付けてください..."
                className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none min-h-40"
                required
              />
              {text && (
                <p className="text-xs text-gray-400 mt-1 text-right">{text.length.toLocaleString()} 文字</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">要約スタイル</label>
              <div className="flex rounded-md border border-gray-200 overflow-hidden text-sm">
                {[
                  { value: "bullets", label: "箇条書き" },
                  { value: "paragraph", label: "段落" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStyle(value)}
                    className={`flex-1 py-1.5 transition-colors ${
                      style === value
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-400">Ctrl + Enter で要約</p>

            <button
              type="submit"
              disabled={isStreaming || !text.trim()}
              className="w-full rounded-md bg-gray-900 text-white py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isStreaming ? "要約中..." : "要約する"}
            </button>
          </form>

          {/* Output */}
          <div className="flex-1 min-w-0 min-h-64 md:min-h-0">
            <OutputPanel
              content={output}
              isStreaming={isStreaming}
              filename="summary"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
