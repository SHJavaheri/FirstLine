import { NextResponse } from "next/server";

import { getClearSessionCookieConfig } from "@/backend/auth/session";

export const dynamic = "force-dynamic";

export async function POST() {
  const clearCookie = getClearSessionCookieConfig();
  const response = NextResponse.json({ success: true });
  response.cookies.set(clearCookie.name, clearCookie.value, clearCookie.options);
  return response;
}
