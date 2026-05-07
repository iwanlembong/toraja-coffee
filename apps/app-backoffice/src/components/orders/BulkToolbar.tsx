type Props = {
  selectedOrders: number[];

  bulkStatus: string;

  setBulkStatus: (
    status: string
  ) => void;

  bulkUpdateStatus: (
    status: string
  ) => void;

  bulkDeleteOrders: () => void;
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
              e.target.value
            )
          }
          className="border p-2 rounded"
        >
          <option disabled value="">
            Update Status
          </option>

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
          disabled={!bulkStatus}
          onClick={() =>
            bulkUpdateStatus(
              bulkStatus
            )
          }
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Apply
        </button>

        <button
          onClick={() => {
            const confirmed =
              confirm(
                "Hapus semua order terpilih?"
              );

            if (confirmed) {
              bulkDeleteOrders();
            }
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
}