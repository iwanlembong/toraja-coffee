import { API_URL } from "@/lib/api";
import AddToCart from "@/components/AddToCart";

async function getProduct(slug: string) {
  const res = await fetch(`${API_URL}/products/slug/${slug}`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return (
      <div className="p-6 sm:p-10 text-center text-sm sm:text-base">
        Produk tidak ditemukan
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto py-10 sm:py-16 px-4 sm:px-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-start">

        {/* IMAGE */}
        <div className="w-full">
          <img
            src={`${API_URL}${product.image}`}
            alt={product.name}
            className="w-full h-auto rounded-xl shadow-md object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="flex flex-col">

          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">
            {product.category?.name}
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 leading-tight">
            {product.name}
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-700 leading-6 sm:leading-7">
            {product.description}
          </p>

          <p className="mt-6 sm:mt-8 text-xl sm:text-2xl lg:text-3xl font-bold text-amber-700">
            Rp {product.price.toLocaleString("id-ID")}
          </p>

          {/* CTA spacing */}
          <div className="mt-6 sm:mt-8">
            <AddToCart product={product} />
          </div>

        </div>
      </div>
    </main>
  );
}