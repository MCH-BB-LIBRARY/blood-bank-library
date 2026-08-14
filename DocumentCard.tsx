import { LibraryDocument } from "@/types/document";

const fileIcon: Record<string, string> = { pdf: "📄", docx: "📝", xlsx: "📊" };
const categoryColor: Record<string, string> = {
  "سياسة": "bg-brand-100 text-brand-700",
  "نموذج": "bg-blue-100 text-blue-700",
  "إجراء": "bg-amber-100 text-amber-700",
};

export default function DocumentCard({ doc }: { doc: LibraryDocument }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColor[doc.category] ?? "bg-gray-100 text-gray-700"}`}>
          {doc.category}
        </span>
        <span className="text-2xl" title={doc.file_type}>{fileIcon[doc.file_type] ?? "📁"}</span>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 leading-snug">{doc.title_ar}</h3>
        {doc.title_en && <p className="text-sm text-gray-500 mt-0.5" dir="ltr">{doc.title_en}</p>}
      </div>

      <div className="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1">
        <span>القسم: {doc.department}</span>
        {doc.policy_number && <span dir="ltr">رقم السياسة: {doc.policy_number}</span>}
        {doc.version && <span>الإصدار: {doc.version}</span>}
      </div>

      {doc.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {doc.tags.map((t) => (
            <span key={t} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      )}

      <a
        href={doc.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
      >
        فتح / تحميل الملف
      </a>
    </div>
  );
}
