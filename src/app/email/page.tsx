"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Sidebar from "@/components/Sidebar";
import OutputPanel from "@/components/OutputPanel";
import LanguageToggle from "@/components/LanguageToggle";
import { Language } from "@/lib/prompts";
import { saveHistory, HistoryItem } from "@/lib/history";

export default function EmailPage() {
  const [recipientType, setRecipientType] = useState("business");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("polite");
  const [lang, setLang] = useState<Language>("ja");
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSelectHistory = (item: HistoryItem) => {
    setOutput(item.content);
    setLang(item.lang as Language);
  };

  const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (!purpose.trim()) return;

    setOutput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientType, purpose, tone, lang }),
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

      saveHistory({ tool: "email", title: purpose, content: fullText, lang });
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
            <h2 className="text-lg font-semibold text-gray-900">メール作成</h2>
            <p className="text-sm text-gray-500 mt-0.5">宛先と用件を入力するとビジネスメールを生成します</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">宛先タイプ</label>
              <select
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="business">取引先・ビジネス相手</option>
                <option value="internal">社内・同僚</option>
                <option value="casual">カジュアルな知人</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                用件・目的 <span className="text-red-400">*</span>
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={lang === "ja" ? "例: 打ち合わせの日程調整をお願いしたい" : "e.g. Request a meeting schedule adjustment"}
                rows={4}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">トーン</label>
              <div className="flex rounded-md border border-gray-200 overflow-hidden text-sm">
                {[
                  { value: "polite", label: "丁寧" },
                  { value: "normal", label: "普通" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTone(value)}
                    className={`flex-1 py-1.5 transition-colors ${
                      tone === value
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-400">Ctrl + Enter で生成</p>

            <button
              type="submit"
              disabled={isStreaming || !purpose.trim()}
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
              filename="email"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
