import { redirect } from "next/navigation";

import { getCurrentUser } from "@/backend/auth/current-user";
import { getDashboardPathByRole } from "@/lib/role-navigation";
import { AuthForm } from "@/components/auth/auth-form";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(getDashboardPathByRole(user.role));
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <AuthForm mode="login" />
    </section>
  );
}
