"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api";
import BackToDashboard from "@/components/admin/BackToDashboard";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CategoryModal from "@/components/categories/CategoryModal";

type Category = {
  id: number;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const fetchCategories = async () => {
    const res = await axios.get(
      `${API_URL}/categories`
    );

    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (
    data: Partial<Category>
  ) => {
    if (data.id) {
      await axios.put(
        `${API_URL}/categories/${data.id}`,
        data
      );
    } else {
      await axios.post(
        `${API_URL}/categories`,
        data
      );
    }

    setShowModal(false);
    fetchCategories();
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    await axios.delete(
      `${API_URL}/categories/${deleteId}`
    );

    setDeleteId(null);
    fetchCategories();
  };

  return (
    <div>
      <BackToDashboard />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          Category Management
        </h1>

        <button
          onClick={() => {
            setEditingCategory(null);
            setShowModal(true);
          }}
          className="bg-black text-white px-5 py-3 rounded-xl"
        >
          + Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left">
                Name
              </th>
              <th className="p-4 text-left">
                Slug
              </th>
              <th className="p-4 text-center">
                Products
              </th>
              <th className="p-4 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-b"
              >
                <td className="p-4 font-medium">
                  {category.name}
                </td>

                <td className="p-4 text-gray-500">
                  {category.slug}
                </td>

                <td className="p-4 text-center">
                  {category._count?.products || 0}
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setShowModal(true);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        setDeleteId(category.id)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      <ConfirmModal
        open={deleteId !== null}
        title="Hapus Category"
        message="Category akan dihapus permanen."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}