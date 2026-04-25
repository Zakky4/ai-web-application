"use client";

import { useState } from "react";

interface OutputPanelProps {
  content: string;
  isStreaming: boolean;
  filename?: string;
}

export default function OutputPanel({ content, isStreaming, filename = "output" }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-gray-700">
          生成結果
          {isStreaming && (
            <span className="ml-2 inline-block w-1.5 h-4 bg-gray-900 animate-pulse rounded-sm align-middle" />
          )}
        </h2>
        {content && !isStreaming && (
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {copied ? "✓ コピー済み" : "コピー"}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              DL (.md)
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 p-4 overflow-y-auto">
        {content ? (
          <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
            {content}
          </pre>
        ) : (
          <p className="text-sm text-gray-400">
            {isStreaming ? "生成中..." : "生成結果がここに表示されます"}
          </p>
        )}
      </div>
    </div>
  );
}
