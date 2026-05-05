"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
                    ? {
                        ...item,
                        qty: item.qty - 1
                    }
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
        (sum, item) =>
            sum + item.price * item.qty,
        0
    );

    return (
        <main className="max-w-5xl mx-auto py-16 px-6">
            <h1 className="text-4xl font-bold mb-8">
                Keranjang Belanja
            </h1>

            <div className="space-y-6">
                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="border rounded-xl p-6 flex justify-between items-center"
                    >
                        <div>
                            <h2 className="font-bold text-lg">
                                {item.name}
                            </h2>

                            <p>
                                Qty: {item.qty}
                            </p>

                            <p>
                                Rp {(item.price * item.qty).toLocaleString("id-ID")}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() =>
                                    decreaseQty(item.id)
                                }
                                className="bg-gray-200 px-4 py-2 rounded"
                            >
                                -
                            </button>

                            <span>{item.qty}</span>

                            <button
                                onClick={() =>
                                    increaseQty(item.id)
                                }
                                className="bg-gray-200 px-4 py-2 rounded"
                            >
                                +
                            </button>

                            <button
                                onClick={() =>
                                    removeItem(item.id)
                                }
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 border-t pt-6">
                <h2 className="text-3xl font-bold">
                    Total: Rp{" "}
                    {total.toLocaleString("id-ID")}
                </h2>

                <Link
                    href="/checkout"
                    className="mt-6 inline-block bg-black text-white px-8 py-4 rounded-lg"
                >
                    Checkout
                </Link>
            </div>
        </main>
    );
}