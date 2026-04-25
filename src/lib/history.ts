export type ToolType = "blog" | "email" | "summarize";

export interface HistoryItem {
  id: string;
  tool: ToolType;
  title: string;
  content: string;
  lang: string;
  createdAt: number;
}

const STORAGE_KEY = "ai-writing-history";
const MAX_ITEMS = 20;

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function saveHistory(item: Omit<HistoryItem, "id" | "createdAt">): void {
  const history = loadHistory();
  const newItem: HistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  const updated = [newItem, ...history].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteHistoryItem(id: string): void {
  const history = loadHistory().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
