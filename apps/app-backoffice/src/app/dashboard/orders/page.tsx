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
      `${API_URL}/orders`,
      {
        withCredentials: true
      }
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
      { status },
      {
        withCredentials: true
      }
    );

    fetchOrders();
  };

  const deleteOrder = async (id: number) => {
    await axios.delete(
      `${API_URL}/orders/${id}`,
      {
        withCredentials: true
      }
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
            <h2 className="font-bold text-xl">
              {order.name}
            </h2>

            <p>{order.phone}</p>
            <p>{order.city}</p>
            <p>{order.address}</p>

            {order.notes && (
              <p>
                Catatan: {order.notes}
              </p>
            )}

            <p className="mt-3 font-bold">
              Rp{" "}
              {order.total.toLocaleString(
                "id-ID"
              )}
            </p>

            <div className="mt-4 flex gap-4">
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(
                    order.id,
                    e.target.value
                  )
                }
                className="border p-2 rounded"
              >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

              <button
                onClick={() =>
                  deleteOrder(order.id)
                }
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}