import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Box,
  TextField,
  InputAdornment,
  Tooltip,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";

import toast from "react-hot-toast";
import { deleteProductNew, getProductsView } from "../../api/api";
import Loader from "../Loader";
import ConfirmModal from "../ConfirmModal";
import { getApiErrorMessage } from "../../utils/apiError";

export default function ProductTable({ onEdit, filters = {} }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_products: 0,
    has_next: false,
    has_previous: false,
  });

  const fetchProducts = useCallback(async (pageNumber = 1) => {
    setLoading(true);

    try {
      const res = await getProductsView({ page: pageNumber });
      const responseData = res.data || {};
      const products = Array.isArray(responseData.products) ? responseData.products : [];
      const serverPagination = responseData.pagination || {};

      setRows(products);
      setPagination({
        current_page: serverPagination.current_page || pageNumber,
        total_pages: serverPagination.total_pages || 1,
        total_products: serverPagination.total_products || products.length,
        has_next: Boolean(serverPagination.has_next),
        has_previous: Boolean(serverPagination.has_previous),
      });
      setPage(serverPagination.current_page || pageNumber);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to fetch products"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [fetchProducts, page]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteProductNew(deleteId);
      toast.success("Product deleted successfully");
      setDeleteId(null);
      fetchProducts(page);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Delete failed"));
    }
  };

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      search === "" ||
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      (row.category && row.category.name.toLowerCase().includes(search.toLowerCase())) ||
      (row.brand && row.brand.name.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      !filters.category ||
      (row.category &&
        row.category.name.toLowerCase().includes(filters.category.toLowerCase()));

    const matchesBrand =
      !filters.brand ||
      (row.brand &&
        row.brand.name.toLowerCase().includes(filters.brand.toLowerCase()));

    return matchesSearch && matchesCategory && matchesBrand;
  });

  if (loading) return <Loader />;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: 300,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "white",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch className="text-gray-400" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Category
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Brand
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Price
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Stock
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    {row.image ? (
                      <Avatar src={row.image} variant="rounded" sx={{ width: 40, height: 40 }} />
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>
                    <span className="font-medium text-gray-900">{row.name}</span>
                  </TableCell>

                  <TableCell align="right">{row.category ? row.category.name : "-"}</TableCell>

                  <TableCell align="right">{row.brand ? row.brand.name : "-"}</TableCell>

                  <TableCell align="right">
                    <span className="font-semibold text-gray-700">${row.price}</span>
                  </TableCell>

                  <TableCell align="right">
                    <Chip
                      label={row.stock > 0 ? `${row.stock} in stock` : "Out of Stock"}
                      color={row.stock > 0 ? "success" : "error"}
                      size="small"
                      variant={row.stock > 0 ? "filled" : "outlined"}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      <Tooltip title="Edit Product">
                        <IconButton
                          size="small"
                          onClick={() => onEdit && onEdit(row)}
                          sx={{
                            color: "#0E45B7",
                            bgcolor: "#eff6ff",
                            "&:hover": { bgcolor: "#dbeafe" },
                          }}
                        >
                          <FiEdit size={18} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Product">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteId(row.id)}
                          sx={{
                            color: "#ef4444",
                            bgcolor: "#fef2f2",
                            "&:hover": { bgcolor: "#fee2e2" },
                          }}
                        >
                          <FiTrash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, color: "gray" }}>
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination.total_pages > 1 && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mt: 2 }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing page {pagination.current_page} of {pagination.total_pages} ({pagination.total_products} products)
          </Typography>
          <Pagination
            page={pagination.current_page}
            count={pagination.total_pages}
            color="primary"
            onChange={(_, value) => setPage(value)}
          />
        </Stack>
      )}

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
