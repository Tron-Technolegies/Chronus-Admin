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
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { FiEye, FiSearch, FiLink, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import { getOrders, updateOrderStatus } from "../../api/api";
import Loader from "../Loader";

export default function OrderTable({ onView, statusFilter }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [trackingInputs, setTrackingInputs] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setRows(res.data.orders || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
      });
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, tracking_link: trackingValue } : r)));
      toast.success("Tracking link saved");
    } catch {
      toast.error("Failed to save tracking link");
    } finally {
      setTrackingInputs((prev) => ({ ...prev, [row.id]: { ...prev[row.id], saving: false } }));
    }
  };

  const handleStatusChange = async (row, nextStatus) => {
    const previousStatus = row.status;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: nextStatus } : r)));

    try {
      await updateOrderStatus(row.id, {
        status: nextStatus,
        tracking_link: trackingInputs[row.id]?.value || row.tracking_link || "",
      });
      toast.success("Order status updated");
    } catch {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: previousStatus } : r)));
      toast.error("Failed to update status");
    }
  };

  const getUserName = (row) => {
    if (typeof row.user === "string") return row.user;
    if (row.user && typeof row.user === "object") {
      const name = `${row.user.first_name || ""} ${row.user.last_name || ""}`.trim();
      return name || row.user.email || `User #${row.user.id || "-"}`;
    }
    return "Guest";
  };

  const getEmail = (row) => {
    if (typeof row.email === "string") return row.email;
    if (row.user && typeof row.user === "object" && typeof row.user.email === "string") {
      return row.user.email;
    }
    return "-";
  };

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      search === "" ||
      row.id.toString().includes(search) ||
      getUserName(row).toLowerCase().includes(search.toLowerCase()) ||
      getEmail(row).toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter || statusFilter === "All" || row.status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "shipped":
        return "primary";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
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
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User / Details</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Total
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 280 }}>Items</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 240 }}>Tracking Link</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Status
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => {
                const trackingState = trackingInputs[row.id] || { value: "", saving: false };
                return (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={() => onView && onView(row)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>#{row.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{getUserName(row)}</span>
                        <span className="text-xs text-gray-500">{getEmail(row)}</span>
                        {row.phone && <span className="text-xs text-gray-400">{row.phone}</span>}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      ${parseFloat(row.total_amount || 0).toFixed(2)}
                    </TableCell>

                    <TableCell>
                      {Array.isArray(row.items) && row.items.length > 0 ? (
                        <div className="space-y-1">
                          {row.items.map((item, index) => (
                            <div key={`${row.id}-item-${index}`} className="text-xs text-gray-700 leading-5">
                              {item.product_name || `Product #${item.product || "-"}`} x {item.quantity || 0} (${parseFloat(item.price || 0).toFixed(2)})
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No items</span>
                      )}
                    </TableCell>

                    <TableCell onClick={(e) => e.stopPropagation()}>
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
                        {row.tracking_link && (
                          <Tooltip title="Open tracking link">
                            <a
                              href={row.tracking_link}
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

                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1 }}>
                        <Chip
                          label={row.status}
                          color={getStatusColor(row.status)}
                          size="small"
                          sx={{ textTransform: "capitalize", fontWeight: 500 }}
                        />
                        <FormControl size="small" sx={{ minWidth: 130 }}>
                          <Select
                            value={row.status}
                            onChange={(e) => handleStatusChange(row, e.target.value)}
                            sx={{ fontSize: "0.78rem", borderRadius: "6px" }}
                          >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="processing">Processing</MenuItem>
                            <MenuItem value="shipped">Shipped</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="View Order Details">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onView && onView(row);
                          }}
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
                <TableCell colSpan={8} align="center" sx={{ py: 6, color: "gray" }}>
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
