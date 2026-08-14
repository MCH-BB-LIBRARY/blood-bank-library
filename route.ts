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
