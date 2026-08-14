"use client";
import { useState } from "react";
import { searchGlossary, GlossaryEntry } from "@/lib/glossary";

export default function TranslateWidget() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<GlossaryEntry[]>([]);
  const [open, setOpen] = useState(false);

  function handleChange(v: string) {
    setQ(v);
    setResults(searchGlossary(v));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-medium bg-white border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50"
      >
        🌐 ترجمة المصطلحات
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-20">
          <input
            autoFocus
            value={q}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="اكتب مصطلحاً بالعربية أو الإنجليزية..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <div className="mt-3 max-h-64 overflow-y-auto flex flex-col gap-2">
            {q && results.length === 0 && (
              <p className="text-xs text-gray-400">لا توجد نتائج مطابقة في القاموس.</p>
            )}
            {results.map((r) => (
              <div key={r.en} className="border border-gray-100 rounded-lg p-2">
                <p className="text-sm font-semibold text-gray-800" dir="ltr">{r.en}</p>
                <p className="text-sm text-brand-700">{r.ar}</p>
                <span className="text-[10px] text-gray-400">{r.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
