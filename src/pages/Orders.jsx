import React, { useState } from "react";
import OrderTable from "../components/Orders/OrderTable";
import OrderModal from "../components/Orders/OrderModal";
import toast from "react-hot-toast";
import { getOrderDetail } from "../api/api";

export default function Orders() {
  const [viewData, setViewData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState("All");
  const [detailLoading, setDetailLoading] = useState(false);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleView = async (row) => {
    if (!row?.id) return;
    toast.loading("Fetching order details...", { id: `order-${row.id}` }); // Debug feedback
    setModalOpen(true);
    setDetailLoading(true);
    setViewData(row);

    try {
      const res = await getOrderDetail(row.id);
      setViewData(res.data);
      toast.dismiss(`order-${row.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch order details", { id: `order-${row.id}` });
    } finally {
      setDetailLoading(false);
    }
  };

  const tabs = ["All", "Pending", "Processing", "Shipped", "Completed", "Cancelled"];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              statusFilter === tab
                ? "bg-[#0E45B7] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <OrderTable key={refreshKey} onView={handleView} statusFilter={statusFilter} />
      </div>

      <OrderModal
        open={modalOpen}
        loading={detailLoading}
        onClose={() => {
          setModalOpen(false);
          setViewData(null);
          setDetailLoading(false);
        }}
        onSuccess={() => {
          handleSuccess();
          setModalOpen(false);
          setViewData(null);
          setDetailLoading(false);
        }}
        initialData={viewData}
      />
    </div>
  );
}
