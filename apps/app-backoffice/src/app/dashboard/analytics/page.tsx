"use client";

import {
    useEffect,
    useState
} from "react";

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
    BarChart,
    Bar
} from "recharts";

export default function AnalyticsPage() {
    const [data, setData] =
        useState<any>(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics =
        async () => {
            const res =
                await axios.get(
                    `${API_URL}/analytics`,
                    {
                        withCredentials:
                            true
                    }
                );

            setData(res.data);
        };

    if (!data)
        return (
            <p className="p-10">
                Loading...
            </p>
        );

    const COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#8884d8",
        "#ff4d4f"
    ];

    return (
        <main className="p-10 space-y-10">
            <h1 className="text-4xl font-bold">
                Dashboard Analytics
            </h1>

            {data.totalOrders < 5 && (
                <p className="text-sm text-gray-500 mt-2">
                    Tambahkan lebih banyak transaksi untuk insight yang lebih akurat
                </p>
            )}

            {/* cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <h2>Total Orders</h2>
                    <p className="text-3xl font-bold">
                        {
                            data.totalOrders
                        }
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2>Total Revenue</h2>
                    <p className="text-3xl font-bold">
                        Rp{" "}
                        {data.revenue.toLocaleString(
                            "id-ID"
                        )}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2>
                        Produk
                        Terlaris
                    </h2>
                    <p className="text-xl font-bold">
                        {data.products[0]
                            ?.name ||
                            "-"}
                    </p>
                </div>
            </div>

            {/* sales trend */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold mb-4">
                    Sales Trend
                </h2>

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >
                    <LineChart
                        data={
                            data.salesTrend
                        }
                    >
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                            formatter={(value: any) =>
                                `Rp ${value.toLocaleString("id-ID")}`
                            }
                        />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* charts */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* status */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">
                        Order Status
                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={300}
                    >
                        <PieChart>
                            <Pie
                                data={
                                    data.statusSummary
                                }
                                dataKey="count"
                                nameKey="status"
                                outerRadius={110}
                                label={({ name, percent }) => {
                                    const value = percent ?? 0;
                                    return `${name} ${(value * 100).toFixed(0)}%`;
                                }}
                            >
                                {data.statusSummary.map(
                                    (
                                        _: any,
                                        index: number
                                    ) => (
                                        <Cell
                                            key={
                                                index
                                            }
                                            fill={
                                                COLORS[
                                                index %
                                                COLORS.length
                                                ]
                                            }
                                        />
                                    )
                                )}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* top products */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">
                        Top Products
                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={300}
                    >
                        <BarChart
                            data={
                                data.products
                            }
                        >
                            <XAxis dataKey="name" />
                            <YAxis
                                tickFormatter={(value) =>
                                    `${value / 1000}k`
                                }
                            />
                            <Tooltip />
                            <Bar
                                dataKey="sold"
                                fill="#16a34a"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* low stock */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold mb-4">
                    Low Stock Alert
                </h2>

                {data.lowStock.length === 0 ? (
                    <p className="text-green-600 font-medium">
                        Semua stok aman
                    </p>
                ) : (
                    <div className="space-y-3">
                        {data.lowStock.map(
                            (item: any) => (
                                <div
                                    key={item.id}
                                    className={`border rounded-lg p-4 flex justify-between items-center ${item.stock <= 2
                                        ? "border-red-300 bg-red-50 text-red-700"
                                        : "border-yellow-300 bg-yellow-50 text-yellow-700"
                                        }`}
                                >
                                    <div>
                                        <strong>
                                            {item.name}
                                        </strong>
                                    </div>

                                    <div className="font-bold">
                                        Stok: {item.stock}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* recent orders */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold mb-4">
                    Recent Orders
                </h2>

                {data.recentOrders.map(
                    (
                        order: any
                    ) => (
                        <div
                            key={
                                order.id
                            }
                            className="border-b py-3"
                        >
                            {
                                order.name
                            }{" "}
                            - Rp{" "}
                            {order.total.toLocaleString(
                                "id-ID"
                            )}
                        </div>
                    )
                )}
            </div>
        </main>
    );
}