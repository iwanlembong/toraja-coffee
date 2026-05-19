"use client";

import { useEffect, useState } from "react";

export default function AddToCart({
  product
}: {
  product: any;
}) {

  const [showToast, setShowToast] = useState(false);
  const addToCart = () => {
    const cart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const existingIndex =
      cart.findIndex(
        (item: any) =>
          item.id === product.id
      );

    let updatedCart;

    if (existingIndex !== -1) {
      updatedCart = cart.map(
        (item: any) =>
          item.id === product.id
            ? {
              ...item,
              qty:
                item.qty + 1
            }
            : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          qty: 1
        }
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("storage")
    );

     // ❌ alert diganti modal
    setShowToast(true);
  };

  // auto hide toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <>
      <button
        onClick={addToCart}
        className="mt-8 bg-black text-white px-8 py-4 rounded-lg"
      >
        Add to Cart
      </button>

      {/* ================= TOAST ================= */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-black text-white px-5 py-3 rounded-lg shadow-lg animate-fadeIn">
            🎉 Produk ditambahkan ke cart
          </div>
        </div>
      )}
    </>
  );
}