"use client";

import { API_URL } from "@/lib/api";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    note: ""
  });

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    setCart(data);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await axios.post(
      `${API_URL}/orders`,
      {
        ...form,
        total
      }
    );

    localStorage.removeItem("cart");

    const wa = `https://wa.me/6281234567890?text=Halo, saya sudah checkout order kopi toraja`;

    window.location.href = wa;
  };

  return (
    <main className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-8">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          name="name"
          placeholder="Nama"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="phone"
          placeholder="Nomor HP"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <textarea
          name="address"
          placeholder="Alamat"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="city"
          placeholder="Kota"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <textarea
          name="note"
          placeholder="Catatan"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <div className="text-2xl font-bold">
          Total: Rp {total.toLocaleString("id-ID")}
        </div>

        <button
          className="bg-black text-white px-8 py-4 rounded-lg"
          type="submit"
        >
          Buat Pesanan
        </button>
      </form>
    </main>
  );
}