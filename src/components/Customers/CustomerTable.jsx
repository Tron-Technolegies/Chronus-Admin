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
  Avatar,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { FiSearch, FiTrash2 } from "react-icons/fi";

import toast from "react-hot-toast";
import { deleteCustomer, getCustomers } from "../../api/api";
import Loader from "../Loader";
import ConfirmModal from "../ConfirmModal";

export default function CustomerTable({ filters = {} }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchCustomers = async (searchValue = "") => {
    try {
      const res = await getCustomers({
        ...(searchValue && { search: searchValue }),
        ...filters,
      });
      setRows(res.data.users);
    } catch (error) {
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(search);
  }, [filters]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCustomers(search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  const handleDelete = async () => {
    try {
      await deleteCustomer(deleteId);
      toast.success("Customer deleted successfully");
      setDeleteId(null);
      fetchCustomers(search);
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      {/* Search Bar */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search by username or email..."
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
              <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date Joined</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "#3D1613" }}>
                        {row.username ? row.username[0].toUpperCase() : "U"}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {row.username}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {row.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{new Date(row.date_joined).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete Customer">
                      <IconButton
                        size="small"
                        onClick={() => setDeleteId(row.id)}
                        sx={{ color: "#ef4444", bgcolor: "#fef2f2", "&:hover": { bgcolor: "#fee2e2" } }}
                      >
                        <FiTrash2 size={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6, color: "gray" }}>
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmModal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
      />
    </>
  );
}
