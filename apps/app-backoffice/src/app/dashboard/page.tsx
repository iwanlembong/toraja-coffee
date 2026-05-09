"use client";

import axios from "axios";
import { API_URL } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
    ShoppingBag,
    FileText,
    Package,
    BarChart3,
    LogOut,
} from "lucide-react";

type User = {
    email: string;
    role: string;
    lastActive: string | null;
};

export default function DashboardPage() {
    const [user, setUser] =
        useState<User | null>(null);

    const router = useRouter();

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
            router.push("/login");
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

        router.push("/login");
    };

    if (!user) {
        return (
            <div className="p-10">
                Loading...
            </div>
        );
    }

    const isOnline = user?.lastActive
        ? Date.now() - new Date(user.lastActive).getTime() < 5 * 60 * 1000
        : false;

    const cards = [
         {
            title: "Kelola Categori",
            href: "/dashboard/categories",
            icon: ShoppingBag,
            roles: [
                "SUPERADMIN",
                "PRODUCT_ADMIN",
            ],
        },
        {
            title: "Kelola Produk",
            href: "/dashboard/products",
            icon: ShoppingBag,
            roles: [
                "SUPERADMIN",
                "PRODUCT_ADMIN",
            ],
        },
        {
            title: "Kelola Konten",
            href: "/dashboard/content",
            icon: FileText,
            roles: [
                "SUPERADMIN",
                "CONTENT_ADMIN",
            ],
        },
        {
            title: "Kelola Pesanan",
            href: "/dashboard/orders",
            icon: Package,
            roles: [
                "SUPERADMIN",
                "ORDER_ADMIN",
            ],
        },
        {
            title: "Analytics",
            href: "/dashboard/analytics",
            icon: BarChart3,
            roles: [
                "SUPERADMIN",
                "ORDER_ADMIN",
                "PRODUCT_ADMIN",
                "CONTENT_ADMIN",
            ],
        },
    ];

    return (
        <main className="min-h-screen bg-gray-50 p-10">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-bold">
                        Dashboard Admin
                    </h1>
                </div>

            </div>

            {/* QUICK STATS */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <p className="text-gray-500 text-sm">
                        Module Aktif
                    </p>
                    <h2 className="text-3xl font-bold">
                        4
                    </h2>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <p className="text-gray-500 text-sm">
                        Role
                    </p>
                    <h2 className="text-2xl font-bold">
                        {user.role}
                    </h2>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <p className="text-gray-500 text-sm">
                        Status
                    </p>
                    <h2
                        className={`text-sm font-bold ${isOnline
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                    >
                        {isOnline ? "Online" : "Offline"}
                    </h2>
                </div>
            </div>

            {/* MODULES */}
            <h2 className="text-xl font-semibold mb-5">
                Quick Access
            </h2>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                {cards
                    .filter((card) =>
                        card.roles.includes(user.role)
                    )
                    .map((card) => {
                        const Icon = card.icon;

                        return (
                            <Link
                                key={card.title}
                                href={card.href}
                                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition group"
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <Icon
                                        className="text-gray-700 group-hover:scale-110 transition"
                                        size={28}
                                    />
                                </div>

                                <h3 className="font-semibold text-lg">
                                    {card.title}
                                </h3>

                                <p className="text-sm text-gray-500 mt-2">
                                    Kelola dan monitor
                                </p>
                            </Link>
                        );
                    })}
            </div>
        </main>
    );
}