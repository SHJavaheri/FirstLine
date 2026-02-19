import type { AccountRole } from "@/types";

export function getDashboardPathByRole(role: AccountRole) {
  if (role === "ADMIN") {
    return "/admin/dashboard";
  }

  if (role === "PROFESSIONAL") {
    return "/professional/dashboard";
  }

  return "/consumer/dashboard";
}
