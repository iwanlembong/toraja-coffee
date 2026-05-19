"use client";

import { useState, useEffect } from "react";
import { slugify } from "@/lib/slugify";

type Category = {
  id?: number;
  name: string;
  slug: string;
};

type Props = {
  category: Category | null;
  onClose: () => void;
  onSave: (data: Category) => Promise<void>;
};

export default function CategoryModal({
  category,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<Category>({
    name: "",
    slug: "",
  });

  useEffect(() => {
    if (category) {
      setForm({
        id: category.id,
        name: category.name || "",
        slug: category.slug || "",
      });
    } else {
      setForm({
        name: "",
        slug: "",
      });
    }
  }, [category]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
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
      [name]: value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">
          {category
            ? "Edit Category"
            : "Add Category"}
        </h2>

        <div className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Category Name"
            className="w-full border p-3 rounded-xl"
          />

          <input
            name="slug"
            value={form.slug || ""}
            onChange={handleChange}
            placeholder="Slug"
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
            onClick={() => onSave(form)}
            className="bg-black text-white px-4 py-2 rounded-xl"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}