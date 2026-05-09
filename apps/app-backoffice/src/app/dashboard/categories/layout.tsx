import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Categori"
};

export default function CategoryLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}