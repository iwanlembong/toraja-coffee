type Props = {
  stock: number;
};

export default function StockBadge({
  stock,
}: Props) {
  let label = "In Stock";
  let styles =
    "bg-green-100 text-green-700";

  if (stock <= 3) {
    label = "Critical";
    styles =
      "bg-red-100 text-red-700";
  } else if (stock <= 10) {
    label = "Low Stock";
    styles =
      "bg-yellow-100 text-yellow-700";
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <span className="font-medium">
        {stock}
      </span>

      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all hover:scale-105 ${styles}`}
      >
        {label}
      </span>
    </div>
  );
}