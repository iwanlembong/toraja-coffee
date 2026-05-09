"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api";
import BackToDashboard from "@/components/admin/BackToDashboard";
import ProductModal from "@/components/products/ProductModal";
import type { Product, ProductInput } from "@/types/product";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function ProductsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [pagination, setPagination] = useState<any>(null);

    const [showModal, setShowModal] = useState(false);

    const [categories, setCategories] = useState<
        { id: number; name: string }[]
    >([]);

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

    const [sortBy, setSortBy] = useState<string>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);


    const handleSort = (field: string) => {
        setPage(1); // 🔥 penting

        if (sortBy === field) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const buildFormData = (
        data: ProductInput
    ) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("slug", data.slug);
        formData.append("description", data.description);
        formData.append("price", String(data.price));
        formData.append("stock", String(data.stock));
        formData.append(
            "categoryId",
            String(data.categoryId)
        );


        if (data.image instanceof File) {
            formData.append("image", data.image);
        }

        return formData;
    };

    const createProduct = async (
        data: ProductInput
    ) => {
        await axios.post(
            `${API_URL}/products`,
            buildFormData(data),
            {
                withCredentials: true,
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );
    };

    const updateProduct = async (
        data: ProductInput
    ) => {
        await axios.put(
            `${API_URL}/products/${data.id}`,
            buildFormData(data),
            {
                withCredentials: true,
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/categories`,
                {
                    withCredentials: true,
                }
            );

            setCategories(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/products`,
                {
                    params: {
                        page,
                        limit: 10,
                        search: debouncedSearch,
                        sortBy,
                        sortOrder,
                    },
                }
            );

            setProducts(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSave = async (
        data: ProductInput
    ) => {
        if (data.id) {
            await updateProduct(data);
        } else {
            await createProduct(data);
        }

        setShowModal(false);
        fetchProducts();
    };

    const handleDelete = async () => {
        if (!deleteProductId) return;

        try {
            await axios.delete(
                `${API_URL}/products/${deleteProductId}`,
                {
                    withCredentials: true,
                }
            );

            setDeleteProductId(null);
            fetchProducts();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleEdit = (
        product: Product
    ) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    useEffect(() => {
        fetchProducts();
    }, [page, debouncedSearch, sortBy, sortOrder]);

    return (
        <div>
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <BackToDashboard />

                    <h1 className="text-4xl font-bold mt-2">
                        Kelola Produk
                    </h1>
                </div>

                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setShowModal(true);
                    }}
                    className="bg-black text-white px-5 py-3 rounded-xl">
                    + Add New Product
                </button>
            </div>

            <div className="flex items-center justify-between mb-6">
                <input
                    type="text"
                    placeholder="Cari produk..."
                    value={search}
                    onChange={(e) => {
                        setPage(1);
                        setSearch(e.target.value);
                    }}
                    className="border px-4 py-3 rounded-xl w-80"
                />
                {search !== debouncedSearch && (
                    <p className="text-sm text-gray-500 mt-1">
                        Searching...
                    </p>
                )}
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th
                                className="p-4 text-left cursor-pointer select-none"
                                onClick={() => handleSort("name")}
                            >
                                Nama Produk
                                {sortBy === "name" && (
                                    <span className="ml-1">
                                        {sortOrder === "asc" ? "↑" : "↓"}
                                    </span>
                                )}
                            </th>

                            <th
                                className="p-4 text-left cursor-pointer select-none"
                                onClick={() => handleSort("slug")}
                            >
                                Slug
                                {sortBy === "slug" && (
                                    <span className="ml-1">
                                        {sortOrder === "asc" ? "↑" : "↓"}
                                    </span>
                                )}
                            </th>

                            <th
                                className="p-4 text-center cursor-pointer select-none"
                                onClick={() => handleSort("price")}
                            >
                                Harga
                                {sortBy === "price" && (
                                    <span className="ml-1">
                                        {sortOrder === "asc" ? "↑" : "↓"}
                                    </span>
                                )}
                            </th>

                            <th
                                className="p-4 text-center cursor-pointer select-none"
                                onClick={() => handleSort("stock")}
                            >
                                Stock
                                {sortBy === "stock" && (
                                    <span className="ml-1">
                                        {sortOrder === "asc" ? "↑" : "↓"}
                                    </span>
                                )}
                            </th>

                            <th className="p-4 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map(
                            (product) => (
                                <tr
                                    key={product.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-4 font-medium">
                                        {product.name}
                                    </td>

                                    <td className="p-4 text-gray-500">
                                        {product.slug}
                                    </td>

                                    <td className="p-4 text-center">
                                        Rp{" "}
                                        {product.price.toLocaleString(
                                            "id-ID"
                                        )}
                                    </td>

                                    <td className="p-4 text-center">
                                        {product.stock}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingProduct(product);
                                                    setShowModal(true);
                                                }}
                                                className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => setDeleteProductId(product.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded-lg"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-6">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                    Prev
                </button>

                <span>
                    Page {page} / {pagination?.totalPages || 1}
                </span>

                <button
                    disabled={page === pagination?.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {showModal && (
                <ProductModal
                    product={editingProduct}
                    categories={categories}
                    onClose={() =>
                        setShowModal(false)
                    }
                    onSave={handleSave}
                />
            )}

            <ConfirmModal
                open={deleteProductId !== null}
                title="Hapus Produk"
                message="Produk yang dihapus tidak dapat dikembalikan. Lanjutkan?"
                confirmText="Ya, Hapus"
                cancelText="Batal"
                onClose={() => setDeleteProductId(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}