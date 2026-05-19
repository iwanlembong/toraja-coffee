"use client";

import { useState } from "react";

type Product = {
  id: number;
  name: string;
  stock: number;
};

type Props = {
  product: Product;
  onClose: () => void;
  onSubmit: (
    quantity: number,
    note: string
  ) => Promise<void>;
};

export default function RestockModal({
  product,
  onClose,
  onSubmit,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const handleSubmit = async () => {
    await onSubmit(quantity, note);

    setQuantity(1);
    setNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-2">
          Restock Product
        </h2>

        <div className="bg-stone-50 rounded-xl p-4 mb-6">
          <p className="font-medium">
            {product.name}
          </p>

          <p className="text-sm text-gray-500">
            Current Stock: {product.stock}
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Number(e.target.value))
            }
            placeholder="Jumlah stock"
            className="w-full border p-3 rounded-xl"
          />

          <textarea
            value={note}
            onChange={(e) =>
              setNote(e.target.value)
            }
            placeholder="Catatan restock (optional)"
            className="w-full border p-3 rounded-xl"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-xl"
          >
            Restock
          </button>
        </div>
      </div>
    </div>
  );
}