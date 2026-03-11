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
  Button,
} from "@mui/material";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";

import Loader from "../Loader";
import ConfirmModal from "../ConfirmModal";
import useProductsTable from "../../hooks/products/useProductsTable";

export default function ProductTable({ onEdit, filters = {}, refreshKey }) {
  const {
    rows,
    loading,
    deleteId,
    setDeleteId,
    handleDelete,
    searchInput,
    setSearchInput,
    handleSearchSubmit,
    clearSearch,
    pagination,
    setPage,
  } = useProductsTable({ filters, refreshKey });

  if (loading) return <Loader />;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchSubmit();
          }}
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
        <Button
          size="small"
          variant="contained"
          onClick={handleSearchSubmit}
          sx={{ bgcolor: "#3D1613", textTransform: "none", "&:hover": { bgcolor: "#2a0f0d" } }}
        >
          Search
        </Button>
        <Button
          size="small"
          variant="text"
          onClick={clearSearch}
          sx={{ color: "#666", textTransform: "none" }}
        >
          Clear
        </Button>
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
            {rows.length > 0 ? (
              rows.map((row) => (
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
