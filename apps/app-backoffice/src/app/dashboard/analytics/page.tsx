"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

import BackToDashboard from "@/components/admin/BackToDashboard";
import RestockModal from "@/components/products/RestockModal";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [range, setRange] = useState("7d");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [showRestockModal, setShowRestockModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const [dark, setDark] = useState(false);


    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") {
            setDark(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    useEffect(() => {
        fetchAnalytics();
    }, [range]);

    const fetchAnalytics = async () => {
        setLoading(true);

        try {
            const res = await axios.get(`${API_URL}/analytics`, {
                params: {
                    range,
                    startDate,
                    endDate,
                },
                withCredentials: true,
            });

            setData(res.data);
        } finally {
            setLoading(false);
        }
    };

    const handleRestock = async (
        quantity: number,
        note: string
    ) => {
        await axios.post(
            `${API_URL}/inventory/restock`,
            {
                productId: selectedProduct.id,
                quantity,
                note,
            },
            {
                withCredentials: true,
            }
        );

        setShowRestockModal(false);
        fetchAnalytics();
    };

    // =====================
    // LOADING SKELETON
    // =====================
    if (loading) {
        return (
            <div className="p-6 space-y-6 animate-pulse">
                <div className="h-10 w-1/3 bg-gray-200 rounded" />
                <div className="grid md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-xl" />
                    ))}
                </div>
                <div className="h-64 bg-gray-200 rounded-xl" />
            </div>
        );
    }

    if (!data) return <p className="p-10">No data</p>;

    // =====================
    // SIMPLE GROWTH MOCK (bisa backend nanti)
    // =====================
    const growth = (value: number) => {
        const random = Math.floor(Math.random() * 20 - 5);
        return {
            value,
            percent: random,
        };
    };

    const totalOrders = growth(data.totalOrders);
    const revenue = growth(data.revenue);

    const criticalProducts =
        data.products?.filter(
            (product: any) => product.stock <= 3
        ) || [];

    const lowStockProducts =
        data.products?.filter(
            (product: any) =>
                product.stock > 3 &&
                product.stock <= 10
        ) || [];

    return (
        <div className="p-6 space-y-8 bg-stone-50 dark:bg-stone-950 text-black dark:text-white min-h-screen transition-colors duration-300">
            <BackToDashboard />

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

                {/* FILTER */}
                <div className="flex gap-2 items-center">
                    <button
                        onClick={() => setDark(!dark)}
                        className="px-4 py-2 rounded-lg border bg-white dark:bg-stone-800 dark:text-white transition"
                    >
                        {dark ? "☀ Light" : "🌙 Dark"}
                    </button>

                    <select
                        className="border rounded px-3 py-2 bg-white dark:bg-stone-800 dark:text-white"
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="custom">Custom</option>
                    </select>

                    {range === "custom" && (
                        <>
                            <input
                                type="date"
                                className="border rounded px-2 py-2 bg-white text-black dark:bg-stone-800 dark:text-white"
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <input
                                type="date"
                                className="border rounded px-2 py-2 bg-white text-black dark:bg-stone-800 dark:text-white"
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                            <button
                                onClick={fetchAnalytics}
                                className="px-4 py-2 rounded bg-amber-600 text-white hover:bg-amber-700 transition dark:bg-amber-500 dark:hover:bg-amber-600"
                            >
                                Apply
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid md:grid-cols-3 gap-4">
                <KpiCard
                    title="Total Orders"
                    value={totalOrders.value}
                    growth={totalOrders.percent}
                />

                <KpiCard
                    title="Revenue"
                    value={`Rp ${revenue.value.toLocaleString("id-ID")}`}
                    growth={revenue.percent}
                />

                <KpiCard
                    title="Top Product"
                    value={data.products?.[0]?.name || "-"}
                    growth={5}
                />
            </div>

            {/* SALES TREND */}
            <div className="bg-white dark:bg-stone-900 p-6 rounded-xl shadow">
                <h2 className="font-bold mb-4">Sales Trend</h2>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.salesTrend}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#16a34a"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            {/* INVENTORY MOVEMENT */}
            <div className="bg-white dark:bg-stone-900 p-6 rounded-xl shadow">
                <h2 className="font-bold mb-4">
                    Inventory Movement
                </h2>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={data.inventoryMovement}
                    >
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="IN"
                            stroke="#16a34a"
                            strokeWidth={3}
                            name="Restock"
                        />

                        <Line
                            type="monotone"
                            dataKey="OUT"
                            stroke="#dc2626"
                            strokeWidth={3}
                            name="Sales"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* CHARTS */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* STATUS */}
                <div className="bg-white dark:bg-stone-900 p-6 rounded-xl shadow">
                    <h2 className="font-bold mb-4">Order Status</h2>

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.statusSummary}
                                dataKey="count"
                                nameKey="status"
                                outerRadius={100}
                            >
                                {data.statusSummary.map((_: any, i: number) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* TOP PRODUCTS */}
                <div className="bg-white dark:bg-stone-900 p-6 rounded-xl shadow">
                    <h2 className="font-bold mb-4">Top Products</h2>

                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.products}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line dataKey="sold" stroke="#2563eb" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* LOW STOCK */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">
                        Low Stock Alert
                    </h2>

                    <span className="text-sm text-gray-500">
                        {criticalProducts.length + lowStockProducts.length} products
                    </span>
                </div>

                {criticalProducts.length + lowStockProducts.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                        Semua stok aman
                    </p>
                ) : (
                    <div className="space-y-3">
                        {[...criticalProducts, ...lowStockProducts]
                            .sort((a, b) => a.stock - b.stock)
                            .map(
                                (product: any, index: number) => (
                                    <div
                                        key={`${product.id}-${index}`}
                                        className={`flex items-center justify-between border rounded-xl px-4 py-3 ${product.stock <= 3
                                            ? "border-red-200 bg-red-50"
                                            : "border-yellow-200 bg-yellow-50"
                                            }`}
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {product.name}
                                            </p>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${product.stock <= 3
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {product.stock <= 3
                                                    ? "Critical"
                                                    : "Low"}
                                            </span>

                                            <p className="text-sm text-gray-500">
                                                Stock: {product.stock}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setSelectedProduct(product);
                                                setShowRestockModal(true);
                                            }}
                                            className="bg-black text-white px-4 py-2 rounded-lg"
                                        >
                                            Restock
                                        </button>
                                    </div>
                                )
                            )}
                    </div>
                )}
            </div>

            {/* RECENT ORDERS */}
            <div className="bg-white dark:bg-stone-900 p-6 rounded-xl shadow">
                <h2 className="font-bold mb-4">Recent Orders</h2>

                <div className="divide-y">
                    {data.recentOrders?.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">No orders yet</p>
                    ) : (
                        data.recentOrders.map((order: any) => (
                            <div
                                key={order.id}
                                className="py-3 flex items-center justify-between"
                            >
                                <div>
                                    <p className="font-medium">{order.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {order.status}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="font-bold">
                                        Rp {order.total.toLocaleString("id-ID")}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString(
                                            "id-ID"
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {showRestockModal && selectedProduct && (
                <RestockModal
                    product={selectedProduct}
                    onClose={() =>
                        setShowRestockModal(false)
                    }
                    onSubmit={handleRestock}
                />
            )}
        </div>
    );
}

// =====================
// KPI CARD COMPONENT
// =====================
function KpiCard({
    title,
    value,
    growth,
}: any) {
    const isPositive = growth >= 0;

    return (
        <div className="bg-white dark:bg-stone-900 p-5 rounded-xl shadow hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>

            <h3 className="text-2xl font-bold mt-2">{value}</h3>

            <p
                className={`text-sm mt-2 ${isPositive ? "text-green-600" : "text-red-500"
                    }`}
            >
                {isPositive ? "▲" : "▼"} {Math.abs(growth)}%
            </p>
        </div>
    );
}