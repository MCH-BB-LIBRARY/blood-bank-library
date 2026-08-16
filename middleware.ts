import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  const isValid = token ? await verifySessionToken(token) : false;

  const protectedAdminPage = req.nextUrl.pathname === "/admin";
  const protectedApi =
    req.nextUrl.pathname.startsWith("/api/documents") && req.method !== "GET";
  const protectedUpload = req.nextUrl.pathname.startsWith("/api/upload");

 if (protectedAdminPage && !isValid) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if ((protectedApi || protectedUpload) && !isValid) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/api/documents/:path*", "/api/upload/:path*"],
};
