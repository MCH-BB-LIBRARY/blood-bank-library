"use client";
import { DEPARTMENTS, CATEGORIES, FILE_TYPES } from "@/types/document";

interface Props {
  query: string;
  setQuery: (v: string) => void;
  department: string;
  setDepartment: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  fileType: string;
  setFileType: (v: string) => void;
}

export default function SearchFilterBar({
  query, setQuery, department, setDepartment, category, setCategory, fileType, setFileType,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ابحث بالعنوان، رقم السياسة، أو الوسم..."
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      <select value={department} onChange={(e) => setDepartment(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500">
        <option value="">كل الأقسام</option>
        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      <select value={category} onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500">
        <option value="">كل الأنواع</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={fileType} onChange={(e) => setFileType(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500">
        <option value="">كل صيغ الملفات</option>
        {FILE_TYPES.map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
      </select>
    </div>
  );
}
