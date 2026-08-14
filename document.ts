export interface LibraryDocument {
  id: string;
  title_ar: string;
  title_en?: string | null;
  department: string;
  category: "سياسة" | "نموذج" | "إجراء";
  file_type: "pdf" | "docx" | "xlsx";
  policy_number?: string | null;
  version?: string | null;
  effective_date?: string | null;
  revision_due?: string | null;
  tags: string[];
  file_url: string;
  file_size_kb?: number | null;
  uploaded_by?: string | null;
  created_at: string;
  updated_at: string;
}

export const DEPARTMENTS = [
  "بنك الدم",
  "المختبر المركزي",
  "الكيمياء الحيوية",
  "الأحياء الدقيقة",
  "أمراض الدم",
  "إدارة الجودة",
];

export const CATEGORIES = ["سياسة", "نموذج", "إجراء"] as const;
export const FILE_TYPES = ["pdf", "docx", "xlsx"] as const;
