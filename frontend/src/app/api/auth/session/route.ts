import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { findUserById } from "@/backend/repositories/user-repository";
import { getClearSessionCookieConfig, SESSION_COOKIE_NAME, verifySessionToken } from "@/backend/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const clearCookie = getClearSessionCookieConfig();
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    const response = NextResponse.json({ user: null });
    response.cookies.set(clearCookie.name, clearCookie.value, clearCookie.options);
    return response;
  }

  const user = await findUserById(payload.sub);
  if (!user) {
    const response = NextResponse.json({ user: null });
    response.cookies.set(clearCookie.name, clearCookie.value, clearCookie.options);
    return response;
  }

  return NextResponse.json({ user });
}
