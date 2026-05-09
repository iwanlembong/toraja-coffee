"use client";

import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { getImageUrl } from "@/lib/image";
import { slugify } from "@/lib/slugify";

import type {
  Product,
  ProductInput,
} from "@/types/product";

type Category = {
  id: number;
  name: string;
};


type Props = {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: ProductInput) => Promise<void>;
};

export default function ProductModal({
  product,
  categories,
  onClose,
  onSave,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] =
    useState<ProductInput>({
      name: "",
      slug: "",
      description: "",
      price: 0,
      stock: 0,
      image: null,
      categoryId: 0,
    });

  useEffect(() => {
    if (product) {
      setForm(product);
    }
  }, [product]);

  useEffect(() => {
    if (product?.image) {
      setPreview(getImageUrl(product.image));
    }
  }, [product]);

  // =========================
  // HANDLE IMAGE
  // =========================
  const updateImage = (file: File) => {
    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    updateImage(file);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    updateImage(file);
  };

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "name") {
      setForm({
        ...form,
        name: value,
        slug: slugify(value),
      });

      return;
    }

    setForm({
      ...form,
      [name]:
        name === "price" ||
          name === "stock" ||
          name === "categoryId"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit =
    async () => {
      await onSave(form);
    };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6">
          {product
            ? "Edit Product"
            : "Add New Product"}
        </h2>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Nama Produk"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            name="slug"
            placeholder="Slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <textarea
            name="description"
            placeholder="Deskripsi"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            name="price"
            type="number"
            placeholder="Harga"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />
          {/* CATEGORY */}
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          >
            <option value={0}>Pilih Category</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>



        {/* IMAGE UPLOAD */}
        <div className="space-y-3 mt-5">
          <label className="font-medium">
            Product Image
          </label>

          <div
            onDragOver={(e) =>
              e.preventDefault()
            }
            onDrop={handleDrop}
            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />

            <label
              htmlFor="image-upload"
              className="cursor-pointer block"
            >
              {preview ? (
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-48 h-48 object-cover rounded-xl"
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();

                      setPreview(null);

                      setForm((prev) => ({
                        ...prev,
                        image: null,
                      }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-gray-500">
                  <Upload size={36} />
                  <p>
                    Drag & drop image here
                  </p>
                  <p className="text-sm">
                    atau klik untuk upload
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-black text-white px-4 py-2 rounded-xl"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}