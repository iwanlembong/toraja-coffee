type Props = {
  selectedOrders: number[];
  exportCSV: (
    exportSelected?: boolean
  ) => void;

  exporting: boolean;
};

export default function ExportToolbar({
  selectedOrders,
  exportCSV,
  exporting,
}: Props) {
  return (
    <div className="flex gap-3 mb-6">
      <button
        disabled={exporting}
        onClick={() =>
          exportCSV(false)
        }
        className="border px-4 py-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
      >
        {exporting
          ? "Exporting..."
          : "Export All"}
      </button>

      {selectedOrders.length >
        0 && (
        <button
          disabled={exporting}
          onClick={() =>
            exportCSV(true)
          }
          className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {exporting
            ? "Exporting..."
            : "Export Selected"}
        </button>
      )}
    </div>
  );
}