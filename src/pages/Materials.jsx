import React, { useState } from "react";
import { Button } from "@mui/material";
import { IoAdd } from "react-icons/io5";
import MaterialTable from "../components/Materials/MaterialTable";
import MaterialModal from "../components/Materials/MaterialModal";

export default function Materials() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Materials</h2>
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
          Add Material
        </Button>
      </div>

      <MaterialTable key={refreshKey} onEdit={setEditData} />

      <MaterialModal open={open} onClose={() => setOpen(false)} onSuccess={handleSuccess} />

      {editData && (
        <MaterialModal
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
