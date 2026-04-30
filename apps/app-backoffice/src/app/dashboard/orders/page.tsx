"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api";


const checkAccess = async () => {
    const res = await axios.get(
        `${API_URL}/auth/me`,
        {
            withCredentials: true
        }
    );

    const role = res.data.role;

    if (
        role !== "SUPERADMIN" &&
        role !== "ORDER_ADMIN"
    ) {
        window.location.href = "/dashboard";
    }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get(
      `${API_URL}/orders`
    );

    setOrders(res.data);
  };

  useEffect(() => {
    checkAccess();
    fetchOrders();
  }, []);

  const updateStatus = async (
    id: number,
    status: string
  ) => {
    await axios.put(
      `${API_URL}/orders/${id}/status`,
      { status }
    );

    fetchOrders();
  };

  const deleteOrder = async (id: number) => {
    await axios.delete(
      `${API_URL}/orders/${id}`
    );

    fetchOrders();
  };

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        Order Management
      </h1>

      <div className="space-y-6">
        {orders.map((order: any) => (
          <div
            key={order.id}
            className="border rounded-xl p-6"
          >
            <div className="flex justify-between">
              <div>
                <h2 className="font-bold text-xl">
                  {order.name}
                </h2>

                <p>{order.phone}</p>
                <p>{order.city}</p>
                <p>{order.address}</p>

                {order.note && (
                  <p>
                    Catatan: {order.note}
                  </p>
                )}

                <p className="mt-3 font-bold">
                  Rp{" "}
                  {order.total.toLocaleString(
                    "id-ID"
                  )}
                </p>

                <p className="mt-2">
                  Status:
                  <span className="ml-2 font-semibold">
                    {order.status}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() =>
                    updateStatus(
                      order.id,
                      "Diproses"
                    )
                  }
                  className="block bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Diproses
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      order.id,
                      "Selesai"
                    )
                  }
                  className="block bg-green-600 text-white px-4 py-2 rounded"
                >
                  Selesai
                </button>

                <button
                  onClick={() =>
                    deleteOrder(order.id)
                  }
                  className="block bg-red-500 text-white px-4 py-2 rounded"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}