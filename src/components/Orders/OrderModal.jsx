import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { updateOrderStatus } from "../../api/api";

export default function OrderModal({ open, onClose, onSuccess, initialData }) {
  const [status, setStatus] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setStatus(initialData.status);
      setTrackingId(initialData.tracking_id || "");
    }
  }, [initialData, open]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateOrderStatus(initialData.id, { 
          status, 
          tracking_id: trackingId 
      });
      toast.success("Order updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
    }
  };

  if (!initialData) return null;

  return (
    <Dialog 
        open={open} 
        onClose={onClose} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
            sx: { borderRadius: 3, p: 1 }
        }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 1 }}>
          <Box>
            <Typography variant="h5" sx={{ fontFamily: 'serif', fontWeight: 500 }}>
                Order #{initialData.id}
            </Typography>
            <Typography variant="body2" color="textSecondary">
                Placed on {new Date(initialData.created_at).toLocaleDateString()}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <IoClose />
          </IconButton>
      </Box>

      <DialogContent sx={{ mt: 1 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
            
            {/* Order Items */}
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                    Order Items
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell align="right">Qty</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {initialData.items?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.product_name || `Product #${item.product}`}</TableCell>
                                    <TableCell align="right">{item.quantity}</TableCell>
                                    <TableCell align="right">₹{item.price}</TableCell>
                                    <TableCell align="right">₹{item.price * item.quantity}</TableCell>
                                </TableRow>
                            ))}
                             {/* Mock items if none provided for preview */}
                             {!initialData.items?.length && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">No items found</TableCell>
                                </TableRow>
                             )}
                        </TableBody>
                    </Table>
                </TableContainer>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                     <Typography variant="h6">
                        Total: ₹{initialData.total_amount || 0}
                     </Typography>
                </Box>
            </Box>

            {/* Status & Tracking */}
            <Box>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#333' }}>
                        Order Status
                    </Typography>
                    <FormControl fullWidth>
                        <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="processing">Processing</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#333' }}>
                        Tracking ID
                    </Typography>
                    <TextField
                        placeholder="Enter tracking ID"
                        fullWidth
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        sx={inputStyles}
                    />
                </Box>
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
          {loading ? "Updating..." : "Update Order"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
