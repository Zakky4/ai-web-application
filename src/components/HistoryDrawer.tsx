"use client";

import { useEffect, useState } from "react";
import { HistoryItem, loadHistory, deleteHistoryItem, clearHistory } from "@/lib/history";

const toolLabels: Record<string, string> = {
  blog: "ブログ",
  email: "メール",
  summarize: "要約",
};

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
}

export default function HistoryDrawer({ open, onClose, onSelect }: HistoryDrawerProps) {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (open) setItems(loadHistory());
  }, [open]);

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClear = () => {
    clearHistory();
    setItems([]);
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 z-50 flex flex-col shadow-lg">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h2 className="text-sm font-medium text-gray-900">生成履歴</h2>
          <div className="flex gap-2">
            {items.length > 0 && (
              <button
                onClick={handleClear}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                全削除
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-sm text-gray-400 px-4 py-6 text-center">履歴がありません</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="px-4 py-3 hover:bg-gray-50 group">
                  <button
                    className="w-full text-left"
                    onClick={() => onSelect(item)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                        {toolLabels[item.tool] ?? item.tool}
                      </span>
                      <span className="text-xs text-gray-400">
                        {item.lang === "ja" ? "日本語" : "English"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(item.createdAt).toLocaleString("ja-JP", {
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="mt-1 text-xs text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
