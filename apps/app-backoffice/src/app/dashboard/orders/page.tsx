"use client";

import React from "react";
import useOrders from "@/hooks/useOrders";

import StatusBadge from "@/components/StatusBadge";
import ViewToggle from "@/components/orders/ViewToggle";
import ExportToolbar from "@/components/orders/ExportToolbar";
import BulkToolbar from "@/components/orders/BulkToolbar";
import Pagination from "@/components/orders/Pagination";
import OrderTable from "@/components/orders/OrderTable";
import OrderKanban from "@/components/orders/OrderKanban";
import OrderCard from "@/components/orders/OrderCard";

export default function OrdersPage() {
  const {
    orders,
    pagination,
    loading,

    page,
    setPage,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    selectedOrders,
    toggleOrderSelection,
    toggleSelectAll,

    bulkStatus,
    setBulkStatus,
    bulkUpdateStatus,
    bulkDeleteOrders,

    expandedOrder,
    setExpandedOrder,

    exportCSV,
    exporting,

    updateStatus,
    deleteOrder,

    handleDragEnd,
  } = useOrders();

  const [viewMode, setViewMode] = React.useState("card");

  const statuses = [
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];
  

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        Order Management
      </h1>

      {/* FILTER */}
      <div className="flex gap-4 mb-8">
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border p-3 rounded-lg flex-1"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value as any);
          }}
          className="border p-3 rounded-lg"
        >
          <option value="ALL">Semua Status</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* TOOLBARS */}
      <ExportToolbar
        selectedOrders={selectedOrders}
        exportCSV={exportCSV}
        exporting={exporting}
      />

      <BulkToolbar
        selectedOrders={selectedOrders}
        bulkStatus={bulkStatus}
        setBulkStatus={setBulkStatus}
        bulkUpdateStatus={bulkUpdateStatus}
        bulkDeleteOrders={bulkDeleteOrders}
      />

      {/* VIEW */}
      {loading ? (
        <div>Loading...</div>
      ) : viewMode === "card" ? (
        orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            expandedOrder={expandedOrder}
            setExpandedOrder={setExpandedOrder}
            updateStatus={updateStatus}
            deleteOrder={deleteOrder}
          />
        ))
      ) : viewMode === "table" ? (
        <OrderTable
          filteredOrders={orders}
          selectedOrders={selectedOrders}
          toggleSelectAll={toggleSelectAll}
          toggleOrderSelection={toggleOrderSelection}
          expandedOrder={expandedOrder}
          setExpandedOrder={setExpandedOrder}
          deleteOrder={deleteOrder}
        />
      ) : (
        <OrderKanban
          filteredOrders={orders}
          statuses={statuses}
          handleDragEnd={handleDragEnd}
        />
      )}

      <Pagination
        page={page}
        totalPages={pagination?.totalPages || 1}
        setPage={setPage}
      />
    </main>
  );
}