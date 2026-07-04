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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { updateOrderStatus, createShipment } from "../../api/api";

export default function OrderModal({ open, onClose, onSuccess, initialData, loading = false }) {
  const [status, setStatus] = useState("");
  const [trackingLink, setTrackingLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [shipping, setShipping] = useState(false);

  const handleCreateShipment = async () => {
    if (!initialData?.id) return;
    setShipping(true);
    try {
      const res = await createShipment(initialData.id);
      toast.success(res.data.message || "Shipment created successfully");
      
      if (res.data.status) setStatus(res.data.status);
      if (res.data.tracking_link) setTrackingLink(res.data.tracking_link);
      
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to create shipment");
    } finally {
      setShipping(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      setStatus(initialData.status || "pending");
      setTrackingLink(initialData.tracking_url || initialData.tracking_link || initialData.tracking_id || "");
    }
  }, [initialData, open]);

  const handleSubmit = async () => {
    if (!initialData?.id) return;

    setSaving(true);
    try {
      await updateOrderStatus(initialData.id, {
        status,
        tracking_link: trackingLink,
      });
      toast.success("Order updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
    },
  };

  const orderDate = initialData?.date || initialData?.created_at;
  const totalAmount = initialData?.total_price || initialData?.total_amount || 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: 3, p: 1 },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, pt: 1 }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "serif", fontWeight: 500 }}>
            {initialData ? `Order #${initialData.id}` : "Loading…"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {orderDate ? `Placed on ${new Date(orderDate).toLocaleDateString()}` : ""}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <FiX />
        </IconButton>
      </Box>

      <DialogContent sx={{ mt: 1 }}>
        {loading || !initialData ? (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
                Order Items
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
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
                    {initialData.items?.map((item, index) => {
                      const price = parseFloat(item.price || 0);
                      const qty = Number(item.quantity || 0);

                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">
                                {item.product_name || `Product #${item.product || "-"}`}
                              </Typography>
                              {(item.size || item.frame || item.material) && (
                                <Typography variant="caption" color="text.secondary" display="block">
                                  {[item.size, item.frame, item.material].filter(Boolean).join(" / ")}
                                </Typography>
                              )}
                              {item.supplier && (typeof item.supplier === 'object' ? item.supplier.name : item.supplier) && (
                                <Typography variant="caption" sx={{ color: "#0056b3", mt: 0.5, display: "block" }}>
                                  Supplier: {typeof item.supplier === 'object' ? item.supplier.name : item.supplier} 
                                  {typeof item.supplier === 'object' && item.supplier.phone ? ` (${item.supplier.phone})` : ""}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right">{qty}</TableCell>
                          <TableCell align="right">${price.toFixed(2)}</TableCell>
                          <TableCell align="right">${parseFloat(item.total ?? price * qty).toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                    {!initialData.items?.length && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Typography variant="h6">Total: ${parseFloat(totalAmount || 0).toFixed(2)}</Typography>
              </Box>
            </Box>

            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
                  Order Status
                </Typography>
                <FormControl fullWidth>
                  <Select value={status} onChange={(e) => setStatus(e.target.value)} sx={{ borderRadius: 2 }}>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
                {status === "processing" && initialData?.payment_status === "paid" && (!initialData?.shipment_id) && (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleCreateShipment}
                    disabled={shipping}
                    sx={{
                      mt: 2,
                      borderColor: "#3D1613",
                      color: "#3D1613",
                      "&:hover": { borderColor: "#2a0f0d", bgcolor: "rgba(61, 22, 19, 0.04)" }
                    }}
                  >
                    {shipping ? "Creating Shipment..." : "Create Shipment"}
                  </Button>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
                  Tracking Link
                </Typography>
                <TextField
                  placeholder="Enter tracking URL"
                  fullWidth
                  value={trackingLink}
                  onChange={(e) => setTrackingLink(e.target.value)}
                  sx={inputStyles}
                />
              </Box>

              {(initialData?.carrier || initialData?.tracking_number || initialData?.tracking_link || initialData?.shipment_id) && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
                    Shipment Information
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {initialData.carrier && (
                      <Box>
                        <Typography variant="caption" color="textSecondary" display="block">Carrier:</Typography>
                        <Typography variant="body2">{initialData.carrier}</Typography>
                      </Box>
                    )}
                    {initialData.tracking_number && (
                      <Box>
                        <Typography variant="caption" color="textSecondary" display="block">Tracking Number:</Typography>
                        <Typography variant="body2">{initialData.tracking_number}</Typography>
                      </Box>
                    )}
                    {initialData.shipment_id && (
                      <Box>
                        <Typography variant="caption" color="textSecondary" display="block">Shipment ID:</Typography>
                        <Typography variant="body2">{initialData.shipment_id}</Typography>
                      </Box>
                    )}
                    {initialData.status && (
                      <Box>
                        <Typography variant="caption" color="textSecondary" display="block">Status:</Typography>
                        <Typography variant="body2" sx={{ textTransform: "capitalize" }}>{initialData.status}</Typography>
                      </Box>
                    )}
                    {initialData.tracking_link && (
                      <Box>
                        <Typography variant="caption" color="textSecondary" display="block">Tracking:</Typography>
                        <a href={initialData.tracking_link} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", fontSize: "0.875rem" }}>
                          Track Shipment
                        </a>
                      </Box>
                    )}
                  </Paper>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit" sx={{ textTransform: "none", fontSize: "1rem", color: "#555" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || saving}
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
          {saving ? "Updating..." : "Update Order"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
