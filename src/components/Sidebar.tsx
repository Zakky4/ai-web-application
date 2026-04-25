"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import HistoryDrawer from "./HistoryDrawer";
import { HistoryItem } from "@/lib/history";

const tools = [
  { href: "/blog", label: "ブログ生成", icon: "✏️" },
  { href: "/email", label: "メール作成", icon: "✉️" },
  { href: "/summarize", label: "文章要約", icon: "📝" },
];

interface SidebarProps {
  onSelectHistory?: (item: HistoryItem) => void;
}

export default function Sidebar({ onSelectHistory }: SidebarProps) {
  const pathname = usePathname();
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <>
      <aside className="w-56 shrink-0 border-r border-gray-200 flex flex-col h-full">
        <div className="px-5 py-6 border-b border-gray-200">
          <h1 className="text-base font-semibold text-gray-900 leading-tight">
            AI Writing<br />Tools
          </h1>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {tools.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                pathname === href
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-4">
          <button
            onClick={() => setHistoryOpen(true)}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <span>🕐</span>
            <span>履歴</span>
          </button>
        </div>
      </aside>

      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelect={(item) => {
          onSelectHistory?.(item);
          setHistoryOpen(false);
        }}
      />
    </>
  );
}
