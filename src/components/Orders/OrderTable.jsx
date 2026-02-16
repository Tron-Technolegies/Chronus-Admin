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
  Chip,
} from "@mui/material";

import toast from "react-hot-toast";
import { getOrders } from "../../api/api";
import Loader from "../Loader";

export default function OrderTable({ onView }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Tracking ID</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>#{row.id}</TableCell>
                <TableCell>{row.user_email || row.user}</TableCell>{" "}
                {/* Assuming backend sends user info */}
                <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                <TableCell align="right">₹{row.total_amount}</TableCell>
                <TableCell align="right">
                  {row.tracking_id ? (
                    <span className="font-mono text-sm">{row.tracking_id}</span>
                  ) : (
                    <span className="text-gray-400 italic">Pending</span>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={row.status}
                    color={getStatusColor(row.status)}
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button variant="outlined" size="small" onClick={() => onView && onView(row)}>
                    View / Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
