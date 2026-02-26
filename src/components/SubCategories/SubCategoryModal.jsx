import { useState, useEffect } from "react";
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
import { addSubCategory, updateSubCategory } from "../../api/api";

export default function SubCategoryModal({ open, onClose, onSuccess, initialData }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    } else {
      setName("");
    }
  }, [initialData, open]);

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Sub Category name is required");

    setLoading(true);
    try {
      if (initialData) {
        await updateSubCategory(initialData.id, { name });
        toast.success("Sub Category updated successfully");
      } else {
        await addSubCategory({ name });
        toast.success("Sub Category added successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save sub category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3, p: 1 },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, pt: 1 }}>
        <Typography variant="h5" sx={{ fontFamily: "serif", fontWeight: 500 }}>
          {initialData ? "Edit Sub Category" : "Add New Sub Category"}
        </Typography>
        <IconButton onClick={onClose}>
          <IoClose />
        </IconButton>
      </Box>

      <DialogContent sx={{ mt: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
          Sub Category Name
        </Typography>
        <TextField
          placeholder="e.g. Wrist Watches"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
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
          {loading ? "Saving..." : initialData ? "Update Sub Category" : "Create Sub Category"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
