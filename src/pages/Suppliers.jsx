import React, { useState } from "react";
import SupplierTable from "../components/Suppliers/SupplierTable";
import { Button } from "@mui/material";
import { IoAdd } from "react-icons/io5";
import SupplierModal from "../components/Suppliers/SupplierModal";
import { isSuperAdmin } from "../utils/auth";

export default function Suppliers() {
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
        <h2 className="text-2xl font-semibold">Suppliers</h2>
        {isSuperAdmin() && (
          <Button
            variant="contained"
            startIcon={<IoAdd />}
            onClick={() => setOpen(true)}
            sx={{
              bgcolor: "#3D1613",
              textTransform: 'none',
              "&:hover": { bgcolor: "#2a0f0d" },
            }}
          >
            Add Supplier
          </Button>
        )}
      </div>

      <SupplierTable key={refreshKey} onEdit={handleEdit} />

      {/* Add Modal */}
      <SupplierModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
      />

       {/* Edit Modal */}
       {editData && (
        <SupplierModal
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
