import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Produk"
};

export default function ProductsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}