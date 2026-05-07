type Props = {
  viewMode: "card" | "table" | "kanban";
  setViewMode: (
    mode: "card" | "table" | "kanban"
  ) => void;
};

export default function ViewToggle({
  viewMode,
  setViewMode,
}: Props) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() =>
          setViewMode("card")
        }
        className={`px-4 py-2 rounded-lg border ${
          viewMode === "card"
            ? "bg-black text-white"
            : "bg-white"
        }`}
      >
        Card View
      </button>

      <button
        onClick={() =>
          setViewMode("table")
        }
        className={`px-4 py-2 rounded-lg border ${
          viewMode === "table"
            ? "bg-black text-white"
            : "bg-white"
        }`}
      >
        Table View
      </button>

      <button
        onClick={() =>
          setViewMode("kanban")
        }
        className={`px-4 py-2 rounded-lg border ${
          viewMode === "kanban"
            ? "bg-black text-white"
            : "bg-white"
        }`}
      >
        Kanban View
      </button>
    </div>
  );
}