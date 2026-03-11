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
  Avatar,
} from "@mui/material";
import { FiEdit, FiTrash2 } from "react-icons/fi";

import toast from "react-hot-toast";
import { deleteCategory, getCategories } from "../../api/api";
import Loader from "../Loader";
import ConfirmModal from "../ConfirmModal";
import { getApiErrorMessage } from "../../utils/apiError";

export default function CategoriesTable({ onEdit }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setRows(res.data.categories);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to fetch categories"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteCategory(deleteId);
      toast.success("Category deleted successfully");
      setDeleteId(null);
      fetchCategories();
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
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {row.image ? (
                    <Avatar src={row.image} variant="rounded" sx={{ width: 40, height: 40 }} />
                  ) : (
                    <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: "#f0e6e6", color: "#3D1613", fontSize: 14 }}>
                      {row.name?.[0]?.toUpperCase()}
                    </Avatar>
                  )}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {row.description || "-"}
                </TableCell>
                <TableCell>{row.priority ?? 0}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Tooltip title="Edit Category">
                      <IconButton
                        size="small"
                        onClick={() => onEdit && onEdit(row)}
                        sx={{ color: "#0E45B7", bgcolor: "#eff6ff", "&:hover": { bgcolor: "#dbeafe" } }}
                      >
                        <FiEdit size={18} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Category">
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
        title="Delete Category"
        message="Are you sure you want to delete this category?"
      />
    </>
  );
}
