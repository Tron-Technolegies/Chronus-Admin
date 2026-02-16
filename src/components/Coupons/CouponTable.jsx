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
} from "@mui/material";

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
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => onEdit && onEdit(row)}
                  >
                    Edit
                  </Button>

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
