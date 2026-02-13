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
  Avatar,
  Box
} from "@mui/material";

import toast from "react-hot-toast";
import { deleteProductNew, getProductsView } from "../../api/api";
import Loader from "../Loader";
import ConfirmModal from "../ConfirmModal";

export default function ProductTable({ onEdit }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await getProductsView();
      setRows(res.data);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteProductNew(deleteId);
      toast.success("Product deleted successfully");
      setDeleteId(null);
      fetchProducts();
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
              <TableCell>Image</TableCell>
              <TableCell>Product</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Brand</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                    {row.image && (
                        <Avatar src={row.image} variant="rounded" />
                    )}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell align="right">{row.category}</TableCell> 
                <TableCell align="right">{row.brand}</TableCell>
                <TableCell align="right">₹{row.price}</TableCell>
                <TableCell align="right">
                  <Chip
                    label={row.stock > 0 ? `${row.stock} in stock` : "Out of Stock"}
                    color={row.stock > 0 ? "success" : "error"}
                    size="small"
                  />
                </TableCell>

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
        title="Delete Product"
        message="Are you sure you want to delete this product?"
      />
    </>
  );
}
