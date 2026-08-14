# المكتبة الرقمية لسياسات ونماذج بنك الدم — MCH-Tabuk

نظام ويب كامل (Next.js + Supabase) لأرشفة وتصفح سياسات وإجراءات ونماذج بنك الدم والمختبر، مع بحث فوري، تصفية حسب القسم ونوع الملف، قاموس مصطلحات ثنائي اللغة، ولوحة تحكم لإدارة الملفات.

## 1. التقنيات المستخدمة
- **Frontend/Backend**: Next.js 14 (App Router) + TypeScript + TailwindCSS
- **قاعدة البيانات والتخزين**: Supabase (PostgreSQL + Storage) — مجاني حتى 500MB قاعدة بيانات و1GB تخزين
- **الاستضافة**: Vercel (الخطة المجانية Hobby)
- **البحث**: Fuse.js (بحث فوري من طرف المتصفح)
- **المصادقة للوحة التحكم**: كلمة مرور واحدة + JWT عبر كوكيز httpOnly (jose)

## 2. هيكل المشروع
```
blood-bank-library/
├── app/
│   ├── page.tsx              # الصفحة الرئيسية (عرض/بحث/تصفية)
│   ├── admin/page.tsx        # لوحة التحكم (محمية)
│   ├── admin/login/page.tsx  # تسجيل الدخول
│   └── api/
│       ├── auth/login, logout
│       ├── documents/        # CRUD للملفات (POST/PUT/DELETE محمية)
│       └── upload/           # رفع الملفات إلى Supabase Storage
├── components/                # DocumentCard, SearchFilterBar, TranslateWidget
├── lib/                       # supabase.ts, auth.ts, glossary.ts (قاموس المصطلحات)
├── types/document.ts
├── supabase/schema.sql        # سكربت إنشاء الجداول
└── middleware.ts              # حماية لوحة التحكم والـ API
```

---

## 3. الإعداد المحلي (قبل الرفع)

### أ. إنشاء مشروع Supabase مجاني
1. افتح https://supabase.com وأنشئ حساباً (يمكن الدخول بحساب GitHub).
2. اضغط **New Project** واختر اسماً وكلمة مرور لقاعدة البيانات ومنطقة قريبة (مثل Frankfurt أو Bahrain إن توفرت).
3. بعد الإنشاء، اذهب إلى **SQL Editor > New query**، الصق محتوى الملف `supabase/schema.sql` واضغط **Run**.
4. اذهب إلى **Storage > Create bucket**، سمّه `documents`، وفعّل خيار **Public bucket**.
5. اذهب إلى **Settings > API** وانسخ:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (سرّي جداً، لا تشاركه)

### ب. إعداد متغيرات البيئة
انسخ `.env.example` إلى `.env.local` واملأ القيم:
```bash
cp .env.example .env.local
```
وأضف كلمة مرور لوحة التحكم وسرّ JWT (أي نص عشوائي طويل):
```
ADMIN_PASSWORD=ضع-كلمة-مرور-قوية-هنا
JWT_SECRET=ضع-نصاً-عشوائياً-طويلاً-هنا
```

### ج. التشغيل محلياً (اختياري للتجربة)
```bash
npm install
npm run dev
```
افتح http://localhost:3000

---

## 4. النشر على Vercel (مجاناً) خطوة بخطوة

### الطريقة الأسهل — عبر GitHub
1. أنشئ مستودعاً جديداً على GitHub وارفع المشروع:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Blood Bank Digital Library"
   git branch -M main
   git remote add origin https://github.com/USERNAME/blood-bank-library.git
   git push -u origin main
   ```
2. افتح https://vercel.com وسجّل الدخول بحساب GitHub.
3. اضغط **Add New > Project** واختر المستودع الذي رفعته.
4. في خطوة **Configure Project > Environment Variables** أضف نفس المتغيرات الموجودة في `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
5. اضغط **Deploy** وانتظر دقيقتين تقريباً.
6. بعد اكتمال النشر ستحصل على رابط مباشر مثل:
   `https://blood-bank-library.vercel.app`
   يمكنك مشاركته مع الموظفين مباشرة، ولوحة التحكم على:
   `https://blood-bank-library.vercel.app/admin`

### الطريقة البديلة — عبر Vercel CLI (بدون GitHub)
```bash
npm install -g vercel
vercel login
vercel            # اتبع التعليمات لربط المشروع (أول مرة)
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add ADMIN_PASSWORD production
vercel env add JWT_SECRET production
vercel --prod      # النشر النهائي على رابط مباشر
```

### ربط نطاق مخصص (اختياري)
من إعدادات المشروع في Vercel > **Domains** يمكن ربط نطاق فرعي للمستشفى إن توفر (مثل `library.mch-tabuk.local` أو نطاق عام تملكه الإدارة).

---

## 5. الاستخدام اليومي
- **الموظفون**: يفتحون الرابط الرئيسي، يبحثون أو يصفّون حسب القسم/النوع، ويضغطون "فتح/تحميل الملف". زر "ترجمة المصطلحات" أعلى الصفحة يفتح قاموساً فورياً للمصطلحات الطبية/الإدارية الشائعة.
- **مسؤول المكتبة**: يدخل `/admin`، يسجّل الدخول بكلمة المرور، يرفع الملفات (PDF/DOCX/XLSX) مع تعبئة الحقول (القسم، النوع، رقم السياسة، الإصدار، تاريخ السريان...)، ويمكنه حذف أي ملف قديم.

## 6. ملاحظات أمنية
- كلمة مرور لوحة التحكم واحدة مشتركة — إن احتجتم حسابات منفصلة لكل موظف لاحقاً يمكن الترقية لاحقاً إلى Supabase Auth.
- `SUPABASE_SERVICE_ROLE_KEY` يُستخدم فقط داخل الخادم (API routes) ولا يظهر أبداً للمتصفح.
- الخطة المجانية من Supabase توقف المشروع مؤقتاً بعد 7 أيام من عدم الاستخدام (Pause) — يكفي فتح لوحة التحكم من Supabase لإعادة تفعيله فوراً بدون فقدان بيانات.

## 7. توسعات مستقبلية مقترحة
- إشعارات بريد إلكتروني عند اقتراب "تاريخ المراجعة القادمة" لأي سياسة.
- سجل تدقيق (Audit Log) لكل عملية إضافة/حذف.
- صلاحيات متعددة المستويات (مسؤول عام / مسؤول قسم).
