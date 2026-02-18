import { redirect } from "next/navigation";

import { getCurrentUser } from "@/backend/auth/current-user";
import { AuthForm } from "@/components/auth/auth-form";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/lawyers");
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <AuthForm mode="register" />
    </section>
  );
}
