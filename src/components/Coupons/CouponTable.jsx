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
  Tooltip,
  Box,
} from "@mui/material";
import { FiEdit, FiTrash2 } from "react-icons/fi";

import toast from "react-hot-toast";
import { deleteCoupon, getCoupons } from "../../api/api";
import Loader from "../Loader";
import ConfirmModal from "../ConfirmModal";

export default function CouponTable({ onEdit }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchCoupons = async () => {
    try {
      const res = await getCoupons();
      setRows(res.data.coupons);
    } catch (error) {
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteCoupon(deleteId);
      toast.success("Coupon deleted successfully");
      setDeleteId(null);
      fetchCoupons();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Expiration</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.code}</TableCell>
                <TableCell>₹{row.discount}</TableCell>
                <TableCell>{row.expiration_date}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Tooltip title="Edit Coupon">
                      <IconButton
                        size="small"
                        onClick={() => onEdit && onEdit(row)}
                        sx={{ color: "#0E45B7", bgcolor: "#eff6ff", "&:hover": { bgcolor: "#dbeafe" } }}
                      >
                        <FiEdit size={18} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Coupon">
                      <IconButton
                        size="small"
                        onClick={() => setDeleteId(row.id)}
                        sx={{ color: "#ef4444", bgcolor: "#fef2f2", "&:hover": { bgcolor: "#fee2e2" } }}
                      >
                        <FiTrash2 size={18} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmModal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon?"
      />
    </>
  );
}
