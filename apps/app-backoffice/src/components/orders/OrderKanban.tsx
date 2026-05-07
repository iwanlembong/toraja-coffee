"use client";

import {
  DndContext,
  DragEndEvent,
} from "@dnd-kit/core";

import DraggableOrder from "./DraggableOrder";
import DroppableColumn from "./DroppableColumn";

type Props = {
  filteredOrders: any[];
  statuses: string[];
  handleDragEnd: (
    event: DragEndEvent
  ) => void;
};

export default function OrderKanban({
  filteredOrders,
  statuses,
  handleDragEnd,
}: Props) {
  return (
    <DndContext
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statuses.map(
          (status) => {
            const statusOrders =
              filteredOrders.filter(
                (
                  order: any
                ) =>
                  order.status ===
                  status
              );

            return (
              <DroppableColumn
                key={status}
                status={status}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold">
                    {status}
                  </h2>

                  <span className="text-sm bg-white px-2 py-1 rounded-full">
                    {
                      statusOrders.length
                    }
                  </span>
                </div>

                <div className="space-y-3">
                  {statusOrders.map(
                    (
                      order: any
                    ) => (
                      <DraggableOrder
                        key={
                          order.id
                        }
                        order={
                          order
                        }
                      />
                    )
                  )}
                </div>
              </DroppableColumn>
            );
          }
        )}
      </div>
    </DndContext>
  );
}