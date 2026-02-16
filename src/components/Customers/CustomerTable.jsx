import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import { TextField } from "@mui/material";

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
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date Joined</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id}>
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
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={() => setDeleteId(row.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
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
