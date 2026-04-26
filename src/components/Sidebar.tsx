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

function NavItems({
  pathname,
  onHistoryOpen,
  onNavClick,
}: {
  pathname: string;
  onHistoryOpen: () => void;
  onNavClick?: () => void;
}) {
  return (
    <>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {tools.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavClick}
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
          onClick={onHistoryOpen}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <span>🕐</span>
          <span>履歴</span>
        </button>
      </div>
    </>
  );
}

export default function Sidebar({ onSelectHistory }: SidebarProps) {
  const pathname = usePathname();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 flex items-center gap-3 px-4 h-13">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-gray-600 hover:text-gray-900 transition-colors p-1 -ml-1"
          aria-label="メニューを開く"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="3" y1="5" x2="17" y2="5" />
            <line x1="3" y1="10" x2="17" y2="10" />
            <line x1="3" y1="15" x2="17" y2="15" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-gray-900">AI Writing Tools</span>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-gray-200 flex-col h-full">
        <div className="px-5 py-6 border-b border-gray-200">
          <h1 className="text-base font-semibold text-gray-900 leading-tight">
            AI Writing<br />Tools
          </h1>
        </div>
        <NavItems
          pathname={pathname}
          onHistoryOpen={() => setHistoryOpen(true)}
        />
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-56 bg-white border-r border-gray-200 z-50 md:hidden flex flex-col shadow-lg">
            <div className="px-5 py-6 border-b border-gray-200 flex items-center justify-between">
              <h1 className="text-base font-semibold text-gray-900 leading-tight">
                AI Writing<br />Tools
              </h1>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="閉じる"
              >
                ✕
              </button>
            </div>
            <NavItems
              pathname={pathname}
              onHistoryOpen={() => {
                setMobileOpen(false);
                setHistoryOpen(true);
              }}
              onNavClick={() => setMobileOpen(false)}
            />
          </div>
        </>
      )}

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
