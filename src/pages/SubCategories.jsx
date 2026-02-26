import React, { useState } from "react";
import SubCategoriesTable from "../components/SubCategories/SubCategoriesTable";
import { Button } from "@mui/material";
import { IoAdd } from "react-icons/io5";
import SubCategoryModal from "../components/SubCategories/SubCategoryModal";

export default function SubCategories() {
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
        <h2 className="text-2xl font-semibold">Sub Categories</h2>
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
          Add Sub Category
        </Button>
      </div>

      <SubCategoriesTable key={refreshKey} onEdit={handleEdit} />

      {/* Add Modal */}
      <SubCategoryModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Edit Modal */}
      {editData && (
        <SubCategoryModal
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
