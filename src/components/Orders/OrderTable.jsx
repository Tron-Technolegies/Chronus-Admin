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
import { FiEye, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";
import { getOrders } from "../../api/api";
import Loader from "../Loader";

export default function OrderTable({ onView, statusFilter }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User / Details</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Tracking</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
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
                  <TableCell align="right">
                    {row.tracking_link ? (
                      <a
                        href={row.tracking_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Track
                      </a>
                    ) : (
                      <span className="text-gray-400 italic text-sm">-</span>
                    )}
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
                    <Tooltip title="View Details">
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
              ))
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
