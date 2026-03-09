"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import type { AccountRole } from "@/types";

type ProvidersProps = {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: AccountRole;
  } | null;
  children: React.ReactNode;
};

export function Providers({ user, children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <>
        <SiteHeader user={user} />
        <main>{children}</main>
      </>
    </ThemeProvider>
  );
}
