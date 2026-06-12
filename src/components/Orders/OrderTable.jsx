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
  Pagination,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { FiEye, FiSearch, FiLink, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import { getOrders, updateOrderStatus } from "../../api/api";
import Loader from "../Loader";

export default function OrderTable({ onView, statusFilter }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [trackingInputs, setTrackingInputs] = useState({});
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

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
      activeSearch === "" ||
      row.id.toString().includes(activeSearch) ||
      getUserName(row).toLowerCase().includes(activeSearch.toLowerCase()) ||
      getEmail(row).toLowerCase().includes(activeSearch.toLowerCase());

    const matchesStatus = !statusFilter || statusFilter === "All" || row.status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setPage(1);
  }, [activeSearch, statusFilter]);

  const handleSearchSubmit = () => {
    setActiveSearch(searchInput);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
    setPage(1);
  };

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

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
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search by ID, User, or Email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchSubmit();
          }}
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
        <Button
          size="small"
          variant="contained"
          onClick={handleSearchSubmit}
          sx={{ bgcolor: "#3D1613", textTransform: "none", "&:hover": { bgcolor: "#2a0f0d" } }}
        >
          Search
        </Button>
        <Button
          size="small"
          variant="text"
          onClick={clearSearch}
          sx={{ color: "#666", textTransform: "none" }}
        >
          Clear
        </Button>
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
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row) => {
                const trackingState = trackingInputs[row.id] || { value: "", saving: false };
                return (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => onView && onView(row)}
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
                              {item.product_name || `Product #${item.product || "-"}`} 
                              {item.supplier && <span className="text-gray-500 italic"> ({item.supplier})</span>}
                              {" "}x {item.quantity || 0} (${parseFloat(item.price || 0).toFixed(2)})
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

      {totalPages > 1 && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3, mb: 1, px: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredRows.length)} of {filteredRows.length} orders
          </Typography>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(_, val) => setPage(val)} 
            color="primary" 
          />
        </Stack>
      )}
    </>
  );
}
