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
import { deleteSupplier, getSuppliers } from "../../api/api";
import Loader from "../Loader";
import ConfirmModal from "../ConfirmModal";
import { getApiErrorMessage } from "../../utils/apiError";

export default function SupplierTable({ onEdit }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchSuppliers = async () => {
    try {
      const res = await getSuppliers();
      setRows(res.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to fetch suppliers"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteSupplier(deleteId);
      toast.success("Supplier deleted successfully");
      setDeleteId(null);
      fetchSuppliers();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Delete failed"));
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>WeChat ID</TableCell>
              <TableCell>Country</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.wechat_id || "-"}</TableCell>
                <TableCell>{row.country || "-"}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Tooltip title="Edit Supplier">
                      <IconButton
                        size="small"
                        onClick={() => onEdit && onEdit(row)}
                        sx={{ color: "#0E45B7", bgcolor: "#eff6ff", "&:hover": { bgcolor: "#dbeafe" } }}
                      >
                        <FiEdit size={18} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Supplier">
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
        title="Delete Supplier"
        message="Are you sure you want to delete this supplier?"
      />
    </>
  );
}
