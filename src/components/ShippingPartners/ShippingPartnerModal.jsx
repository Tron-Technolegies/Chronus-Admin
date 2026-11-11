import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";

import { addShippingPartner, updateShippingPartner } from "../../api/api";

// Reads DRF errors: {error}, {message}, {detail} or field errors like {name: ["..."]}
const getErrorMessage = (error, fallback) => {
  const data = error.response?.data;
  if (!data || typeof data !== "object") return fallback;

  if (data.error || data.message || data.detail) {
    return data.error || data.message || data.detail;
  }

  const first = Object.entries(data)[0];
  if (first) {
    const [field, msg] = first;
    return `${field}: ${Array.isArray(msg) ? msg[0] : msg}`;
  }

  return fallback;
};

export default function ShippingPartnerModal({
  open,
  onClose,
  onSuccess,
  initialData = null,
}) {
  const [name, setName] = useState("");
  const [shippingCharge, setShippingCharge] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [availability, setAvailability] = useState("available");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setName(initialData?.name || "");
    setShippingCharge(
      initialData?.shipping_charge != null
        ? String(initialData.shipping_charge)
        : ""
    );
    setEstimatedDelivery(initialData?.estimated_delivery || "");
    setAvailability(initialData?.availability || "available");
  }, [initialData, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Partner name is required");
      return;
    }

    const charge = Number(shippingCharge);

    if (shippingCharge === "" || !Number.isFinite(charge) || charge < 0) {
      toast.error("Enter a valid shipping charge");
      return;
    }

    const payload = {
      name: name.trim(),
      shipping_charge: charge.toFixed(2),
      estimated_delivery: estimatedDelivery.trim(),
      availability,
    };

    setSaving(true);

    try {
      if (initialData?.id) {
        await updateShippingPartner(initialData.id, payload);
        toast.success("Shipping partner updated");
      } else {
        await addShippingPartner(payload);
        toast.success("Shipping partner created");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, "Failed to save shipping partner"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          pt: 1,
        }}
      >
        <Typography variant="h5">
          {initialData ? "Edit Shipping Partner" : "Add Shipping Partner"}
        </Typography>

        <IconButton onClick={onClose} disabled={saving}>
          <IoClose />
        </IconButton>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            required
            label="Partner Name"
            placeholder="Enter partner name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            required
            type="number"
            label="Shipping Charge (AED)"
            inputProps={{ min: 0, step: "0.01" }}
            value={shippingCharge}
            onChange={(e) => setShippingCharge(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Estimated Delivery"
            placeholder="e.g. 3-5 business days"
            value={estimatedDelivery}
            onChange={(e) => setEstimatedDelivery(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            select
            fullWidth
            label="Availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="unavailable">Unavailable</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            sx={{
              bgcolor: "#3D1613",
              textTransform: "none",
              "&:hover": { bgcolor: "#2a0f0d" },
            }}
          >
            {saving
              ? "Saving..."
              : initialData
                ? "Update Partner"
                : "Create Partner"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}