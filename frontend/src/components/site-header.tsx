"use client";

import Link from "next/link";
import { Scale } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { ThemeToggle } from "@/components/theme-toggle";
import type { AccountRole } from "@/types";

type SiteHeaderProps = {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: AccountRole;
  } | null;
};

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="rounded-md bg-slate-900 p-1.5 text-white dark:bg-cyan-500">
            <Scale className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">FirstLine</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          {!user && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection("features")}
                className="hidden sm:flex"
              >
                Features
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection("professionals")}
                className="hidden sm:flex"
              >
                Professionals
              </Button>
            </>
          )}

          {user?.role === "CONSUMER" && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/discover-friends">Friends</Link>
            </Button>
          )}

          {user?.role === "PROFESSIONAL" && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/discover-friends">Client Lookup</Link>
            </Button>
          )}

          {user && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/lawyers">Discover</Link>
            </Button>
          )}

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

          <ThemeToggle />

          {user ? (
            <>
              <NotificationBell />
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
