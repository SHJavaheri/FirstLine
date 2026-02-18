import Link from "next/link";
import { Scale } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";

type SiteHeaderProps = {
  user: {
    id: string;
    email: string;
    name: string | null;
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

        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/lawyers">Find Lawyers</Link>
          </Button>

          {user ? (
            <>
              <span className="hidden text-sm text-slate-600 md:block">
                {user.name ? user.name : user.email}
              </span>
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
