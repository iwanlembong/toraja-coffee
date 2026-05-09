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

console.log(products, ">>> isi products>>>")

  return (
    <main className="min-h-screen bg-stone-50">
      <section
        className="relative h-screen bg-cover bg-center flex items-center"
        style={{
          backgroundImage: "url('/hero2.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-white">
          <p className="uppercase tracking-[8px] text-sm mb-4">
            From The Highlands of Toraja
          </p>

          <h1 className="text-7xl font-bold leading-tight max-w-4xl">
            {content.heroTitle}
          </h1>

          <p className="text-xl mt-8 max-w-2xl text-stone-200">
            {content.heroSubtitle}
          </p>

          <Link
            href="#products"
            className="inline-block mt-10 bg-white text-black px-8 py-4 rounded-lg font-semibold"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <img
            src="/toraja-story.jpg"
            alt="Toraja"
            className="rounded-2xl shadow-xl"
          />

          <div>
            <p className="uppercase tracking-[6px] text-sm text-amber-700 mb-4">
              The Origin
            </p>

            <h2 className="text-5xl font-bold mb-8">
              Tanah yang Melahirkan Karakter
            </h2>

            <p className="text-lg text-gray-700 leading-8">
              {content.aboutToraja}
            </p>
          </div>
        </div>
      </section>

      <section id="products" className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="uppercase tracking-[6px] text-sm text-amber-700 mb-3">
              Signature Collection
            </p>

            <h2 className="text-5xl font-bold">
              Produk Unggulan
            </h2>

            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Pilihan kopi premium khas Toraja yang diproses
              dengan ketelitian untuk menghasilkan karakter rasa
              yang autentik.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                    className="h-72 w-full object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>

                <div className="p-7">
                  <p className="text-sm uppercase tracking-[3px] text-amber-700 mb-2">
                    {product.category.name}
                  </p>

                  <h3 className="text-2xl font-bold mb-3">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 leading-7 min-h-[80px]">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-8">
                    <p className="text-2xl font-bold text-stone-900">
                      Rp{" "}
                      {product.price.toLocaleString("id-ID")}
                    </p>

                    <span className="bg-black text-white px-5 py-3 rounded-lg group-hover:bg-amber-700 transition">
                      Detail
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-bold mb-16 text-center">
            Perjalanan Secangkir Toraja
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              "Dipetik di dataran tinggi",
              "Diproses secara tradisional",
              "Roasting presisi",
              "Disajikan penuh karakter"
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-bold text-amber-600 mb-4">
                  0{i + 1}
                </div>

                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 bg-amber-700 text-white text-center">
        <h2 className="text-5xl font-bold mb-6">
          Rasakan Toraja Dalam Setiap Seduhan
        </h2>

        <p className="text-xl mb-10">
          Origin coffee yang lahir dari pegunungan Sulawesi
        </p>

        <Link
          href="/cart"
          className="bg-white text-black px-8 py-4 rounded-lg font-semibold"
        >
          Order Sekarang
        </Link>
      </section>
    </main>
  );
}