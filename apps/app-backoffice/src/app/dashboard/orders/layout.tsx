import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Pesanan"
};

export default function OrdersLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}