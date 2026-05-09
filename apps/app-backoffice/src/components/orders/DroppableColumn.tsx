"use client";

import { useDroppable } from "@dnd-kit/core";
import React from "react";

type Props = {
  status: string;
  children: React.ReactNode;
};

export default function DroppableColumn({
  status,
  children,
}: Props) {
  const { setNodeRef, isOver } =
    useDroppable({
      id: status,
    });

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[500px]
        rounded-xl
        border
        p-4
        transition-colors
        ${
          isOver
            ? "bg-blue-50 border-blue-400"
            : "bg-gray-50"
        }
      `}
    >
      {children}
    </div>
  );
}