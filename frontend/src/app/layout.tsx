import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";

import { getCurrentUser } from "@/backend/auth/current-user";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const fontSans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fontDisplay = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FirstLine",
  description: "Discover top lawyers by specialization, location, rate, and rating.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const name = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") : null;

  return (
    <html lang="en">
      <body className={`${fontSans.variable} ${fontDisplay.variable} antialiased`}>
        <SiteHeader
          user={
            user
              ? { id: user.id, email: user.email, name: name || user.email, role: user.role }
              : null
          }
        />
        <main>{children}</main>
      </body>
    </html>
  );
}
