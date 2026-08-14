// Bilingual glossary: blood bank / laboratory medical & administrative terminology.
// Used by the "Translate Terms" widget — pure client-side lookup, no external API needed.
// Extend this list any time; it drives both EN->AR and AR->EN lookup.

export interface GlossaryEntry {
  en: string;
  ar: string;
  category: "طبي" | "إداري"; // medical | administrative
  note?: string;
}

export const GLOSSARY: GlossaryEntry[] = [
  { en: "Blood Bank", ar: "بنك الدم", category: "إداري" },
  { en: "Transfusion Medicine", ar: "طب نقل الدم", category: "طبي" },
  { en: "Massive Transfusion Protocol (MTP)", ar: "بروتوكول نقل الدم الضخم", category: "طبي" },
  { en: "Pre-transfusion Testing", ar: "الفحوصات ما قبل نقل الدم", category: "طبي" },
  { en: "Emergency Blood Release", ar: "الصرف الإسعافي للدم", category: "طبي" },
  { en: "Transfusion Reaction", ar: "تفاعل نقل الدم", category: "طبي" },
  { en: "Crossmatch", ar: "التوافق النسيجي / الكروس ماتش", category: "طبي" },
  { en: "Blood Typing", ar: "تحديد فصيلة الدم", category: "طبي" },
  { en: "Antibody Screening", ar: "فحص الأجسام المضادة", category: "طبي" },
  { en: "Packed Red Blood Cells (PRBC)", ar: "خلايا الدم الحمراء المرصوصة", category: "طبي" },
  { en: "Fresh Frozen Plasma (FFP)", ar: "البلازما الطازجة المجمدة", category: "طبي" },
  { en: "Platelet Concentrate", ar: "مركز الصفائح الدموية", category: "طبي" },
  { en: "Cryoprecipitate", ar: "الراسب البردي", category: "طبي" },
  { en: "Original Unit Label", ar: "الملصق الأصلي للوحدة", category: "إداري" },
  { en: "Blood Unit", ar: "وحدة الدم", category: "طبي" },
  { en: "Issue Counter", ar: "عداد / نقطة صرف الدم", category: "إداري" },
  { en: "Chain of Custody", ar: "سلسلة العهدة", category: "إداري" },
  { en: "Cold Chain", ar: "سلسلة التبريد", category: "إداري" },
  { en: "Authorized Nursing Staff", ar: "طاقم التمريض المخوّل", category: "إداري" },
  { en: "Patient Care Technician (PCT)", ar: "فني رعاية المرضى", category: "إداري" },
  { en: "Standard Operating Procedure (SOP)", ar: "إجراء التشغيل القياسي", category: "إداري" },
  { en: "Policy", ar: "سياسة", category: "إداري" },
  { en: "Form", ar: "نموذج", category: "إداري" },
  { en: "Version", ar: "الإصدار", category: "إداري" },
  { en: "Effective Date", ar: "تاريخ السريان", category: "إداري" },
  { en: "Revision Due Date", ar: "تاريخ المراجعة القادمة", category: "إداري" },
  { en: "Approved By", ar: "اعتمد من قبل", category: "إداري" },
  { en: "Quality Assurance (QA)", ar: "ضمان الجودة", category: "إداري" },
  { en: "Quality Control (QC)", ar: "مراقبة الجودة", category: "إداري" },
  { en: "Accreditation", ar: "الاعتماد المؤسسي", category: "إداري" },
  { en: "Hemolysis", ar: "انحلال الدم", category: "طبي" },
  { en: "Hemovigilance", ar: "الترصد الدموي", category: "طبي" },
  { en: "Donor Screening", ar: "فحص المتبرعين", category: "طبي" },
  { en: "Apheresis", ar: "فصادة الدم", category: "طبي" },
  { en: "Rh Factor", ar: "عامل ريسوس", category: "طبي" },
  { en: "ABO Grouping", ar: "تصنيف فصيلة الدم ABO", category: "طبي" },
  { en: "Direct Antiglobulin Test (DAT)", ar: "اختبار كومبس المباشر", category: "طبي" },
  { en: "Indirect Antiglobulin Test (IAT)", ar: "اختبار كومبس غير المباشر", category: "طبي" },
  { en: "Blood Component", ar: "مكون الدم", category: "طبي" },
  { en: "Autologous Transfusion", ar: "نقل الدم الذاتي", category: "طبي" },
  { en: "Informed Consent", ar: "الموافقة المستنيرة", category: "إداري" },
  { en: "Traceability", ar: "قابلية التتبع", category: "إداري" },
  { en: "Corrective and Preventive Action (CAPA)", ar: "الإجراءات التصحيحية والوقائية", category: "إداري" },
  { en: "Non-conformance", ar: "عدم المطابقة", category: "إداري" },
  { en: "Laboratory Information System (LIS)", ar: "نظام معلومات المختبر", category: "إداري" },
  { en: "Reagent", ar: "الكاشف", category: "طبي" },
  { en: "Centrifuge", ar: "جهاز الطرد المركزي", category: "طبي" },
  { en: "Turnaround Time (TAT)", ar: "زمن إنجاز الفحص", category: "إداري" },
  { en: "Wristband Verification", ar: "التحقق من سوار الهوية", category: "إداري" },
  { en: "Two-Person Verification", ar: "التحقق من قبل شخصين", category: "إداري" },
];

export function searchGlossary(query: string): GlossaryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return GLOSSARY.filter(
    (e) => e.en.toLowerCase().includes(q) || e.ar.includes(query.trim())
  );
}
