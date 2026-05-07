"use client";

import React from "react";

import StatusBadge from "@/components/StatusBadge";

type Props = {
  filteredOrders: any[];

  selectedOrders: number[];

  toggleSelectAll: () => void;

  toggleOrderSelection: (
    id: number
  ) => void;

  expandedOrder: number | null;

  setExpandedOrder: (
    id: number | null
  ) => void;

  deleteOrder: (
    id: number
  ) => void;
};

export default function OrderTable({
  filteredOrders,
  selectedOrders,
  toggleSelectAll,
  toggleOrderSelection,
  expandedOrder,
  setExpandedOrder,
  deleteOrder,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-12 text-center">
              <input
                type="checkbox"
                checked={
                  selectedOrders.length ===
                    filteredOrders.length &&
                  filteredOrders.length > 0
                }
                onChange={
                  toggleSelectAll
                }
              />
            </th>

            <th className="text-left p-4">
              Customer
            </th>

            <th className="text-left p-4">
              Phone
            </th>

            <th className="text-left p-4">
              City
            </th>

            <th className="text-left p-4">
              Total
            </th>

            <th className="text-left p-4">
              Status
            </th>

            <th className="text-left p-4">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.map(
            (order: any) => (
              <React.Fragment
                key={order.id}
              >
                <tr className="border-t hover:bg-gray-50 transition-all duration-200">
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(
                        order.id
                      )}
                      onChange={() =>
                        toggleOrderSelection(
                          order.id
                        )
                      }
                    />
                  </td>

                  <td className="p-4 font-medium">
                    {order.name}
                  </td>

                  <td className="p-4">
                    {order.phone}
                  </td>

                  <td className="p-4">
                    {order.city}
                  </td>

                  <td className="p-4 font-semibold">
                    Rp{" "}
                    {order.total.toLocaleString(
                      "id-ID"
                    )}
                  </td>

                  <td className="p-4">
                    <StatusBadge
                      status={
                        order.status
                      }
                    />
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder ===
                              order.id
                              ? null
                              : order.id
                          )
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        {expandedOrder ===
                        order.id
                          ? "Hide"
                          : "Detail"}
                      </button>

                      <button
                        onClick={() => {
                          const confirmed =
                            confirm(
                              "Hapus order ini?"
                            );

                          if (
                            confirmed
                          ) {
                            deleteOrder(
                              order.id
                            );
                          }
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>

                {expandedOrder ===
                  order.id && (
                  <tr>
                    <td
                      colSpan={7}
                      className="bg-gray-50 p-6"
                    >
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg">
                          Detail Pesanan
                        </h3>

                        {order.items.map(
                          (
                            item: any
                          ) => (
                            <div
                              key={
                                item.id
                              }
                              className="flex justify-between border-b pb-2"
                            >
                              <div>
                                <p className="font-medium">
                                  {
                                    item
                                      .product
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

                        {order.notes && (
                          <div>
                            <p className="font-semibold">
                              Catatan:
                            </p>

                            <p className="text-gray-600">
                              {
                                order.notes
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}