"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Kategori",
        href: "/dashboard/categories",
    },
    {
        label: "Produk",
        href: "/dashboard/products",
    },
    {
        label: "Konten",
        href: "/dashboard/content",
    },
    {
        label: "Pesanan",
        href: "/dashboard/orders",
    },
    {
        label: "Analytics",
        href: "/dashboard/analytics",
    },
];

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [user, setUser] = useState<{
        email: string;
        role: string;
    } | null>(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/auth/me`,
                {
                    withCredentials: true,
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
                withCredentials: true,
            }
        );

        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white border-r p-6">
                <h2 className="text-2xl font-bold mb-8">
                    Toraja Admin
                </h2>

                <nav className="space-y-2">
                    {menus.map((menu) => (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={`block px-4 py-3 rounded-xl transition ${pathname === menu.href
                                ? "bg-black text-white"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            {menu.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* CONTENT */}
            <div className="flex-1">
                <header className="h-20 bg-white border-b px-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            Admin Dashboard
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                                {user?.email}
                            </p>
                            <p className="text-xs text-amber-600 font-medium">
                                {user?.role}
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm">
                            Logout
                        </button>
                    </div>
                </header>

                <div className="flex flex-col min-h-[calc(100vh-80px)]">
                    <main className="flex-1 p-8">
                        {children}
                    </main>

                    <footer className="border-t bg-white px-8 py-5">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div>
                                <p className="font-medium text-gray-700">
                                    Toraja Coffee Backoffice
                                </p>
                                <p>
                                    © {new Date().getFullYear()} All rights reserved
                                </p>
                            </div>

                            <div className="text-right">
                                <p>Version 1.0.0</p>
                                <p className="text-xs">
                                    Internal Admin System
                                </p>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}