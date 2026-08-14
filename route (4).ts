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
