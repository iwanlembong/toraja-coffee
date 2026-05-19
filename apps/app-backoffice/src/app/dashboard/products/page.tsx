"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api";
import { getImageUrl } from "@/lib/image";
import type { Product, ProductInput } from "@/types/product";
import BackToDashboard from "@/components/admin/BackToDashboard";
import ProductModal from "@/components/products/ProductModal";
import StockBadge from "@/components/products/StockBadge";
import ConfirmModal from "@/components/ui/ConfirmModal";
import RestockModal from "@/components/products/RestockModal";

export default function ProductsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [pagination, setPagination] = useState<any>(null);

    const [showModal, setShowModal] = useState(false);


    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

    const [sortBy, setSortBy] = useState<string>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [stockFilter, setStockFilter] = useState("");
    const [restockProduct, setRestockProduct] = useState<Product | null>(null);

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
                        categoryId: categoryFilter,
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

    const handleEdit = (
        product: Product
    ) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    const handleRestock = async (
        quantity: number,
        note: string
    ) => {
        if (!restockProduct) return;

        try {
            await axios.post(
                `${API_URL}/inventory/restock/${restockProduct.id}`,
                {
                    quantity,
                    note,
                },
                {
                    withCredentials: true,
                }
            );

            setRestockProduct(null);
            fetchProducts();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, debouncedSearch, sortBy, sortOrder, categoryFilter]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const criticalProducts =
        products.filter(
            (product) => product.stock <= 3
        );

    const lowProducts =
        products.filter(
            (product) =>
                product.stock > 3 &&
                product.stock <= 10
        );


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

            <div className="space-y-6 mb-8">
                {/* TOP TOOLBAR */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={search}
                            onChange={(e) => {
                                setPage(1);
                                setSearch(e.target.value);
                            }}
                            className="border px-4 py-3 rounded-xl w-full md:w-80"
                        />

                        <select
                            value={categoryFilter}
                            onChange={(e) => {
                                setPage(1);
                                setCategoryFilter(e.target.value);
                            }}
                            className="border px-4 py-3 rounded-xl"
                        >
                            <option value="">Semua Category</option>

                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        {categoryFilter && (
                            <button
                                onClick={() => setCategoryFilter("")}
                                className="px-4 py-3 border rounded-xl"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    {search !== debouncedSearch && (
                        <p className="text-sm text-gray-500">
                            Searching...
                        </p>
                    )}
                </div>

                {/* STOCK SUMMARY */}
                <div className="grid md:grid-cols-3 gap-4">
                    <button
                        onClick={() => setStockFilter("critical")}
                        className="bg-red-50 border border-red-200 rounded-2xl p-5 text-left hover:shadow-md transition"
                    >
                        <p className="text-sm text-red-500">
                            Critical Stock
                        </p>

                        <h3 className="text-3xl font-bold text-red-700 mt-2">
                            {criticalProducts.length}
                        </h3>

                        <p className="text-sm text-red-500 mt-1">
                            Perlu restock segera
                        </p>
                    </button>

                    <button
                        onClick={() => setStockFilter("low")}
                        className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-left hover:shadow-md transition"
                    >
                        <p className="text-sm text-yellow-600">
                            Low Stock
                        </p>

                        <h3 className="text-3xl font-bold text-yellow-700 mt-2">
                            {lowProducts.length}
                        </h3>

                        <p className="text-sm text-yellow-600 mt-1">
                            Mulai menipis
                        </p>
                    </button>

                    <button
                        onClick={() => setStockFilter("")}
                        className="bg-green-50 border border-green-200 rounded-2xl p-5 text-left hover:shadow-md transition"
                    >
                        <p className="text-sm text-green-600">
                            All Products
                        </p>

                        <h3 className="text-3xl font-bold text-green-700 mt-2">
                            {products.length}
                        </h3>

                        <p className="text-sm text-green-600 mt-1">
                            Reset filter
                        </p>
                    </button>
                </div>
            </div>

            {stockFilter && (
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Filter aktif:
                        <span className="font-semibold ml-2">
                            {stockFilter}
                        </span>
                    </p>

                    <button
                        onClick={() =>
                            setStockFilter("")
                        }
                        className="text-sm text-blue-600"
                    >
                        Clear
                    </button>
                </div>
            )}

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

                            <th className="p-4 text-left cursor-pointer select-none"
                                onClick={() => handleSort("categoryId")}
                            >
                                Category
                                {sortBy === "categoryId" && (
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
                        {products
                            .filter((product) => {
                                if (stockFilter === "critical")
                                    return product.stock <= 3;

                                if (stockFilter === "low")
                                    return (
                                        product.stock > 3 &&
                                        product.stock <= 10
                                    );

                                if (stockFilter === "safe")
                                    return product.stock > 10;

                                return true;
                            })
                            .map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b hover:bg-stone-50 transition-colors duration-200"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {product.image && (
                                                <img
                                                    src={getImageUrl(product.image)}
                                                    alt={product.name}
                                                    className="w-14 h-14 object-cover rounded-xl"
                                                />
                                            )}

                                            <div>
                                                <p className="font-medium">
                                                    {product.name}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {product.slug}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <span className="px-3 py-1 bg-stone-100 rounded-full text-sm">
                                            {product.category?.name || "-"}
                                        </span>
                                    </td>

                                    <td className="p-4 text-center">
                                        Rp{" "}
                                        {product.price.toLocaleString(
                                            "id-ID"
                                        )}
                                    </td>

                                    <td className="p-4 text-center">
                                        <StockBadge stock={product.stock} />
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
                                                onClick={() =>
                                                    setRestockProduct(product)
                                                }
                                                className="bg-green-500 text-white px-3 py-1 rounded-lg"
                                            >
                                                Restock
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

            {restockProduct && (
                <RestockModal
                    product={restockProduct}
                    onClose={() =>
                        setRestockProduct(null)
                    }
                    onSubmit={handleRestock}
                />
            )}
        </div>
    );
}