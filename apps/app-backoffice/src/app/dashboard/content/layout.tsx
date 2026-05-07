import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Konten"
};

export default function ContentLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}