"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { API_URL } from "@/lib/api";
import BackToDashboard from "@/components/admin/BackToDashboard";

type InventoryItem = {
    id: number;
    quantity: number;
    type: "IN" | "OUT" | "ADJUSTMENT" | "SYSTEM";
    note?: string;
    createdAt: string;

    product: {
        name: string;
    } | null;
};

export default function InventoryPage() {
    const [history, setHistory] =
        useState<InventoryItem[]>(
            []
        );

    const [range, setRange] = useState("all");

    const fetchHistory =
        async () => {
            try {
                const res =
                    await axios.get(
                        `${API_URL}/inventory`,
                        {
                            withCredentials: true,
                        }
                    );

                setHistory(
                    res.data
                );
            } catch (err) {
                console.log(err);
            }
        };

    useEffect(() => {
        fetchHistory();
    }, []);

    const filteredHistory =
        history.filter(
            (item) => {
                const itemDate =
                    new Date(
                        item.createdAt
                    );

                const now =
                    new Date();

                if (
                    range === "today"
                ) {
                    return (
                        itemDate.toDateString() ===
                        now.toDateString()
                    );
                }

                if (
                    range === "7"
                ) {
                    const past =
                        new Date();

                    past.setDate(
                        now.getDate() - 7
                    );

                    return (
                        itemDate >=
                        past
                    );
                }

                if (
                    range === "30"
                ) {
                    const past =
                        new Date();

                    past.setDate(
                        now.getDate() - 30
                    );

                    return (
                        itemDate >=
                        past
                    );
                }

                return true;
            }
        );

    const getBadge = (type: string) => {
        if (type === "IN")
            return "bg-green-100 text-green-700";

        if (type === "OUT")
            return "bg-red-100 text-red-700";

        if (type === "SYSTEM")
            return "bg-blue-100 text-blue-700";

        return "bg-yellow-100 text-yellow-700";
    };

    const totalRestock =
        filteredHistory
            .filter(
                (item) =>
                    item.type === "IN"
            )
            .reduce(
                (sum, item) =>
                    sum +
                    item.quantity,
                0
            );

    const todayActivity =
        filteredHistory.filter((item) => {
            const today =
                new Date().toDateString();

            return (
                new Date(
                    item.createdAt
                ).toDateString() ===
                today
            );
        }).length;

    const productFrequency =
        filteredHistory
            .filter((item) => item.product)
            .reduce(
                (acc, item) => {
                    const productName =
                        item.product!.name;

                    acc[productName] =
                        (acc[productName] || 0) +
                        item.quantity;

                    return acc;
                },
                {} as Record<string, number>
            );

    const mostRestocked =
        Object.entries(
            productFrequency
        ).sort(
            (a, b) =>
                b[1] - a[1]
        )[0];

    const exportCSV = () => {
        const headers = [
            "Product",
            "Type",
            "Quantity",
            "Note",
            "Date",
        ];

        const rows = filteredHistory.map(
            (item) => [
                item.product?.name ||
                "System Event",
                item.type,
                item.quantity,
                item.note || "-",
                new Date(
                    item.createdAt
                ).toLocaleString("id-ID"),
            ]
        );

        const csvContent = [
            headers,
            ...rows,
        ]
            .map((row) =>
                row
                    .map((field) =>
                        `"${field}"`
                    )
                    .join(",")
            )
            .join("\n");

        const blob = new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;",
            }
        );

        saveAs(
            blob,
            `inventory-history-${Date.now()}.csv`
        );
    };



    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <BackToDashboard />

                    <h1 className="text-4xl font-bold mt-2">
                        Inventory History
                    </h1>
                </div>

                <button
                    onClick={exportCSV}
                    className="bg-black text-white px-5 py-3 rounded-xl"
                >
                    Export CSV
                </button>
            </div>
            {/* ANALYTICS CARD */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                    <p className="text-sm text-green-600">
                        Total Restock
                    </p>

                    <h3 className="text-3xl font-bold text-green-700 mt-2">
                        {totalRestock}
                    </h3>

                    <p className="text-sm text-green-500 mt-1">
                        Total unit masuk
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                    <p className="text-sm text-blue-600">
                        Activity Today
                    </p>

                    <h3 className="text-3xl font-bold text-blue-700 mt-2">
                        {todayActivity}
                    </h3>

                    <p className="text-sm text-blue-500 mt-1">
                        Movement hari ini
                    </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
                    <p className="text-sm text-yellow-600">
                        History Entries
                    </p>

                    <h3 className="text-3xl font-bold text-yellow-700 mt-2">
                        {filteredHistory.length}
                    </h3>

                    <p className="text-sm text-yellow-500 mt-1">
                        Total log inventory
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
                    <p className="text-sm text-purple-600">
                        Most Restocked
                    </p>

                    <h3 className="text-lg font-bold text-purple-700 mt-2 truncate">
                        {mostRestocked?.[0] || "-"}
                    </h3>

                    <p className="text-sm text-purple-500 mt-1">
                        {mostRestocked?.[1] || 0} unit
                    </p>
                </div>
            </div>

            {/* FILTERS */}
            <div className="flex gap-3 mb-6">
                {[
                    {
                        label: "All",
                        value: "all",
                    },
                    {
                        label: "Today",
                        value: "today",
                    },
                    {
                        label: "7 Days",
                        value: "7",
                    },
                    {
                        label: "30 Days",
                        value: "30",
                    },
                ].map((item) => (
                    <button
                        key={item.value}
                        onClick={() =>
                            setRange(
                                item.value
                            )
                        }
                        className={`px-4 py-2 rounded-xl border ${range ===
                            item.value
                            ? "bg-black text-white"
                            : "bg-white"
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-left">
                                Product
                            </th>

                            <th className="p-4 text-center">
                                Type
                            </th>

                            <th className="p-4 text-center">
                                Qty
                            </th>

                            <th className="p-4 text-left">
                                Note
                            </th>

                            <th className="p-4 text-center">
                                Date
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredHistory.map(
                            (item) => (
                                <tr
                                    key={item.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-4 font-medium">
                                        {item.product?.name || "System Event"}
                                    </td>

                                    <td className="p-4 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${getBadge(
                                                item.type
                                            )}`}
                                        >
                                            {
                                                item.type
                                            }
                                        </span>
                                    </td>

                                    <td className="p-4 text-center font-semibold">
                                        {
                                            item.quantity
                                        }
                                    </td>

                                    <td className="p-4 text-gray-600">
                                        {item.note ||
                                            "-"}
                                    </td>

                                    <td className="p-4 text-center text-sm text-gray-500">
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleString(
                                            "id-ID", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        }
                                        )}
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}