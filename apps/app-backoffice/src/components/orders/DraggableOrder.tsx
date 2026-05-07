"use client";

import { useDraggable } from "@dnd-kit/core";
import StatusBadge from "@/components/StatusBadge";

export default function DraggableOrder({
  order,
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: order.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          {order.name}
        </h3>

        <StatusBadge
          status={order.status}
        />
      </div>

      <p className="text-sm text-gray-500 mt-2">
        {order.phone}
      </p>

      <p className="font-bold mt-3">
        Rp{" "}
        {order.total.toLocaleString(
          "id-ID"
        )}
      </p>

      <p className="text-xs text-gray-400 mt-2">
        {new Date(
          order.createdAt
        ).toLocaleDateString("id-ID")}
      </p>
    </div>
  );
}