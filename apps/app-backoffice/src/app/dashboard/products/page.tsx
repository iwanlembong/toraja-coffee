"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api";

const checkAccess = async () => {
    const res = await axios.get(
        `${API_URL}/auth/me`,
        {
            withCredentials: true
        }
    );

    const role = res.data.role;

    if (
        role !== "SUPERADMIN" &&
        role !== "PRODUCT_ADMIN"
    ) {
        window.location.href = "/dashboard";
    }
};

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] =
        useState<number | null>(null);
    const [image, setImage] =
        useState<File | null>(null);

    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "1",
    });

    const fetchProducts = async () => {
        const res = await axios.get(
            `${API_URL}/products`,
            {
                withCredentials: true,
            }
        );

        setProducts(res.data);
    };

    useEffect(() => {
        checkAccess();
        fetchProducts();
    }, []);

    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.value,
        });
    };

    const resetForm = () => {
        setForm({
            name: "",
            slug: "",
            description: "",
            price: "",
            stock: "",
            categoryId: "1",
        });

        setEditingId(null);
        setImage(null);
    };

    const handleSubmit = async (
        e: any
    ) => {
        e.preventDefault();

        const formData =
            new FormData();

        Object.entries(form).forEach(
            ([key, value]) => {
                formData.append(
                    key,
                    value
                );
            }
        );

        if (image) {
            formData.append(
                "image",
                image
            );
        }

        try {
            if (editingId) {
                await axios.put(
                    `${API_URL}/products/${editingId}`,
                    formData,
                    {
                        withCredentials: true,
                    }
                );
            } else {
                await axios.post(
                    `${API_URL}/products`,
                    formData,
                    {
                        withCredentials: true,
                    }
                );
            }

            fetchProducts();
            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (
        id: number
    ) => {
        await axios.delete(
            `${API_URL}/products/${id}`,
            {
                withCredentials: true,
            }
        );

        fetchProducts();
    };

    const handleEdit = (
        product: any
    ) => {
        setEditingId(product.id);

        setForm({
            name: product.name,
            slug: product.slug,
            description:
                product.description,
            price:
                product.price.toString(),
            stock:
                product.stock.toString(),
            categoryId:
                product.categoryId.toString(),
        });
    };

    return (
        <main className="p-10">
            <h1 className="text-3xl font-bold mb-8">
                Kelola Produk
            </h1>

            <form
                onSubmit={
                    handleSubmit
                }
                className="space-y-4 max-w-xl mb-12"
            >
                <input
                    name="name"
                    placeholder="Nama Produk"
                    value={form.name}
                    onChange={
                        handleChange
                    }
                    className="w-full border p-3 rounded"
                />

                <input
                    name="slug"
                    placeholder="Slug"
                    value={form.slug}
                    onChange={
                        handleChange
                    }
                    className="w-full border p-3 rounded"
                />

                <textarea
                    name="description"
                    placeholder="Deskripsi"
                    value={
                        form.description
                    }
                    onChange={
                        handleChange
                    }
                    className="w-full border p-3 rounded"
                />

                <input
                    name="price"
                    type="number"
                    placeholder="Harga"
                    value={form.price}
                    onChange={
                        handleChange
                    }
                    className="w-full border p-3 rounded"
                />

                <input
                    name="stock"
                    type="number"
                    placeholder="Stok"
                    value={form.stock}
                    onChange={
                        handleChange
                    }
                    className="w-full border p-3 rounded"
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setImage(
                            e.target
                                .files?.[0] ||
                            null
                        )
                    }
                    className="w-full border p-3 rounded"
                />

                <button
                    className="bg-black text-white px-6 py-3 rounded"
                    type="submit"
                >
                    {editingId
                        ? "Update Produk"
                        : "Tambah Produk"}
                </button>
            </form>

            <div className="space-y-4">
                {products.map(
                    (product: any) => (
                        <div
                            key={product.id}
                            className="border p-4 rounded flex justify-between items-center"
                        >
                            <div>
                                <h2 className="font-bold">
                                    {product.name}
                                </h2>

                                <p>
                                    Rp{" "}
                                    {product.price.toLocaleString(
                                        "id-ID"
                                    )}
                                </p>
                            </div>

                            <div className="space-x-2">
                                <button
                                    onClick={() =>
                                        handleEdit(
                                            product
                                        )
                                    }
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(
                                            product.id
                                        )
                                    }
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    )
                )}
            </div>
        </main>
    );
}