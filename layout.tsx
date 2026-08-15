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
