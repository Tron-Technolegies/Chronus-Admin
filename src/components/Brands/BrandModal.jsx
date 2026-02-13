import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
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
import { addBrand, updateBrand } from "../../api/api";

export default function BrandModal({ open, onClose, onSuccess, initialData }) {
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
    if (!name.trim()) return toast.error("Brand name is required");

    setLoading(true);
    try {
      if (initialData) {
        await updateBrand(initialData.id, { name });
        toast.success("Brand updated successfully");
      } else {
        await addBrand({ name });
        toast.success("Brand added successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save brand");
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
            sx: { borderRadius: 3, p: 1 }
        }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 1 }}>
          <Typography variant="h5" sx={{ fontFamily: 'serif', fontWeight: 500 }}>
            {initialData ? "Edit Brand" : "Add New Brand"}
          </Typography>
          <IconButton onClick={onClose}>
            <IoClose />
          </IconButton>
      </Box>

      <DialogContent sx={{ mt: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
            Brand Name
        </Typography>
        <TextField
          placeholder="e.g. Rolex"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
                borderRadius: 2,
            }
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
            onClick={onClose} 
            color="inherit" 
            sx={{ textTransform: 'none', fontSize: '1rem', color: '#555' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ 
            bgcolor: "#3D1613", 
            color: "#F5F5F3", // Off-white
            textTransform: 'none',
            fontSize: '1rem',
            px: 4,
            py: 1,
            borderRadius: 2,
            "&:hover": { bgcolor: "#2a0f0d" },
          }}
        >
          {loading ? "Saving..." : initialData ? "Update Brand" : "Create Brand"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
