import { API_URL } from "@/lib/api";
import Link from "next/link";

import { getImageUrl } from "@/lib/image";

async function getProducts() {
  const res = await fetch(`${API_URL}/products`, {
    cache: "no-store",
  });

  return res.json();
}

async function getContent() {
  const res = await fetch(
    `${API_URL}/content`,
    {
      cache: "no-store"
    }
  );

  return res.json();
}



export default async function Home() {
  const productsRes = await getProducts();
  const content = await getContent();

  const products = productsRes?.data || [];

  return (
    <main className="min-h-screen bg-stone-50 overflow-x-hidden">

      {/* ================= HERO ================= */}
      <section
        className="relative h-[90vh] sm:h-screen bg-cover bg-center flex items-center"
        style={{ backgroundImage: "url('/hero2.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-white">
          <p className="uppercase tracking-[4px] sm:tracking-[8px] text-xs sm:text-sm mb-3 sm:mb-4">
            From The Highlands of Toraja
          </p>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight max-w-4xl">
            {content.heroTitle}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl mt-5 sm:mt-8 max-w-2xl text-stone-200">
            {content.heroSubtitle}
          </p>

          <Link
            href="#products"
            className="inline-block mt-8 sm:mt-10 bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-center">

          <img
            src="/toraja-story.jpg"
            alt="Toraja"
            className="rounded-2xl shadow-xl w-full h-auto"
          />

          <div>
            <p className="uppercase tracking-[4px] sm:tracking-[6px] text-xs sm:text-sm text-amber-700 mb-3 sm:mb-4">
              The Origin
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 leading-tight">
              Tanah yang Melahirkan Karakter
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-7 sm:leading-8">
              {content.aboutToraja}
            </p>
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section id="products" className="py-16 sm:py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-12 sm:mb-16">
            <p className="uppercase tracking-[4px] sm:tracking-[6px] text-xs sm:text-sm text-amber-700 mb-3">
              Signature Collection
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Produk Unggulan
            </h2>

            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              Pilihan kopi premium khas Toraja yang diproses dengan ketelitian
              untuk menghasilkan karakter rasa yang autentik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {products.map((product: any) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-500"
              >
                <div className="overflow-hidden">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="h-56 sm:h-64 lg:h-72 w-full object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>

                <div className="p-5 sm:p-7">
                  <p className="text-xs sm:text-sm uppercase tracking-[3px] text-amber-700 mb-2">
                    {product.category.name}
                  </p>

                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">
                    {product.name}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-600 leading-6 sm:leading-7 min-h-[60px] sm:min-h-[80px]">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-6 sm:mt-8">
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>

                    <span className="bg-black text-white px-4 sm:px-5 py-2 sm:py-3 rounded-lg group-hover:bg-amber-700 transition text-sm sm:text-base">
                      Detail
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="py-16 sm:py-24 bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-12 sm:mb-16 text-center">
            Perjalanan Secangkir Kopi Toraja
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Dipetik di dataran tinggi",
              "Diproses secara tradisional",
              "Roasting presisi",
              "Disajikan penuh karakter"
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-amber-600 mb-3 sm:mb-4">
                  0{i + 1}
                </div>
                <p className="text-sm sm:text-base">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 sm:py-28 bg-amber-700 text-white text-center px-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 sm:mb-6">
          Rasakan Kopi Toraja Dalam Setiap Seduhan
        </h2>

        <p className="text-base sm:text-xl mb-8 sm:mb-10">
          Origin coffee yang lahir dari pegunungan Sulawesi
        </p>

        <Link
          href="/cart"
          className="bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base"
        >
          Order Sekarang
        </Link>
      </section>
    </main>
  );
}