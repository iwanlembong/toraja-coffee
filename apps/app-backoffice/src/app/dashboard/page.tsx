"use client";

import axios from "axios";
import { API_URL } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/auth/me`,
                {
                    withCredentials: true
                }
            );

            setUser(res.data);
        } catch {
            window.location.href = "/login";
        }
    };

    const handleLogout = async () => {
        await axios.post(
            `${API_URL}/auth/logout`,
            {},
            {
                withCredentials: true
            }
        );

        window.location.href = "/login";
    };

    if (!user) {
        return <div className="p-10">Loading...</div>;
    }

    return (
        <main className="p-10">
            <h1 className="text-4xl font-bold">
                Dashboard Admin
            </h1>

            <p className="mt-2 text-gray-600">
                Login sebagai: {user.email}
            </p>

            <p className="text-sm text-amber-700">
                Role: {user.role}
            </p>

            <div className="grid grid-cols-3 gap-6 mt-10">

                {(user.role === "SUPERADMIN" ||
                    user.role === "PRODUCT_ADMIN") && (
                        <Link
                            href="/dashboard/products"
                            className="bg-white shadow p-6 rounded-xl block"
                        >
                            Kelola Produk
                        </Link>
                    )}

                {(user.role === "SUPERADMIN" ||
                    user.role === "CONTENT_ADMIN") && (
                        <Link
                            href="/dashboard/content"
                            className="bg-white shadow p-6 rounded-xl block"
                        >
                            Kelola Konten
                        </Link>
                    )}

                {(user.role === "SUPERADMIN" ||
                    user.role === "ORDER_ADMIN") && (
                        <Link
                            href="/dashboard/orders"
                            className="bg-white shadow p-6 rounded-xl block"
                        >
                            Kelola Pesanan
                        </Link>
                    )}

                <Link href="/dashboard/analytics"
                    className="bg-white shadow p-6 rounded-xl block"
                >
                    Analytics
                </Link>

                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>
        </main>
    );
}