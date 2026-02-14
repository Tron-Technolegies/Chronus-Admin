import React, { useState } from "react";
import OrderTable from "../components/Orders/OrderTable";
import OrderModal from "../components/Orders/OrderModal";
import { IoFunnelOutline } from "react-icons/io5";

export default function Orders() {
  const [viewData, setViewData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleView = (row) => {
    setViewData(row);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Orders</h2>
        
        <div className="flex gap-2">
            <div className="bg-white px-3 py-2 rounded-lg flex items-center text-gray-800 cursor-pointer shadow-sm">
                <IoFunnelOutline />
                <p className="ml-2">Filters</p>
            </div>
        </div>
      </div>

      <div className="mt-4">
        <OrderTable key={refreshKey} onView={handleView} />
      </div>

       {/* View/Edit Modal */}
       {viewData && (
        <OrderModal
          open={Boolean(viewData)}
          onClose={() => setViewData(null)}
          onSuccess={() => {
            handleSuccess();
            setViewData(null);
          }}
          initialData={viewData}
        />
      )}
    </div>
  );
}
