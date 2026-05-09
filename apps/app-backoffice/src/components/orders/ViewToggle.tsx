export type ViewMode =
  | "card"
  | "table"
  | "kanban";

type Props = {
  viewMode: ViewMode;
  setViewMode: (
    mode: ViewMode
  ) => void;
};

const views: ViewMode[] = [
  "card",
  "table",
  "kanban",
];

export default function ViewToggle({
  viewMode,
  setViewMode,
}: Props) {
  return (
    <div className="flex gap-2">
      {views.map((mode) => (
        <button
          key={mode}
          onClick={() =>
            setViewMode(mode)
          }
          className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
            viewMode === mode
              ? "bg-black text-white border-black"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          {mode.charAt(0).toUpperCase() +
            mode.slice(1)}{" "}
          View
        </button>
      ))}
    </div>
  );
}