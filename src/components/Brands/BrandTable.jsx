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
import { deleteBrand, getBrands } from "../../api/api";
import Loader from "../Loader";
import ConfirmModal from "../ConfirmModal";

export default function BrandTable({ onEdit }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchBrands = async () => {
    try {
      const res = await getBrands();
      setRows(res.data.brands);
    } catch (error) {
      toast.error("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteBrand(deleteId);
      toast.success("Brand deleted successfully");
      setDeleteId(null);
      fetchBrands();
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
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
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
        title="Delete Brand"
        message="Are you sure you want to delete this brand?"
      />
    </>
  );
}
