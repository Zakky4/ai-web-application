"use client";

import { Language } from "@/lib/prompts";

interface LanguageToggleProps {
  value: Language;
  onChange: (lang: Language) => void;
}

export default function LanguageToggle({ value, onChange }: LanguageToggleProps) {
  return (
    <div className="flex rounded-md border border-gray-200 overflow-hidden text-sm">
      {(["ja", "en"] as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={`px-3 py-1.5 transition-colors ${
            value === lang
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {lang === "ja" ? "日本語" : "English"}
        </button>
      ))}
    </div>
  );
}
