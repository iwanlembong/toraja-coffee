"use client";

import { API_URL } from "@/lib/api";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/image";

export default function CheckoutPage() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: ""
  });

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );
    setCart(data);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
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

    setErrorMessage("");
    setLoading(true);

    try {
      await axios.post(`${API_URL}/orders`, {
        ...form,
        total,
        items: cart
      });

      localStorage.removeItem("cart");

      // const wa =
      //   `https://wa.me/6281234567890?text=Halo, saya sudah checkout order kopi toraja`;

      // window.location.href = wa;

      router.push("/checkout/success");

    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        "Checkout gagal";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto py-10 sm:py-16 px-4 sm:px-6">

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 space-y-4 sm:space-y-5"
        >

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <input
              name="name"
              placeholder="Nama"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg text-sm sm:text-base"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg text-sm sm:text-base"
            />

            <input
              name="phone"
              placeholder="Nomor HP"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg text-sm sm:text-base sm:col-span-2"
            />
          </div>

          <textarea
            name="address"
            placeholder="Alamat"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg text-sm sm:text-base"
          />

          <input
            name="city"
            placeholder="Kota"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg text-sm sm:text-base"
          />

          <textarea
            name="notes"
            placeholder="Catatan (opsional)"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg text-sm sm:text-base"
          />

          {/* ERROR */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              {errorMessage}
            </div>
          )}

          {/* BUTTON */}
          <button
            disabled={loading}
            type="submit"
            className="
              w-full
              bg-black text-white
              px-6 sm:px-8 py-3 sm:py-4
              rounded-lg font-semibold
              text-sm sm:text-base
              hover:bg-amber-700 transition
              disabled:opacity-50
            "
          >
            {loading
              ? "Memproses pesanan..."
              : "Buat Pesanan"}
          </button>
        </form>

        {/* ================= SUMMARY ================= */}
        <div className="border rounded-xl p-5 sm:p-6 h-fit">

          <h2 className="text-lg sm:text-xl font-bold mb-4">
            Ringkasan Pesanan
          </h2>

          <div className="space-y-3 text-sm sm:text-base">

            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3"
              >
                {/* LEFT: IMAGE + NAME */}
                <div className="flex items-center gap-3">

                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border"
                  />

                  <div className="flex flex-col">
                    <span className="font-medium text-sm sm:text-base">
                      {item.name}
                    </span>

                    <span className="text-xs text-gray-500">
                      Qty: {item.qty}
                    </span>
                  </div>

                </div>

                {/* RIGHT: PRICE */}
                <span className="font-medium text-sm sm:text-base">
                  Rp{" "}
                  {(item.price * item.qty).toLocaleString("id-ID")}
                </span>
              </div>
            ))}

          </div>

          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-base sm:text-lg">
            <span>Total</span>
            <span>
              Rp {total.toLocaleString("id-ID")}
            </span>
          </div>

        </div>
      </div>
    </main>
  );
}