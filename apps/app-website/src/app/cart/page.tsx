"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/image";

export default function CartPage() {
    const [cart, setCart] = useState<any[]>([]);

    useEffect(() => {
        const data = JSON.parse(
            localStorage.getItem("cart") || "[]"
        );
        setCart(data);
    }, []);

    const updateCart = (updatedCart: any[]) => {
        setCart(updatedCart);

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );

        window.dispatchEvent(new Event("storage"));
    };

    const increaseQty = (id: number) => {
        const updated = cart.map((item) =>
            item.id === id
                ? { ...item, qty: item.qty + 1 }
                : item
        );

        updateCart(updated);
    };

    const decreaseQty = (id: number) => {
        const updated = cart
            .map((item) =>
                item.id === id
                    ? { ...item, qty: item.qty - 1 }
                    : item
            )
            .filter((item) => item.qty > 0);

        updateCart(updated);
    };

    const removeItem = (id: number) => {
        const updated = cart.filter(
            (item) => item.id !== id
        );

        updateCart(updated);
    };

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );


    return (
        <main className="max-w-5xl mx-auto py-10 sm:py-16 px-4 sm:px-6">

            {/* TITLE */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8">
                Keranjang Belanja
            </h1>

            {/* EMPTY STATE */}
            {cart.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    Keranjang masih kosong
                </div>
            )}

            {/* CART LIST */}
            <div className="space-y-4 sm:space-y-6">
                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="
              border rounded-xl
              p-4 sm:p-6
              flex flex-col sm:flex-row
              sm:justify-between sm:items-center
              gap-4
            "
                    >
                        {/* LEFT */}
                        <div className="flex-1 flex gap-4 items-center">
                            {/* IMAGE */}
                            <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                className="w-14 h-14 sm:w-20 sm:h-20 object-cover rounded-lg border"
                            />

                            {/* INFO */}
                            <div>
                                <h2 className="font-bold text-base sm:text-lg">
                                    {item.name}
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Qty: {item.qty}
                                </p>

                                <p className="font-semibold mt-2 text-sm sm:text-base">
                                    Rp{" "}
                                    {(item.price * item.qty).toLocaleString(
                                        "id-ID"
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* RIGHT (controls) */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">

                            {/* qty controls */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        decreaseQty(item.id)
                                    }
                                    className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 rounded flex items-center justify-center"
                                >
                                    -
                                </button>

                                <span className="min-w-[24px] text-center">
                                    {item.qty}
                                </span>

                                <button
                                    onClick={() =>
                                        increaseQty(item.id)
                                    }
                                    className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 rounded flex items-center justify-center"
                                >
                                    +
                                </button>
                            </div>

                            {/* remove */}
                            <button
                                onClick={() =>
                                    removeItem(item.id)
                                }
                                className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded text-sm"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* TOTAL SECTION */}
            {cart.length > 0 && (
                <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

                    <h2 className="text-xl sm:text-2xl font-bold">
                        Total: Rp{" "}
                        {total.toLocaleString("id-ID")}
                    </h2>

                    <Link
                        href="/checkout"
                        className="
              bg-black text-white
              px-6 sm:px-8 py-3 sm:py-4
              rounded-lg font-semibold
              text-center
            "
                    >
                        Checkout
                    </Link>
                </div>
            )}
        </main>
    );
}