import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Box,
  Tooltip,
} from "@mui/material";
import { FiEye, FiSearch, FiLink, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import { getOrders, updateOrderStatus } from "../../api/api";
import Loader from "../Loader";

export default function OrderTable({ onView, statusFilter }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  // Per-row tracking link state: { [orderId]: { value, saving } }
  const [trackingInputs, setTrackingInputs] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setRows(res.data.orders);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Initialise tracking inputs from fetched rows
  useEffect(() => {
    if (rows.length > 0) {
      const initial = {};
      rows.forEach((r) => {
        initial[r.id] = { value: r.tracking_link || r.tracking_id || "", saving: false };
      });
      setTrackingInputs(initial);
    }
  }, [rows]);

  const handleTrackingChange = (id, value) => {
    setTrackingInputs((prev) => ({ ...prev, [id]: { ...prev[id], value } }));
  };

  const handleTrackingSave = async (row) => {
    const trackingValue = trackingInputs[row.id]?.value || "";
    setTrackingInputs((prev) => ({ ...prev, [row.id]: { ...prev[row.id], saving: true } }));
    try {
      await updateOrderStatus(row.id, {
        status: row.status,
        tracking_link: trackingValue,
        tracking_id: trackingValue,
      });
      // Update local row so "Track" link reflects save
      setRows((prev) =>
        prev.map((r) =>
          r.id === row.id ? { ...r, tracking_link: trackingValue, tracking_id: trackingValue } : r
        )
      );
      toast.success("Tracking link saved");
    } catch {
      toast.error("Failed to save tracking link");
    } finally {
      setTrackingInputs((prev) => ({ ...prev, [row.id]: { ...prev[row.id], saving: false } }));
    }
  };

  // Filter logic
  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      search === "" ||
      row.id.toString().includes(search) ||
      (row.user && row.user.toLowerCase().includes(search.toLowerCase())) ||
      (row.email && row.email.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      !statusFilter || statusFilter === "All" || row.status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":   return "warning";
      case "processing":return "info";
      case "shipped":   return "primary";
      case "completed": return "success";
      case "cancelled": return "error";
      default:          return "default";
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search by ID, User, or Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: 300,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "white",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch className="text-gray-400" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <Table sx={{ minWidth: 750 }}>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User / Details</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 240 }}>Tracking Link</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => {
                const trackingState = trackingInputs[row.id] || { value: "", saving: false };
                return (
                  <TableRow key={row.id} hover>
                    <TableCell>#{row.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{row.user}</span>
                        <span className="text-xs text-gray-500">{row.email}</span>
                        {row.phone && <span className="text-xs text-gray-400">{row.phone}</span>}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      ₹{parseFloat(row.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </TableCell>

                    {/* Inline tracking link input */}
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <TextField
                          size="small"
                          placeholder="Paste tracking URL..."
                          value={trackingState.value}
                          onChange={(e) => handleTrackingChange(row.id, e.target.value)}
                          sx={{
                            flex: 1,
                            "& .MuiOutlinedInput-root": { borderRadius: "6px", fontSize: "0.78rem" },
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FiLink size={13} style={{ color: "#9ca3af" }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Tooltip title="Save tracking link">
                          <IconButton
                            size="small"
                            disabled={trackingState.saving}
                            onClick={() => handleTrackingSave(row)}
                            sx={{
                              bgcolor: "#3D1613",
                              color: "#fff",
                              borderRadius: "6px",
                              "&:hover": { bgcolor: "#2a0f0d" },
                              "&.Mui-disabled": { bgcolor: "#ccc", color: "#fff" },
                            }}
                          >
                            <FiCheck size={14} />
                          </IconButton>
                        </Tooltip>
                        {/* Quick visit link if already saved */}
                        {(row.tracking_link || row.tracking_id) && (
                          <Tooltip title="Open tracking link">
                            <a
                              href={row.tracking_link || row.tracking_id}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#3b82f6", fontSize: "0.75rem", whiteSpace: "nowrap" }}
                            >
                              Track
                            </a>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>

                    <TableCell align="right">
                      <Chip
                        label={row.status}
                        color={getStatusColor(row.status)}
                        size="small"
                        sx={{ textTransform: "capitalize", fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Order Details">
                        <IconButton
                          size="small"
                          onClick={() => onView && onView(row)}
                          sx={{ color: "#0E45B7", bgcolor: "#eff6ff", "&:hover": { bgcolor: "#dbeafe" } }}
                        >
                          <FiEye size={18} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, color: "gray" }}>
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
