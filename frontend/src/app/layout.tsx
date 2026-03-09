import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";

import { getCurrentUser } from "@/backend/auth/current-user";
import { Providers } from "@/components/providers";
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
  description: "Discover trusted professionals across law, finance, real estate, therapy, consulting, and more.",
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
        <Providers
          user={
            user
              ? { id: user.id, email: user.email, name: name || user.email, role: user.role }
              : null
          }
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
