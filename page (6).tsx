"use client";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import { supabasePublic } from "@/lib/supabase";
import { LibraryDocument } from "@/types/document";
import DocumentCard from "@/components/DocumentCard";
import SearchFilterBar from "@/components/SearchFilterBar";
import TranslateWidget from "@/components/TranslateWidget";
import Link from "next/link";

export default function HomePage() {
  const [docs, setDocs] = useState<LibraryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");
  const [fileType, setFileType] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabasePublic
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setDocs(data as LibraryDocument[]);
      setLoading(false);
    })();
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(docs, {
        keys: ["title_ar", "title_en", "policy_number", "tags"],
        threshold: 0.35,
      }),
    [docs]
  );

  const filtered = useMemo(() => {
    let result = query ? fuse.search(query).map((r) => r.item) : docs;
    if (department) result = result.filter((d) => d.department === department);
    if (category) result = result.filter((d) => d.category === category);
    if (fileType) result = result.filter((d) => d.file_type === fileType);
    return result;
  }, [query, department, category, fileType, docs, fuse]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-brand-700">
            المكتبة الرقمية لسياسات ونماذج بنك الدم
          </h1>
          <p className="text-gray-500 mt-1">مستشفى الولادة والأطفال - تبوك (MCH-Tabuk)</p>
        </div>
        <div className="flex items-center gap-3">
          <TranslateWidget />
          <Link
            href="/admin"
            className="text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-4 py-2"
          >
            لوحة التحكم
          </Link>
        </div>
      </header>

      <SearchFilterBar
        query={query} setQuery={setQuery}
        department={department} setDepartment={setDepartment}
        category={category} setCategory={setCategory}
        fileType={fileType} setFileType={setFileType}
      />

      <p className="text-sm text-gray-500 mt-4 mb-2">
        {loading ? "جارِ التحميل..." : `عدد النتائج: ${filtered.length}`}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
        {filtered.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center text-gray-400 py-20">
          لا توجد ملفات مطابقة لبحثك أو عوامل التصفية الحالية.
        </div>
      )}
    </main>
  );
}
