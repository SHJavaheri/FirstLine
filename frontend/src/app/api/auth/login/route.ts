import { NextResponse } from "next/server";

import { createSessionToken, getSessionCookieConfig } from "@/backend/auth/session";
import { AuthServiceError, loginUser } from "@/backend/services/auth-service";
import { loginSchema } from "@/backend/validators/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request body." }, { status: 400 });
    }

    const user = await loginUser(parsed.data);
    const token = await createSessionToken({ sub: user.id, email: user.email, role: user.role });
    const sessionCookie = getSessionCookieConfig(token);

    const response = NextResponse.json({ user });
    response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);
    return response;
  } catch (error) {
    if (error instanceof AuthServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to login." }, { status: 500 });
  }
}
