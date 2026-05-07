import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api";
import type { Pagination } from "@/types/pagination";
import type { Order } from "@/types/order";
import type { OrderStatus } from "@/types/order";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";


export default function useOrders() {
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  type StatusFilter = OrderStatus | "ALL";

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [loading, setLoading] = useState(false);

  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState("");

  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const ORDER_STATUSES = [
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ] as const;

  type OrderStatus = typeof ORDER_STATUSES[number];

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/orders`, {
        params: {
          page,
          limit: 10,
          search: debouncedSearch,
          status: statusFilter,
        },
        withCredentials: true,
      });

      setOrders(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, debouncedSearch, statusFilter]);

  // CRUD
  const updateStatus = async (id: number, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status } : o
      )
    );

    try {
      await axios.put(`${API_URL}/orders/${id}/status`, {
        status,
      });
    } catch (err) {
      fetchOrders(); // rollback kalau gagal
    }
  };


  const deleteOrder = async (id: number) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));

    try {
      await axios.delete(`${API_URL}/orders/${id}`, {
        withCredentials: true,
      });
    } catch (err) {
      fetchOrders(); // rollback kalau gagal
    }
  };
  // bulk
  const toggleOrderSelection = (id: number) => {
    setSelectedOrders((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o.id));
    }
  };

  const bulkUpdateStatus = async (status: OrderStatus) => {
    if (!selectedOrders.length) return;

    await Promise.all(
      selectedOrders.map((id) =>
        axios.put(
          `${API_URL}/orders/${id}/status`,
          { status },
          { withCredentials: true }
        )
      )
    );

    setSelectedOrders([]);
    setBulkStatus("");
    fetchOrders();
  };

  const bulkDeleteOrders = async () => {
    try {
      await Promise.all(
        selectedOrders.map((id) =>
          axios.delete(`${API_URL}/orders/${id}`, {
            withCredentials: true,
          })
        )
      );

      setSelectedOrders([]);
      fetchOrders();
    } catch (err) {
      console.log(err);
      fetchOrders(); // rollback
    }
  };

  // export
  const exportCSV = (exportSelected = false) => {
    setExporting(true);

    const data = exportSelected
      ? orders.filter((o) => selectedOrders.includes(o.id))
      : orders;

    if (!data.length) {
      setExporting(false);
      return alert("Tidak ada data");
    }

    const headers = [
      "Order ID",
      "Customer",
      "Phone",
      "City",
      "Address",
      "Status",
      "Total",
      "Created At",
    ];

    const rows = data.map((o) => [
      o.id,
      `"${o.name}"`,
      `"${o.phone}"`,
      `"${o.city}"`,
      `"${o.address}"`,
      o.status,
      o.total,
      new Date(o.createdAt).toLocaleString("id-ID"),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `orders-${Date.now()}.csv`;
    link.click();

    setExporting(false);
  };

  // drag & drop
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const id = Number(active.id);
    if (isNaN(id)) return;

    const status = over.id as OrderStatus;

    // validasi status langsung (tanpa array baru tiap render)
    if (!ORDER_STATUSES.includes(status)) return;

    const order = orders.find((o) => o.id === id);
    if (!order) return;

    if (order.status === status) return;

    await updateStatus(id, status);
  };


  const handleDragStart = (event: DragStartEvent) => {
    const order = orders.find(
      (o) => o.id === Number(event.active.id)
    );

    setActiveOrder(order || null);
  };

  return {
    // data
    orders,
    pagination,
    loading,

    // paging
    page,
    setPage,

    // search/filter
    search,
    setSearch,
    statusFilter,
    setStatusFilter,

    // selection
    selectedOrders,
    setSelectedOrders,
    toggleOrderSelection,
    toggleSelectAll,

    // bulk
    bulkStatus,
    setBulkStatus,
    bulkUpdateStatus,
    bulkDeleteOrders,

    // expand
    expandedOrder,
    setExpandedOrder,

    // export
    exportCSV,
    exporting,

    // actions
    updateStatus,
    deleteOrder,

    // drag
    handleDragEnd,
    handleDragStart,
    activeOrder,
  };
}