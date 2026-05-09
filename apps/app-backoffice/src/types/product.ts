export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image?: string | null;
  categoryId: number;
  category?: Category;
};

export type ProductInput = {
  id?: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image?: string | File | null;
  categoryId: number;
};