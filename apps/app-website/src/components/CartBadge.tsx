"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartBadge() {
  const [count, setCount] = useState(0);

  const loadCart = () => {
    const cart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const total = cart.reduce(
      (sum: number, item: any) =>
        sum + item.qty,
      0
    );

    setCount(total);
  };

  useEffect(() => {
    loadCart();

    window.addEventListener(
      "storage",
      loadCart
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadCart
      );
    };
  }, []);

  return (
    <Link
      href="/cart"
      className="relative"
    >
      🛒

      {count > 0 && (
        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
}