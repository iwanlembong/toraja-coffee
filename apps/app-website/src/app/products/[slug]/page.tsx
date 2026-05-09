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
      <div className="p-10 text-center">
        Produk tidak ditemukan
      </div>
    );
  }

console.log(product);

  return (
    <main className="max-w-6xl mx-auto py-16 px-6">
      <div className="grid md:grid-cols-2 gap-12">
        <img
          src={`${API_URL}${product.image}`}
          alt={product.name}
          className="w-full rounded-xl"
        />

        <div>
          <p className="text-sm text-gray-500">
            {product.category?.name}
          </p>

          <h1 className="text-4xl font-bold mt-2">
            {product.name}
          </h1>

          <p className="mt-6 text-gray-700">
            {product.description}
          </p>

          <p className="mt-8 text-3xl font-bold text-amber-700">
            Rp {product.price.toLocaleString("id-ID")}
          </p>

          <AddToCart product={product} />
        </div>
      </div>
    </main>
  );
}