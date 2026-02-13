import React, { useState } from "react";
import ProductTable from "../components/products/ProductTable";
import { Button } from "@mui/material";
import { IoAdd, IoFunnelOutline } from "react-icons/io5";
import ProductModal from "../components/products/ProductModal";

export default function Products() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleEdit = (row) => {
    setEditData(row);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Products</h2>

        <div className="flex gap-2">
          <div className="bg-white px-3 py-2 rounded-lg flex items-center text-gray-800 cursor-pointer shadow-sm">
            <IoFunnelOutline />
            <p className="ml-2">Filters</p>
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

      <div className="mt-4">
        <ProductTable key={refreshKey} onEdit={handleEdit} />
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
