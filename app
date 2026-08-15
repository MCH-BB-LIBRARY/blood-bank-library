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

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "حدث خطأ");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 w-full max-w-sm"
      >
        <h1 className="text-xl font-bold text-brand-700 mb-1">لوحة تحكم المكتبة</h1>
        <p className="text-sm text-gray-500 mb-6">أدخل كلمة مرور المسؤول للمتابعة</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة المرور"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <button
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 rounded-lg disabled:opacity-60"
        >
          {loading ? "جارِ الدخول..." : "دخول"}
        </button>
      </form>
    </main>
  );
}

@tailwind base;
@tailwind components;
@tailwind utilities;

html { scroll-behavior: smooth; }
body { background-color: #f7f7f8; }

import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", "", { maxAge: 0, path: "/" });
  return res;
}

import { NextRequest, NextResponse } from "next/server";
import { createSessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
  return res;
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Accepts multipart/form-data with a single "file" field.
// Uploads to the "documents" Storage bucket and returns its public URL.
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "لم يتم إرفاق ملف" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const client = supabaseAdmin();
  const { error: uploadError } = await client.storage
    .from("documents")
    .upload(safeName, buffer, { contentType: file.type });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data } = client.storage.from("documents").getPublicUrl(safeName);

  return NextResponse.json({
    file_url: data.publicUrl,
    file_type: ext?.toLowerCase(),
    file_size_kb: Math.round(buffer.byteLength / 1024),
  });
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET is public (used by the main library page) — but we also expose it here
// for convenience/testing. The client normally queries Supabase directly.
export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST creates a new document record (metadata only — file already uploaded via /api/upload)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin().from("documents").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin()
    .from("documents")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", params.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabaseAdmin().from("documents").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

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

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "المكتبة الرقمية لسياسات ونماذج بنك الدم | مستشفى الولادة والأطفال - تبوك",
  description: "مكتبة رقمية موحّدة لسياسات وإجراءات ونماذج بنك الدم والمختبر بمستشفى الولادة والأطفال - تبوك",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans text-gray-800 min-h-screen">{children}</body>
    </html>
  );
}
