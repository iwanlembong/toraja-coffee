export type InventoryHistory = {
  id: number;
  productId: number;
  quantity: number;
  type: "IN" | "OUT" | "ADJUSTMENT";
  note?: string;
  createdAt: string;
};