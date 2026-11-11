import { useState } from "react";
import { Button } from "@mui/material";
import { IoAdd } from "react-icons/io5";

import ShippingPartnerTable from "../components/ShippingPartners/ShippingPartnerTable";
import ShippingPartnerModal from "../components/ShippingPartners/ShippingPartnerModal";
import { isSuperAdmin } from "../utils/auth";

export default function ShippingPartners() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((prev) => prev + 1);

  const handleAdd = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEdit = (partner) => {
    setEditData(partner);
    setOpen(true);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Shipping Partners</h2>

        {isSuperAdmin() && (
          <Button
            variant="contained"
            startIcon={<IoAdd />}
            onClick={handleAdd}
            sx={{
              bgcolor: "#3D1613",
              textTransform: "none",
              "&:hover": { bgcolor: "#2a0f0d" },
            }}
          >
            Add Shipping Partner
          </Button>
        )}
      </div>

      <ShippingPartnerTable onEdit={handleEdit} refreshKey={refreshKey} />

      <ShippingPartnerModal
        open={open}
        initialData={editData}
        onClose={() => setOpen(false)}
        onSuccess={refresh}
      />
    </div>
  );
}