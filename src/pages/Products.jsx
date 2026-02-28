import React, { useState } from "react";
import ProductTable from "../components/products/ProductTable";
import { Button } from "@mui/material";
import { IoAdd, IoFunnelOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import ProductModal from "../components/products/ProductModal";

export default function Products() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ category: "", brand: "" });

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleEdit = (row) => {
    setEditData(row);
  };

  const handleClearFilters = () => {
    setFilters({ category: "", brand: "" });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Products</h2>

        <div className="flex gap-2">
          <div
            onClick={() => setShowFilters((prev) => !prev)}
            className={`relative bg-white px-3 py-2 rounded-lg flex items-center cursor-pointer shadow-sm border transition
              ${showFilters ? "border-[#3D1613] text-[#3D1613]" : "border-gray-200 text-gray-800"}`}
          >
            <IoFunnelOutline />
            <p className="ml-2 text-sm font-medium">Filters</p>
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-[#3D1613] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>

          <Button
            variant="contained"
            startIcon={<IoAdd />}
            onClick={() => setOpen(true)}
            sx={{
              bgcolor: "#3D1613",
              textTransform: "none",
              "&:hover": { bgcolor: "#2a0f0d" },
            }}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="text-xs text-gray-500 font-medium">Category</label>
            <input
              type="text"
              placeholder="e.g. Rings"
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3D1613]"
            />
          </div>

          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="text-xs text-gray-500 font-medium">Brand</label>
            <input
              type="text"
              placeholder="e.g. Chronas"
              value={filters.brand}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, brand: e.target.value }))
              }
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3D1613]"
            />
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition mt-4"
            >
              <IoMdClose size={14} />
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="mt-4">
        <ProductTable key={refreshKey} onEdit={handleEdit} filters={filters} />
      </div>

      {/* Add Modal */}
      <ProductModal open={open} onClose={() => setOpen(false)} onSuccess={handleSuccess} />

      {/* Edit Modal */}
      {editData && (
        <ProductModal
          open={Boolean(editData)}
          onClose={() => setEditData(null)}
          onSuccess={() => {
            handleSuccess();
            setEditData(null);
          }}
          initialData={editData}
        />
      )}
    </div>
  );
}
