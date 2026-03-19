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
import { IoClose, IoCloudUploadOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { addFrame, updateFrame } from "../../api/api";
import { getApiErrorMessage } from "../../utils/apiError";

export default function FrameModal({ open, onClose, onSuccess, initialData }) {
  const [name, setName] = useState("");
  const [extraPrice, setExtraPrice] = useState("0");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setExtraPrice(String(initialData.extra_price ?? 0));
      setImage(null);
      setPreview(initialData.image || null);
    } else {
      setName("");
      setExtraPrice("0");
      setImage(null);
      setPreview(null);
    }
  }, [initialData, open]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setImage(null);
    setPreview(initialData?.image || null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Frame name is required");
    if (extraPrice === "" || Number.isNaN(Number(extraPrice))) {
      return toast.error("Extra price must be a number");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("extra_price", String(Number(extraPrice)));
      if (image) formData.append("image", image);

      if (initialData) {
        await updateFrame(initialData.id, formData);
        toast.success("Frame updated successfully");
      } else {
        await addFrame(formData);
        toast.success("Frame added successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save frame"));
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
          {initialData ? "Edit Frame" : "Add New Frame"}
        </Typography>
        <IconButton onClick={onClose}>
          <IoClose />
        </IconButton>
      </Box>

      <DialogContent sx={{ mt: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
            Frame Name
          </Typography>
          <TextField
            placeholder="e.g. Classic Black Frame"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={inputStyles}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
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

        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
            Frame Image
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
                  alt="Frame preview"
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
          {loading ? "Saving..." : initialData ? "Update Frame" : "Create Frame"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
