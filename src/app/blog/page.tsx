"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Sidebar from "@/components/Sidebar";
import OutputPanel from "@/components/OutputPanel";
import LanguageToggle from "@/components/LanguageToggle";
import { Language } from "@/lib/prompts";
import { saveHistory, HistoryItem } from "@/lib/history";

export default function BlogPage() {
  const [theme, setTheme] = useState("");
  const [keywords, setKeywords] = useState("");
  const [wordCount, setWordCount] = useState("");
  const [lang, setLang] = useState<Language>("ja");
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSelectHistory = (item: HistoryItem) => {
    setOutput(item.content);
    setLang(item.lang as Language);
  };

  const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (!theme.trim()) return;

    setOutput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, keywords, wordCount, lang }),
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

      saveHistory({ tool: "blog", title: theme, content: fullText, lang });
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
            <h2 className="text-lg font-semibold text-gray-900">ブログ記事生成</h2>
            <p className="text-sm text-gray-500 mt-0.5">テーマを入力するとMarkdown形式の記事を生成します</p>
          </div>
          <LanguageToggle value={lang} onChange={setLang} />
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
          {/* Input */}
          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit(e);
            }}
            className="w-full md:w-72 md:shrink-0 flex flex-col gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                テーマ <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder={lang === "ja" ? "例: AIを活用した生産性向上" : "e.g. Productivity with AI"}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                キーワード <span className="text-gray-400 text-xs font-normal">任意</span>
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder={lang === "ja" ? "例: 業務効率, ChatGPT" : "e.g. automation, ChatGPT"}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                目安文字数 <span className="text-gray-400 text-xs font-normal">任意</span>
              </label>
              <select
                value={wordCount}
                onChange={(e) => setWordCount(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">デフォルト（800〜1200字）</option>
                <option value="500文字程度">短め（500字）</option>
                <option value="800〜1200文字">標準（800〜1200字）</option>
                <option value="1500〜2000文字">長め（1500〜2000字）</option>
              </select>
            </div>

            <p className="text-xs text-gray-400">Ctrl + Enter で生成</p>

            <button
              type="submit"
              disabled={isStreaming || !theme.trim()}
              className="md:mt-auto w-full rounded-md bg-gray-900 text-white py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isStreaming ? "生成中..." : "生成する"}
            </button>
          </form>

          {/* Output */}
          <div className="flex-1 min-w-0 min-h-64 md:min-h-0">
            <OutputPanel
              content={output}
              isStreaming={isStreaming}
              filename={theme || "blog"}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
