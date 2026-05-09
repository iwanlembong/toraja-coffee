import type { OrderStatus, } from "@/types/order";
import { ORDER_STATUSES } from "@/types/order";

type Props = {
  selectedOrders: number[];
  bulkStatus: OrderStatus | "";
  setBulkStatus: (status: OrderStatus | "") => void;
  bulkUpdateStatus: (status: OrderStatus) => Promise<void>;
  bulkDeleteOrders: () => Promise<void>;
};

export default function BulkToolbar({
  selectedOrders,
  bulkStatus,
  setBulkStatus,
  bulkUpdateStatus,
  bulkDeleteOrders,
}: Props) {
  if (
    selectedOrders.length === 0
  ) {
    return null;
  }

  return (
    <div className="sticky top-4 z-10 flex items-center justify-between border rounded-xl p-4 mb-6 bg-white/90 backdrop-blur shadow-sm">
      <p className="font-medium">
        {selectedOrders.length} order dipilih
      </p>

      <div className="flex gap-3">
        <select
          value={bulkStatus}
          onChange={(e) =>
            setBulkStatus(
              e.target.value as OrderStatus | ""
            )
          }
          className="border p-2 rounded"
        >
          <option disabled value="">
            Update Status
          </option>

          {ORDER_STATUSES.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status.charAt(0) +
                status
                  .slice(1)
                  .toLowerCase()}
            </option>
          ))}
        </select>

        <button
          disabled={!bulkStatus}
          onClick={async () => {
            if (bulkStatus) {
              await bulkUpdateStatus(bulkStatus);
            }
          }}
          className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Apply
        </button>

        <button
          onClick={async () => {
            const confirmed =
              confirm(
                "Hapus semua order terpilih?"
              );

            if (confirmed) {
              await bulkDeleteOrders();
            }
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
}