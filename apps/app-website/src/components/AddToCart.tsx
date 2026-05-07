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

    alert(
      "Produk ditambahkan ke cart"
    );
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