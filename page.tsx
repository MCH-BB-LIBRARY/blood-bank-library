"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabasePublic } from "@/lib/supabase";
import { LibraryDocument, DEPARTMENTS, CATEGORIES } from "@/types/document";

const emptyForm = {
  title_ar: "",
  title_en: "",
  department: DEPARTMENTS[0],
  category: CATEGORIES[0],
  policy_number: "",
  version: "",
  effective_date: "",
  revision_due: "",
  tags: "",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [docs, setDocs] = useState<LibraryDocument[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadDocs() {
    const { data } = await supabasePublic
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });
    setDocs((data as LibraryDocument[]) || []);
  }

  useEffect(() => {
    loadDocs();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setMessage("الرجاء اختيار ملف للرفع");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadData });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadJson.error);

      const payload = {
        title_ar: form.title_ar,
        title_en: form.title_en || null,
        department: form.department,
        category: form.category,
        file_type: uploadJson.file_type,
        policy_number: form.policy_number || null,
        version: form.version || null,
        effective_date: form.effective_date || null,
        revision_due: form.revision_due || null,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        file_url: uploadJson.file_url,
        file_size_kb: uploadJson.file_size_kb,
      };

      const createRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!createRes.ok) throw new Error((await createRes.json()).error);

      setForm(emptyForm);
      setFile(null);
      setMessage("تم إضافة الملف بنجاح ✅");
      loadDocs();
    } catch (err: any) {
      setMessage("خطأ: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الملف؟")) return;
    const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
    if (res.ok) loadDocs();
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-brand-700">لوحة تحكم المكتبة الرقمية</h1>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600">
          تسجيل الخروج
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <h2 className="md:col-span-2 font-semibold text-gray-700">إضافة ملف جديد</h2>

        <input required placeholder="العنوان بالعربية" value={form.title_ar}
          onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2" />

        <input placeholder="Title in English (optional)" dir="ltr" value={form.title_en}
          onChange={(e) => setForm({ ...form, title_en: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2" />

        <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2">
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <input placeholder="رقم السياسة (اختياري) مثال: LAB-BB-GE-016" dir="ltr" value={form.policy_number}
          onChange={(e) => setForm({ ...form, policy_number: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2" />

        <input placeholder="الإصدار (اختياري) مثال: V3" value={form.version}
          onChange={(e) => setForm({ ...form, version: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2" />

        <label className="flex flex-col gap-1 text-sm text-gray-600">
          تاريخ السريان
          <input type="date" value={form.effective_date}
            onChange={(e) => setForm({ ...form, effective_date: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-600">
          تاريخ المراجعة القادمة
          <input type="date" value={form.revision_due}
            onChange={(e) => setForm({ ...form, revision_due: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2" />
        </label>

        <input placeholder="وسوم مفصولة بفاصلة (مثال: نقل دم, طوارئ)" value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 md:col-span-2" />

        <input required type="file" accept=".pdf,.docx,.xlsx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="md:col-span-2 border border-dashed border-gray-300 rounded-lg px-3 py-3" />

        {message && <p className="md:col-span-2 text-sm">{message}</p>}

        <button disabled={saving} type="submit"
          className="md:col-span-2 bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-60">
          {saving ? "جارِ الرفع..." : "رفع وإضافة الملف"}
        </button>
      </form>

      <h2 className="font-semibold text-gray-700 mb-3">الملفات الحالية ({docs.length})</h2>
      <div className="bg-white border border-gray-200 rounded-xl divide-y">
        {docs.map((d) => (
          <div key={d.id} className="flex items-center justify-between px-4 py-3 gap-3">
            <div className="min-w-0">
              <p className="font-medium truncate">{d.title_ar}</p>
              <p className="text-xs text-gray-500">{d.department} · {d.category} · {d.file_type.toUpperCase()}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a href={d.file_url} target="_blank" className="text-sm text-brand-600 hover:underline">عرض</a>
              <button onClick={() => handleDelete(d.id)} className="text-sm text-red-600 hover:underline">حذف</button>
            </div>
          </div>
        ))}
        {docs.length === 0 && <p className="text-sm text-gray-400 px-4 py-6">لا توجد ملفات مضافة بعد.</p>}
      </div>
    </main>
  );
}
