"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

interface OutputPanelProps {
  content: string;
  isStreaming: boolean;
  filename?: string;
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-xl font-bold mb-3 mt-1 text-gray-900">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold mb-2 mt-5 text-gray-900 border-b border-gray-100 pb-1">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold mb-2 mt-4 text-gray-800">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-3 text-sm text-gray-800 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 space-y-1 list-disc list-outside ml-4">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 space-y-1 list-decimal list-outside ml-4">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-sm text-gray-800 leading-relaxed">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
  pre: ({ children }) => (
    <pre className="bg-gray-100 rounded-md p-3 mb-3 overflow-x-auto text-sm font-mono leading-relaxed">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="font-mono text-sm">{children}</code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 mb-3 text-gray-600 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-gray-200 my-4" />,
};

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
          <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
        ) : (
          <p className="text-sm text-gray-400">
            {isStreaming ? "生成中..." : "生成結果がここに表示されます"}
          </p>
        )}
      </div>
    </div>
  );
}
