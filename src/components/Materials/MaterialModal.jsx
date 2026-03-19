import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { addMaterial, updateMaterial } from "../../api/api";
import { getApiErrorMessage } from "../../utils/apiError";

export default function MaterialModal({ open, onClose, onSuccess, initialData }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [extraPrice, setExtraPrice] = useState("0");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setExtraPrice(String(initialData.extra_price ?? 0));
    } else {
      setName("");
      setDescription("");
      setExtraPrice("0");
    }
  }, [initialData, open]);

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Material name is required");
    if (extraPrice === "" || Number.isNaN(Number(extraPrice))) {
      return toast.error("Extra price must be a number");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description);
      formData.append("extra_price", String(Number(extraPrice)));

      if (initialData) {
        await updateMaterial(initialData.id, formData);
        toast.success("Material updated successfully");
      } else {
        await addMaterial(formData);
        toast.success("Material added successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save material"));
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": { borderRadius: 2 },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, pt: 1 }}
      >
        <Typography variant="h5" sx={{ fontFamily: "serif", fontWeight: 500 }}>
          {initialData ? "Edit Material" : "Add New Material"}
        </Typography>
        <IconButton onClick={onClose}>
          <IoClose />
        </IconButton>
      </Box>

      <DialogContent sx={{ mt: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
            Material Name
          </Typography>
          <TextField
            placeholder="e.g. Premium Wood"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={inputStyles}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
            Description
          </Typography>
          <TextField
            placeholder="Short description of this material..."
            multiline
            rows={3}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={inputStyles}
          />
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
            Extra Price
          </Typography>
          <TextField
            placeholder="0"
            type="number"
            fullWidth
            value={extraPrice}
            onChange={(e) => setExtraPrice(e.target.value)}
            sx={inputStyles}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ textTransform: "none", fontSize: "1rem", color: "#555" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: "#3D1613",
            color: "#F5F5F3",
            textTransform: "none",
            fontSize: "1rem",
            px: 4,
            py: 1,
            borderRadius: 2,
            "&:hover": { bgcolor: "#2a0f0d" },
          }}
        >
          {loading ? "Saving..." : initialData ? "Update Material" : "Create Material"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
