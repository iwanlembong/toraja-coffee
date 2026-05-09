"use client";

import StatusBadge from "@/components/StatusBadge";
import {
  ORDER_STATUSES
} from "@/types/order";

import type {
  Order,
  OrderStatus
} from "@/types/order";

type Props = {
  order: Order;
  expandedOrder: number | null;
  setExpandedOrder: (id: number | null) => void;
  updateStatus: (id: number, status: OrderStatus) => Promise<void>;
  setDeleteOrderId: (id: number | null) => void;
};

export default function OrderCard({
  order,
  expandedOrder,
  setExpandedOrder,
  updateStatus,
  setDeleteOrderId,
}: Props) {
  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-lg transition-all duration-200">
      <h2 className="font-bold text-xl">
        {order.name}
      </h2>

      <div className="space-y-1 mt-2 text-sm text-gray-700">
        <p>{order.phone}</p>
        <p>{order.city}</p>
        <p>{order.address}</p>
      </div>

      {order.notes && (
        <p className="mt-2 text-sm text-gray-600">
          Catatan: {order.notes}
        </p>
      )}

      <div className="flex items-center justify-between mt-4">
        <StatusBadge
          status={order.status}
        />

        <p className="font-bold">
          Rp{" "}
          {order.total.toLocaleString(
            "id-ID"
          )}
        </p>
      </div>

      {expandedOrder ===
        order.id && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-bold mb-3">
              Detail Pesanan
            </h3>

            <div className="space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">
                      {
                        item.product
                          .name
                      }
                    </p>

                    <p className="text-sm text-gray-500">
                      Qty:{" "}
                      {
                        item.quantity
                      }
                    </p>
                  </div>

                  <p className="font-semibold">
                    Rp{" "}
                    {item.subtotal.toLocaleString(
                      "id-ID"
                    )}
                  </p>
                </div>
              )
              )}
            </div>
          </div>
        )}

      <div className="mt-4 flex gap-4">
        <button
          onClick={() =>
            setExpandedOrder(
              expandedOrder ===
                order.id
                ? null
                : order.id
            )
          }
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          {expandedOrder ===
            order.id
            ? "Sembunyikan"
            : "Lihat Detail"}
        </button>

        <select
          value={order.status}
          onChange={(e) =>
            updateStatus(
              order.id,
              e.target.value as OrderStatus
            )
          }
          className="border px-4 py-2 rounded-lg"
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0) +
                status
                  .slice(1)
                  .toLowerCase()}
            </option>
          ))}
        </select>

        <button
          onClick={() => setDeleteOrderId(order.id)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}