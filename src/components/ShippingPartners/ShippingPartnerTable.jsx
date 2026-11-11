import { useEffect, useState } from "react";

import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Pagination,
  Stack,
} from "@mui/material";

import { FiEdit, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

import { getShippingPartners, deleteShippingPartner } from "../../api/api";
import { getApiErrorMessage } from "../../utils/apiError";
import { isSuperAdmin } from "../../utils/auth";

import ConfirmModal from "../ConfirmModal";
import Loader from "../Loader";

export default function ShippingPartnerTable({ onEdit, refreshKey = 0 }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchPartners = async () => {
    try {
      const response = await getShippingPartners();

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.shipping_partners ||
          response.data?.results ||
          response.data?.data ||
          [];

      setRows(data);
    } catch (error) {
      console.error(error);
      toast.error(getApiErrorMessage(error, "Failed to fetch shipping partners"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [refreshKey]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteShippingPartner(deleteId);

      toast.success("Shipping partner deleted");
      setDeleteId(null);
      fetchPartners();
    } catch (error) {
      console.error(error);
      setDeleteId(null);
      toast.error(getApiErrorMessage(error, "Failed to delete shipping partner"));
    }
  };

  if (loading) return <Loader />;

  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const paginatedRows = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 750 }}>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell>Partner Name</TableCell>
              <TableCell>Shipping Charge</TableCell>
              <TableCell>Estimated Delivery</TableCell>
              <TableCell>Availability</TableCell>
              {isSuperAdmin() && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((partner) => (
                <TableRow key={partner.id} hover>
                  <TableCell>{partner.name}</TableCell>

                  <TableCell>
                    AED {Number(partner.shipping_charge || 0).toFixed(2)}
                  </TableCell>

                  <TableCell>{partner.estimated_delivery || "-"}</TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={partner.availability}
                      color={
                        partner.availability === "available"
                          ? "success"
                          : "default"
                      }
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>

                  {isSuperAdmin() && (
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                        }}
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => onEdit(partner)}
                            sx={{ color: "#0E45B7" }}
                          >
                            <FiEdit />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => setDeleteId(partner.id)}
                            sx={{ color: "#ef4444" }}
                          >
                            <FiTrash2 />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isSuperAdmin() ? 5 : 4} align="center">
                  <Typography sx={{ py: 4 }}>
                    No shipping partners found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mt: 2 }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * rowsPerPage + 1} to{" "}
            {Math.min(page * rowsPerPage, rows.length)} of {rows.length} entries
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
        title="Delete Shipping Partner"
        message="Are you sure you want to delete this shipping partner?"
      />
    </>
  );
}
