export type Order = {
  id: number;
  name: string;
  phone: string;
  city: string;
  address: string;
  status: string;
  total: number;
  createdAt: string;
};

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";