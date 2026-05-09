"use client";

import { useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { ORDER_STATUSES } from "@/types/order";

export default function OrderDetailDrawer({
    order,
    onClose,
    updateStatus,
    deleteOrder,
}: any) {

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    if (!order) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/40 z-40"
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full md:w-[520px] bg-white shadow-2xl z-50 overflow-y-auto animate-slide-in">
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">
                            Order #{order.id}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString("id-ID")}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Customer */}
                    <section>
                        <h3 className="font-bold mb-3">
                            Customer
                        </h3>

                        <div className="space-y-1 text-sm">
                            <p>{order.name}</p>
                            <p>{order.email}</p>
                            <p>{order.phone}</p>
                            <p>{order.city}</p>
                            <p>{order.address}</p>
                        </div>
                    </section>

                    {/* Items */}
                    <section>
                        <h3 className="font-bold mb-3">
                            Order Items
                        </h3>

                        <div className="space-y-3">
                            {order.items?.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="border rounded-lg p-3 flex justify-between"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {item.product?.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>

                                    <p className="font-bold">
                                        Rp {item.subtotal.toLocaleString("id-ID")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Notes */}
                    {order.notes && (
                        <section>
                            <h3 className="font-bold mb-2">
                                Notes
                            </h3>
                            <p className="text-gray-600">
                                {order.notes}
                            </p>
                        </section>
                    )}

                    {/* Total */}
                    <section className="border-t pt-4 flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>
                            Rp {order.total.toLocaleString("id-ID")}
                        </span>
                    </section>

                    {/* Actions */}
                    <section className="space-y-3">
                        <select
                            value={order.status}
                            onChange={(e) =>
                                updateStatus(order.id, e.target.value)
                            }
                            className="w-full border rounded-lg p-3"
                        >
                            {ORDER_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                    {status.charAt(0) + status.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full bg-red-600 text-white p-3 rounded-lg"
                        >
                            Delete Order
                        </button>
                    </section>
                </div>
            </div>
            <ConfirmModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => deleteOrder(order.id)}
                title="Delete Order"
                message={`Yakin ingin menghapus order #${order.id}? Tindakan ini tidak bisa dibatalkan.`}
            />
        </>
    );
}