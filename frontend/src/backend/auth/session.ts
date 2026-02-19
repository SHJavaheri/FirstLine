import { jwtVerify, SignJWT } from "jose";

import { env } from "@/lib/env";
import type { AccountRole } from "@/types";

export const SESSION_COOKIE_NAME = "firstline_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  sub: string;
  email: string;
  role: AccountRole;
};

const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secret);
}

const ACCOUNT_ROLES: AccountRole[] = ["CONSUMER", "PROFESSIONAL", "ADMIN"];

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub || !payload.email) {
      return null;
    }
    if (!payload.role || typeof payload.role !== "string" || !ACCOUNT_ROLES.includes(payload.role as AccountRole)) {
      return null;
    }
    return {
      sub: payload.sub,
      email: String(payload.email),
      role: payload.role as AccountRole,
    };
  } catch {
    return null;
  }
}

export function getSessionCookieConfig(token: string) {
  return {
    name: SESSION_COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    },
  };
}

export function getClearSessionCookieConfig() {
  return {
    name: SESSION_COOKIE_NAME,
    value: "",
    options: {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 0,
    },
  };
}
