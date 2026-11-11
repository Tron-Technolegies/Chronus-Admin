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
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { FiEdit, FiTrash2 } from "react-icons/fi";

import toast from "react-hot-toast";
import { deleteCoupon, getCoupons } from "../../api/api";
import Loader from "../Loader";
import ConfirmModal from "../ConfirmModal";
import { getApiErrorMessage } from "../../utils/apiError";
import { isSuperAdmin } from "../../utils/auth";

export default function CouponTable({ onEdit }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchCoupons = async () => {
    try {
      const res = await getCoupons();
      setRows(res.data.coupons || []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to fetch coupons"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteCoupon(deleteId);
      toast.success("Coupon deleted successfully");
      setDeleteId(null);
      fetchCoupons();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Delete failed"));
    }
  };

  if (loading) return <Loader />;

  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const paginatedRows = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Expiration</TableCell>
              {isSuperAdmin() && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.code}</TableCell>
                <TableCell>₹{row.discount}</TableCell>
                <TableCell>{row.expiration_date}</TableCell>
                {isSuperAdmin() && (
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
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {((page - 1) * rowsPerPage) + 1} to {Math.min(page * rowsPerPage, rows.length)} of {rows.length} entries
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
          />
        </Stack>
      )}

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
