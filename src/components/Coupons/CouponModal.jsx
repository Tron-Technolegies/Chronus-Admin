import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { addCoupon, updateCoupon } from "../../api/api";

export default function CouponModal({ open, onClose, onSuccess, initialData }) {
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    expiration_date: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code,
        discount: initialData.discount,
        expiration_date: initialData.expiration_date,
      });
    } else {
      setFormData({
        code: "",
        discount: "",
        expiration_date: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.code || !formData.discount || !formData.expiration_date) {
      return toast.error("All fields are required");
    }

    setLoading(true);
    try {
      if (initialData) {
        await updateCoupon(initialData.id, formData);
        toast.success("Coupon updated successfully");
      } else {
        await addCoupon(formData);
        toast.success("Coupon added successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save coupon");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
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
            {initialData ? "Edit Coupon" : "Add New Coupon"}
          </Typography>
          <IconButton onClick={onClose}>
            <IoClose />
          </IconButton>
      </Box>

      <DialogContent sx={{ mt: 1 }}>
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#333' }}>
                Coupon Code
            </Typography>
            <TextField
                placeholder="e.g. SUMMER2024"
                name="code"
                fullWidth
                value={formData.code}
                onChange={handleChange}
                sx={inputStyles}
            />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#333' }}>
                    Discount Amount
                </Typography>
                <TextField
                    placeholder="0.00"
                    name="discount"
                    type="number"
                    fullWidth
                    value={formData.discount}
                    onChange={handleChange}
                    sx={inputStyles}
                />
            </Box>
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#333' }}>
                    Expiration Date
                </Typography>
                <TextField
                    name="expiration_date"
                    type="date"
                    fullWidth
                    value={formData.expiration_date}
                    onChange={handleChange}
                    sx={inputStyles}
                    InputLabelProps={{ shrink: true }}
                />
            </Box>
        </Box>
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
            color: "#F5F5F3",
            textTransform: 'none',
            fontSize: '1rem',
            px: 4,
            py: 1,
            borderRadius: 2,
            "&:hover": { bgcolor: "#2a0f0d" },
          }}
        >
          {loading ? "Saving..." : initialData ? "Update Coupon" : "Create Coupon"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
