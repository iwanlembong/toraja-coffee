"use client";

import Link from "next/link";

export default function BackToDashboard() {
  return (
    <Link
      href="/dashboard"
      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6"
    >
      ← Kembali ke Dashboard
    </Link>
  );
}