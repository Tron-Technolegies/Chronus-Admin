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
import { deleteMaterial, getMaterials } from "../../api/api";
import Loader from "../Loader";
import ConfirmModal from "../ConfirmModal";
import { getApiErrorMessage } from "../../utils/apiError";

export default function MaterialTable({ onEdit }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchMaterials = async () => {
    try {
      const res = await getMaterials();
      setRows(Array.isArray(res.data) ? res.data : res.data.materials || []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to fetch materials"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMaterial(deleteId);
      toast.success("Material deleted successfully");
      setDeleteId(null);
      fetchMaterials();
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
              <TableCell>Description</TableCell>
              <TableCell>Extra Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.description || "-"}</TableCell>
                <TableCell>{row.extra_price}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Tooltip title="Edit Material">
                      <IconButton
                        size="small"
                        onClick={() => onEdit && onEdit(row)}
                        sx={{ color: "#0E45B7", bgcolor: "#eff6ff", "&:hover": { bgcolor: "#dbeafe" } }}
                      >
                        <FiEdit size={18} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Material">
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
        title="Delete Material"
        message="Are you sure you want to delete this material?"
      />
    </>
  );
}
