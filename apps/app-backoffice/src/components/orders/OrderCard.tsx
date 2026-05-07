"use client";

import StatusBadge from "@/components/StatusBadge";

type Props = {
  order: any;
  expandedOrder: number | null;
  setExpandedOrder: (
    id: number | null
  ) => void;
  updateStatus: (
    id: number,
    status: string
  ) => void;
  deleteOrder: (
    id: number
  ) => void;
};

export default function OrderCard({
  order,
  expandedOrder,
  setExpandedOrder,
  updateStatus,
  deleteOrder,
}: Props) {
  return (
    <div className="border rounded-xl p-6">
      <h2 className="font-bold text-xl">
        {order.name}
      </h2>

      <div className="space-y-1 mt-2 text-sm text-gray-700">
        <p>{order.phone}</p>
        <p>{order.city}</p>
        <p>{order.address}</p>
      </div>

      {order.notes && (
        <p>
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
            {order.items.map(
              (
                item: any
              ) => (
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
          className="bg-blue-500 text-white px-4 py-2 rounded"
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
              e.target.value
            )
          }
          className="border p-2 rounded"
        >
          <option value="PENDING">
            PENDING
          </option>
          <option value="PAID">
            PAID
          </option>
          <option value="PROCESSING">
            PROCESSING
          </option>
          <option value="SHIPPED">
            SHIPPED
          </option>
          <option value="DELIVERED">
            DELIVERED
          </option>
          <option value="CANCELLED">
            CANCELLED
          </option>
        </select>

        <button
          onClick={() => {
            if (
              confirm(
                "Hapus order ini?"
              )
            ) {
              deleteOrder(
                order.id
              );
            }
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}