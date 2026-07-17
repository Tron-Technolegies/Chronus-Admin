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
import { addSupplier, updateSupplier } from "../../api/api";

export default function SupplierModal({ open, onClose, onSuccess, initialData }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [wechat_id, setWechatId] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setWechatId(initialData.wechat_id || "");
      setCountry(initialData.country || "");
      setAddress(initialData.address || "");
      setNotes(initialData.notes || "");
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setWechatId("");
      setCountry("");
      setAddress("");
      setNotes("");
    }
  }, [initialData, open]);

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Supplier name is required");

    setLoading(true);
    try {
      const payload = { name, email, phone, wechat_id, country, address, notes };
      
      if (initialData) {
        await updateSupplier(initialData.id, payload);
        toast.success("Supplier updated successfully");
      } else {
        await addSupplier(payload);
        toast.success("Supplier added successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save supplier");
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
            {initialData ? "Edit Supplier" : "Add New Supplier"}
          </Typography>
          <IconButton onClick={onClose}>
            <IoClose />
          </IconButton>
      </Box>

      <DialogContent sx={{ mt: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
            Supplier Name
        </Typography>
        <TextField
          placeholder="e.g. John Doe"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
                borderRadius: 2,
            }
          }}
        />

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
            Email
        </Typography>
        <TextField
          placeholder="e.g. john@example.com"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
                borderRadius: 2,
            }
          }}
        />

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
            Phone
        </Typography>
        <TextField
          placeholder="e.g. +1 234 567 890"
          type="text"
          fullWidth
          variant="outlined"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
                borderRadius: 2,
            }
          }}
        />

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                WeChat ID
            </Typography>
            <TextField
              placeholder="e.g. johndoe123"
              type="text"
              fullWidth
              variant="outlined"
              value={wechat_id}
              onChange={(e) => setWechatId(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                Country
            </Typography>
            <TextField
              placeholder="e.g. USA"
              type="text"
              fullWidth
              variant="outlined"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
            Address
        </Typography>
        <TextField
          placeholder="Enter full address..."
          type="text"
          fullWidth
          variant="outlined"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': { borderRadius: 2 }
          }}
        />

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
            Notes
        </Typography>
        <TextField
          placeholder="Any additional notes..."
          type="text"
          multiline
          rows={3}
          fullWidth
          variant="outlined"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: 2 }
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
          {loading ? "Saving..." : initialData ? "Update Supplier" : "Create Supplier"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
