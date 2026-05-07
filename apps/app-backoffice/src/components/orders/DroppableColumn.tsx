"use client";

import { useDroppable } from "@dnd-kit/core";

export default function DroppableColumn({
  status,
  children,
}: any) {
  const { setNodeRef } =
    useDroppable({
      id: status,
    });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 rounded-2xl p-4 min-h-[500px]"
    >
      {children}
    </div>
  );
}