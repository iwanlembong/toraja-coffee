"use client";

import React from "react";
import useOrders from "@/hooks/useOrders";

import ViewToggle, {
  type ViewMode,
} from "@/components/orders/ViewToggle";
import ExportToolbar from "@/components/orders/ExportToolbar";
import BulkToolbar from "@/components/orders/BulkToolbar";
import Pagination from "@/components/orders/Pagination";
import OrderTable from "@/components/orders/OrderTable";
import OrderKanban from "@/components/orders/OrderKanban";
import OrderCard from "@/components/orders/OrderCard";
import BackToDashboard from "@/components/admin/BackToDashboard";
import OrderDetailDrawer from "@/components/orders/OrderDetailDrawer";
import ConfirmModal from "@/components/ui/ConfirmModal";

import {
  ORDER_STATUSES
} from "@/types/order";

import type {
  StatusFilter
} from "@/types/order";

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
    handleDragStart,
  } = useOrders();

  const [viewMode, setViewMode] = React.useState<ViewMode>("card");
  const [deleteOrderId, setDeleteOrderId] = React.useState<number | null>(null);

  return (
    <div>
      <BackToDashboard />

      <h1 className="text-4xl font-bold mb-8">
        Order Management
      </h1>

      {/* FILTER */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Cari nama, email, atau phone"
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
            setStatusFilter(
              e.target.value as StatusFilter
            );
          }}
          className="border p-3 rounded-lg"
        >
          <option value="ALL">Semua Status</option>
          {ORDER_STATUSES.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {/* VIEW TOGGLE */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          Total Orders: {pagination?.total || 0}
        </p>

        <ViewToggle
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
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
        <div className="space-y-8">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              expandedOrder={expandedOrder}
              setExpandedOrder={setExpandedOrder}
              updateStatus={updateStatus}
              setDeleteOrderId={setDeleteOrderId}
            />
          ))}
        </div>
      ) : viewMode === "table" ? (
        <OrderTable
          filteredOrders={orders}
          selectedOrders={selectedOrders}
          toggleSelectAll={toggleSelectAll}
          toggleOrderSelection={toggleOrderSelection}
          expandedOrder={expandedOrder}
          setExpandedOrder={setExpandedOrder}
          setDeleteOrderId={setDeleteOrderId}
        />
      ) : (
        <OrderKanban
          filteredOrders={orders}
          statuses={ORDER_STATUSES}
          handleDragEnd={handleDragEnd}
          handleDragStart={handleDragStart}
        />
      )}

      <Pagination
        page={page}
        totalPages={pagination?.totalPages || 1}
        setPage={setPage}
      />

      <OrderDetailDrawer
        order={orders.find((o) => o.id === expandedOrder)}
        onClose={() => setExpandedOrder(null)}
        updateStatus={updateStatus}
        deleteOrder={deleteOrder}
      />

      <ConfirmModal
        open={deleteOrderId !== null}
        title="Hapus Order"
        message="Apakah kamu yakin ingin menghapus order ini? Tindakan ini tidak bisa dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onClose={() => setDeleteOrderId(null)}
        onConfirm={async () => {
          if (deleteOrderId) {
            await deleteOrder(deleteOrderId);
            setDeleteOrderId(null);
          }
        }}
      />
    </div>
  );
}