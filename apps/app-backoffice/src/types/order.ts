export type Order = {
  id: number;
  name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: {
    id: number;
    quantity: number;
    subtotal: number;
    product: {
      name: string;
    };
  }[];
};

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type StatusFilter =
  | "ALL"
  | OrderStatus;

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];