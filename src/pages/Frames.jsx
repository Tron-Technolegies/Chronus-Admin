import React, { useState } from "react";
import { Button } from "@mui/material";
import { IoAdd } from "react-icons/io5";
import FrameTable from "../components/Frames/FrameTable";
import FrameModal from "../components/Frames/FrameModal";

export default function Frames() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Frames</h2>
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
          Add Frame
        </Button>
      </div>

      <FrameTable key={refreshKey} onEdit={setEditData} />

      <FrameModal open={open} onClose={() => setOpen(false)} onSuccess={handleSuccess} />

      {editData && (
        <FrameModal
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
