"use client";

export default function AddToCart({
  product
}: {
  product: any;
}) {
  const addToCart = () => {
    const cart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    cart.push(product);

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    alert("Produk ditambahkan ke cart");
  };

  return (
    <button
      onClick={addToCart}
      className="mt-8 bg-black text-white px-8 py-4 rounded-lg"
    >
      Add to Cart
    </button>
  );
}