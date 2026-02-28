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
import { IoClose, IoCloudUploadOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { addCategory, updateCategory } from "../../api/api";

export default function CategoryModal({ open, onClose, onSuccess, initialData }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setImage(null);
      setPreview(initialData.image || null);
    } else {
      setName("");
      setDescription("");
      setImage(null);
      setPreview(null);
    }
  }, [initialData, open]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Category name is required");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (image) formData.append("image", image);

      if (initialData) {
        await updateCategory(initialData.id, formData);
        toast.success("Category updated successfully");
      } else {
        await addCategory(formData);
        toast.success("Category added successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save category");
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, pt: 1 }}>
        <Typography variant="h5" sx={{ fontFamily: "serif", fontWeight: 500 }}>
          {initialData ? "Edit Category" : "Add New Category"}
        </Typography>
        <IconButton onClick={onClose}>
          <IoClose />
        </IconButton>
      </Box>

      <DialogContent sx={{ mt: 1 }}>
        {/* Name */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
            Category Name
          </Typography>
          <TextField
            placeholder="e.g. Watches"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={inputStyles}
          />
        </Box>

        {/* Description */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
            Description
          </Typography>
          <TextField
            placeholder="Brief description of this category..."
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={inputStyles}
          />
        </Box>

        {/* Image Upload */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
            Category Image
          </Typography>
          <Box sx={{ position: "relative" }}>
            <Box
              component="label"
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 3,
                height: 150,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                bgcolor: "#FAFAFA",
                "&:hover": { bgcolor: "#F0F0F0", borderColor: "#999" },
              }}
            >
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              {preview ? (
                <Box
                  component="img"
                  src={preview}
                  alt="Preview"
                  sx={{ width: "100%", height: "100%", objectFit: "contain", p: 1, borderRadius: 3 }}
                />
              ) : (
                <>
                  <IoCloudUploadOutline size={32} color="#666" />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Click to upload image
                  </Typography>
                </>
              )}
            </Box>
            {preview && (
              <IconButton
                size="small"
                onClick={handleRemoveImage}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 24,
                  height: 24,
                  bgcolor: "#3D1613",
                  color: "#fff",
                  "&:hover": { bgcolor: "#5c2420" },
                }}
              >
                <IoClose size={13} />
              </IconButton>
            )}
          </Box>
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
          {loading ? "Saving..." : initialData ? "Update Category" : "Create Category"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
