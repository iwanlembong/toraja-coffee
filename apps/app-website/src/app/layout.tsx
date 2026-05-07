import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import CartBadge from "@/components/CartBadge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Toraja Coffee",
  description: "Premium Toraja Coffee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b px-8 py-5 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold"
          >
            Toraja Coffee
          </Link>

          <nav className="flex items-center gap-8">
            <Link href="/">
              Home
            </Link>

            <Link href="/cart">
              Cart
            </Link>

            <CartBadge />
          </nav>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}