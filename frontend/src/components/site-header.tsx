import Link from "next/link";
import { Scale } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import type { AccountRole } from "@/types";

type SiteHeaderProps = {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: AccountRole;
  } | null;
};

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-slate-900">
          <span className="rounded-md bg-slate-900 p-1.5 text-white">
            <Scale className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">FirstLine</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/lawyers">Explore</Link>
          </Button>

          {user?.role === "ADMIN" ? (
            <>
              <Button asChild size="sm">
                <Link href="/consumer/dashboard">Consumer Dashboard</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/professional/dashboard">Professional Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/dashboard">Admin Panel</Link>
              </Button>
            </>
          ) : null}

          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden md:flex">
                <Link href="/profile">
                  {user.name ? user.name : user.email}
                </Link>
              </Button>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
