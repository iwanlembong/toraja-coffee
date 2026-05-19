"use client";

import Link from "next/link";
import { useState } from "react";
import CartBadge from "@/components/CartBadge";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b px-4 sm:px-8 py-4 flex items-center justify-between relative">
      {/* Logo */}
      <Link href="/" className="text-xl sm:text-2xl font-bold">
        Toraja Coffee
      </Link>

      {/* tombol mobile */}
      <button
        className="sm:hidden text-2xl"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* desktop menu */}
      <nav className="hidden sm:flex items-center gap-8">
        <Link href="/">Home</Link>
        <Link href="/cart">Cart</Link>
        <CartBadge />
      </nav>

      {/* mobile menu */}
      {open && (
        <div className="absolute top-16 right-4 bg-white border shadow-md p-4 flex flex-col gap-4 sm:hidden z-50">
          <Link href="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href="/cart" onClick={() => setOpen(false)}>
            Cart
          </Link>
          <CartBadge />
        </div>
      )}
    </header>
  );
}