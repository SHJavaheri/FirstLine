import "server-only";

import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";

import { findUserById } from "@/backend/repositories/user-repository";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/backend/auth/session";

export async function getCurrentUser() {
  noStore();

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return null;
  }

  return findUserById(payload.sub);
}
