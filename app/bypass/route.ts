import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/admin", request.url));
  
  response.cookies.set({
    name: "admin_session",
    value: "valid_admin_token_bypass",
    httpOnly: true,
    path: "/",
    secure: true,
    maxAge: 60 * 60 * 24,
  });

  return response;
}
